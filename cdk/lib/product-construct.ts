import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as sc from "@aws-cdk/aws-servicecatalog-alpha"
import { EmrStack, EmrStackProps } from "./emr-product-stack";
import * as ec2 from "aws-cdk-lib/aws-ec2"
import * as iam from "aws-cdk-lib/aws-iam"
import * as sagemaker from "aws-cdk-lib/aws-sagemaker"
import { addIngress } from "./add-ingress";
import { setupMaster } from "cluster";

// TODO: This construct could be separated into its own repo and 
// published with JSII, after adding some configurable properties
// and replacing the initialization scripts from the blog bucket at
// s3://aws-ml-blog/artifacts/sma-milestone1/
// with a mechanism that allows the user of the construct to modify them.

/**
 * 
 */
export class ProductConstructProps {

}

/**
 * This construct creates a VPC, a SageMaker domain, and a Service Catalog product.
 * 
 * The service catalog product template is created in `emr-product-stack.ts`.
 */
export class ProductConstruct extends Construct {
    constructor(scope: Construct, id: string, props?: ProductConstructProps) {
        super(scope, id);
    
        // Create the VPC
        const vpc = new ec2.Vpc(this, "vpc", {})

        // Add VPC endpoints

        const addEndpoint = function(s:string) {
          vpc.addInterfaceEndpoint("ep-" + s.split(".").join("-"), {
            privateDnsEnabled: true, 
            service: new ec2.InterfaceVpcEndpointService(
              cdk.Fn.sub("com.amazonaws.${AWS::Region}." + s))
          })
        }

        addEndpoint("sagemaker.api")
        addEndpoint("sagemaker.runtime")
        addEndpoint("sts")
        addEndpoint("monitoring")
        addEndpoint("logs")
        addEndpoint("ecr.dkr")
        addEndpoint("ecr.api")
        
        const ec2SubnetIdExportName = "subnet-id"
        const ec2VpcIdExportName = "vpc-id"

        new cdk.CfnOutput(this, "vpcidout", {
          description: "VPC Id output export", 
          value: vpc.vpcId, 
          exportName: ec2VpcIdExportName,
        })

        new cdk.CfnOutput(this, "subnetidout", {
          description: "Subnet Id output export", 
          value: vpc.privateSubnets[0].subnetId,
          exportName: ec2SubnetIdExportName
        })

        const sageMakerSGIdExportName = "sg-id"

        // Service catalog portfolio
        const portfolio = new sc.Portfolio(this, 'sagemaker-emr-portfolio', {
          displayName: 'SageMaker EMR Product Portfolio',
          providerName: 'AWS',
        });

        // Service catalog product
        const emrStackProps: EmrStackProps = {
          ec2SubnetIdExportName,
          ec2VpcIdExportName,
          sageMakerSGIdExportName,
        }
        const emrStack = new EmrStack(this, 'EmrProduct', emrStackProps);
        const template = sc.CloudFormationTemplate.fromProductStack(emrStack)
        const product = new sc.CloudFormationProduct(this, 'sagemaker-emr-product', {
          productName: "SageMaker EMR Product",
          owner: "AWS",
          productVersions: [
            {
              productVersionName: "v1",
              cloudFormationTemplate: template,
            },
          ],
        });

        // This tag is what makes the template visible from SageMaker Studio
        cdk.Tags.of(product).add('sagemaker:studio-visibility:emr', 'true')

        // Associate the product with the portfolio
        portfolio.addProduct(product)
        
        // Launch constraint - this is the role that is assumed when a Studio user
        // clicks on the button to create a new EMR cluster
        const constraint = new iam.Role(this, "launch-constraint", {
          assumedBy: new iam.ServicePrincipal("servicecatalog.amazonaws.com"),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName("AWSServiceCatalogAdminFullAccess"),
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEMRFullAccessPolicy_v2"),
          ]
        })

        constraint.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["s3:*"],
          resources: ["*"] // We don't know what the bucket name is from here
          // TODO: Add a hard coded tag name to the sampleDataBucket
        }))

        constraint.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["sns:Publish"], // Why?
          resources: ["*"] 
        }))

        constraint.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "ec2:CreateSecurityGroup",
            "ec2:RevokeSecurityGroupEgress",
            "ec2:DeleteSecurityGroup",
            "ec2:createTags",
            "ec2:AuthorizeSecurityGroupEgress",
            "ec2:AuthorizeSecurityGroupIngress",
            "ec2:RevokeSecurityGroupIngress"
          ],
          resources: ["*"]
        }))

        constraint.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "lambda:CreateFunction",
            "lambda:InvokeFunction",
            "lambda:DeleteFunction",
            "lambda:GetFunction"],
          resources: ["*"] // TODO - Limit with a tag?
        }))

        constraint.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["elasticmapreduce:RunJobFlow"],
          resources: ["*"]
        }))

        // TODO: We probably need a permissions boundary here, since allowing 
        // CreateRole is basically equivalent to giving Admin permissions
        constraint.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "iam:CreateRole",
            "iam:DetachRolePolicy",
            "iam:AttachRolePolicy",
            "iam:DeleteRolePolicy",
            "iam:DeleteRole",
            "iam:PutRolePolicy",
            "iam:PassRole",
            "iam:CreateInstanceProfile",
            "iam:RemoveRoleFromInstanceProfile",
            "iam:DeleteInstanceProfile",
            "iam:AddRoleToInstanceProfile"
          ],
          resources: ["*"] 
        }))

        constraint.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "cloudformation:CreateStack"
          ],
          resources: ["*"]
        }))

        portfolio.setLaunchRole(product, constraint)

        const vpceSG = new ec2.SecurityGroup(this, id + "vpc-ep-sg", {
          description: "Allow TLS for VPC endpoint",
          vpc,
        })

        const smSG = new ec2.SecurityGroup(this, id + "sm-sg", {
          vpc
        })

        addIngress(this, "sm-sm", smSG.securityGroupId, smSG.securityGroupId, "-1", false)
        addIngress(this, "sm-smtcp", smSG.securityGroupId, smSG.securityGroupId, "tcp", false)
        addIngress(this, "sm-vpce", vpceSG.securityGroupId, smSG.securityGroupId, "-1", false)

        new cdk.CfnOutput(this, id + "smsgidout", {
          description: "SageMaker security group id output export", 
          value: smSG.securityGroupId,
          exportName: sageMakerSGIdExportName
        })

        const smExecRole = new iam.Role(this, "sm-exec", {
          assumedBy: new iam.ServicePrincipal("sagemaker.amazonaws.com"),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSageMakerFullAccess"),
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
          ]
        })

        smExecRole.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "elasticmapreduce:ListInstances",
            "elasticmapreduce:DescribeCluster",
            "elasticmapreduce:DescribeSecurityConfiguration",
            "elasticmapreduce:CreatePersistentAppUI",
            "elasticmapreduce:DescribePersistentAppUI",
            "elasticmapreduce:GetPersistentAppUIPresignedURL",
            "elasticmapreduce:GetOnClusterAppUIPresignedURL",
            "elasticmapreduce:ListClusters",
            "iam:CreateServiceLinkedRole",
            "iam:GetRole",
          ],
          resources: ["*"] // TODO: Can we tighten this up?
        }))

        smExecRole.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["iam:PassRole"],
          resources: ["*"],
          conditions: {
            "StringEquals": {"iam:PassedToService": "sagemaker.amazonaws.com"}
          }
        }))

        smExecRole.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "elasticmapreduce:DescribeCluster",
            "elasticmapreduce:ListInstanceGroups"],
          resources: [cdk.Fn.sub("arn:${AWS::Partition}:elasticmapreduce:*:*:cluster/*")]
        }))
        // TODO - Is this any different than "*" ?

        smExecRole.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "elasticmapreduce:ListClusters"],
          resources: ["*"]
        }))


        // Principal association
        portfolio.giveAccessToRole(smExecRole)

        // SageMaker domain
        const domain = new sagemaker.CfnDomain(this, "domain", {
          appNetworkAccessType: "VpcOnly",
          authMode: "IAM", 
          defaultUserSettings: {
            executionRole: smExecRole.roleArn,
            securityGroups: [smSG.securityGroupId],
          },
          domainName: "CDKSample",
          vpcId: vpc.vpcId,
          subnetIds: [vpc.privateSubnets[0].subnetId]
        })

        // Sagemaker user profile
        new sagemaker.CfnUserProfile(this, "user-profile", {
          domainId: domain.attrDomainId,
          userProfileName: "cdk-studio-user",
          userSettings: {
            executionRole: smExecRole.roleArn
          }
        })

      }
}
