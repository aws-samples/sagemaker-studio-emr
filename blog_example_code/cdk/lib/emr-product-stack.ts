import { Construct } from "constructs";
import * as sc from "@aws-cdk/aws-servicecatalog-alpha"
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as emr from "aws-cdk-lib/aws-emr"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import * as iam from "aws-cdk-lib/aws-iam"
import * as fs from "fs-extra"
import { addIngress } from "./add-ingress"
import { numberToCloudFormation } from "aws-cdk-lib";

// Hard coded configuration values
const config = {
    sourceDataBucket: 'aws-ml-blog', 
    sourceDataKey: 'artifacts/sma-milestone1/', 
    emrMainInstanceCount: 1, 
    emrBootstrapScriptFile: 'installpylibs.sh', 
    emrStepScriptFile: 'configurekdc.sh'
}

/**
 * Configurable properties for the EMR stack
 * 
 * We can't just use object references to refer to values in the main stack, 
 * since this stack is deployed to Service Catalog as a template.
 * 
 */
export interface EmrStackProps extends cdk.StackProps {
    ec2SubnetIdExportName: string,
    ec2VpcIdExportName: string,
    sageMakerSGIdExportName: string,
}

/**
 * This stack will be configured as the stack created by the ServiceCatalog 
 * product. Normally we would reference a CloudFormation template URL when we 
 * create a product, but the `ProductStack` class allows us to define it in CDK.
 * 
 * Adapted from the template in this blog post:
 * 
 * https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/
 */
export class EmrStack extends sc.ProductStack {
    constructor(scope: Construct, id: string, props: EmrStackProps) {
        super(scope, id);

        // Parameters - normally we would not use CloudFormation parameters in a CDK app, 
        // but they are required for ServiceCatalog to allow users to configure products.

        const cfnParams = [
            {
                name: "SageMakerProjectName", 
                type: "String",
                description: "Name of the project",
            },
            {
                name: "SageMakerProjectId", 
                type: "String",
                description: "Service generated Id of the project",
            },
            {
                name: "EmrClusterName", 
                type: "String",
                description: "EMR cluster Name",
            },
            {
                name: "MainInstanceType", 
                type: "String",
                description: "Instance type of the EMR main node",
                default: "m5.xlarge", 
                allowedValues: [
                    "m5.xlarge",
                    "m5.2xlarge",
                    "m5.4xlarge",
                ]
            },
            {
                name: "CoreInstanceType", 
                type: "String",
                description: "Instance type of the EMR core nodes",
                default: "m5.xlarge", 
                allowedValues: [
                    "m5.xlarge",
                    "m5.2xlarge",
                    "m5.4xlarge",
                    "m3.medium",
                    "m3.large",
                    "m3.xlarge",
                    "m3.2xlarge",
                ]
            },
            // There was a UI bug in studio that prevented this from working correctly
            // {
            //     name: "CoreInstanceCount", 
            //     type: "Number",
            //     description: "Number of core instances in the EMR cluster",
            //     default: "2", 
            //     allowedValues: ["2", "5", "10"]
            // },
            {
                name: "EmrReleaseVersion", 
                type: "String",
                description: "The release version of EMR to launch",
                default: "emr-5.33.1", 
                allowedValues: ["emr-5.33.1", "emr-6.4.0"]
            },
        ]
       
        const cfnParamMap = new Map<string, cdk.CfnParameter>();
        for (const p of cfnParams) {

            // Create the parameter and associate it with this stack
            const cfnp = new cdk.CfnParameter(this, p.name, {
                type: p.type, 
                description: p.description, 
                default: p.default,
                allowedValues: p.allowedValues
            })

            // Add the parameter to a map so we can look it up later
            cfnParamMap.set(p.name, cfnp)
        }

        // S3 bucket to hold our copy of the sample data
        const sampleDataBucket = new s3.Bucket(this, "sample-data", {

            // We can't use autoDeleteObjects, since it's implemented with a 
            // custom resource and a lambda asset. `ProductStack` can't handle assets.
            
            // autoDeleteObjects: true,
            // removalPolicy: cdk.RemovalPolicy.DESTROY,

            removalPolicy: cdk.RemovalPolicy.RETAIN,
        })

        // VPC reference

        // Security groups - we're using the L1 CfnSecurityGroup since it allows
        // us to only pass the VPC Id, otherwise we would need to import the 
        // VPC, but we can't since this stack is deployed by Service Catalog

        // EMR Main SG
        const mainSG = new ec2.CfnSecurityGroup(this, "main-sg", {
            groupDescription: "SageMaker EMR Cluster Main",
            vpcId: cdk.Fn.importValue(props!.ec2VpcIdExportName),
        })

        // EMR Core SG
        const coreSG = new ec2.CfnSecurityGroup(this, "core-sg", {
            groupDescription: "SageMaker EMR Cluster Core",
            vpcId: cdk.Fn.importValue(props!.ec2VpcIdExportName),
        })

        // EMR Service SG
        const svcSG = new ec2.CfnSecurityGroup(this, "svc-sg", {
            groupDescription: "SageMaker EMR Cluster Service",
            vpcId: cdk.Fn.importValue(props!.ec2VpcIdExportName),
        })

        // Ingress rules

        // TODO: An EMR L2 construct could hide all of these ingress rules, which 
        // need to be exactly correct or you don't find out until runtime, which 
        // makes for a lot of time consuming trial and error when using the L1.

        const sageMakerSGId = cdk.Fn.importValue(props!.sageMakerSGIdExportName)

        addIngress(this, "main-main-icmp", mainSG, mainSG, "icmp", true, -1, -1)
        addIngress(this, "main-core-icmp", mainSG, coreSG, "icmp", true, -1, -1)
        addIngress(this, "main-main-tcp", mainSG, mainSG, "tcp", true)
        addIngress(this, "main-core-tcp", mainSG, coreSG, "tcp", true)
        addIngress(this, "main-main-udp", mainSG, mainSG, "udp", true)
        addIngress(this, "main-core-udp", mainSG, coreSG, "udp", true)

        addIngress(this, "main-livy", mainSG, coreSG, "tcp", true, 8998, 8998)
        addIngress(this, "sm-livy-main", mainSG, sageMakerSGId, "tcp", true, 8998, 8998)
        addIngress(this, "sm-livy-core", coreSG, sageMakerSGId, "tcp", true, 8998, 8998)
        addIngress(this, "main-hive", mainSG, coreSG, "tcp", true, 10000, 10000)
        addIngress(this, "main-svc", mainSG, svcSG, "tcp", true)
        addIngress(this, "scv-main-9443", svcSG, mainSG, "tcp", true, 9443, 9443)

        addIngress(this, "main-kdc", coreSG, sageMakerSGId, "tcp", false, 88, 88)
        addIngress(this, "main-kdcadmin", coreSG, sageMakerSGId, "tcp", false, 749, 749)
        addIngress(this, "main-kdcinit", coreSG, sageMakerSGId, "tcp", false, 464, 464)

        // IAM Roles

        const jobFlowRole = new iam.Role(this, "job-flow", {
            assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    "service-role/AmazonElasticMapReduceforEC2Role")
            ]
        });

        sampleDataBucket.grantRead(jobFlowRole)

        const jobFlowInstanceProfile = new iam.CfnInstanceProfile(this, 
                "job-flow-profile", {
            roles: [jobFlowRole.roleName],
            path: "/",
        })

        const serviceRole = new iam.CfnRole(this, "service-role", {
            assumeRolePolicyDocument: {
                Statement: [{
                    Action: [
                        "sts:AssumeRole"
                    ],
                    Effect: "Allow",
                    Principal: {
                        Service: [
                            "elasticmapreduce.amazonaws.com"
                        ]
                    }
                }],
                Version: '2012-10-17',
            },
            managedPolicyArns: [
                "arn:aws:iam::aws:policy/service-role/AmazonElasticMapReduceRole"
            ],
            path: "/",
        })

        // EMR Cluster - there is no L2 support for this yet
        const emrCluster = new emr.CfnCluster(this, "cluster", {
            name: cfnParamMap.get("EmrClusterName")?.valueAsString || "",
            applications: [
                {
                    name: "Spark"
                }, 
                {
                    name: "Hive"
                },
                {
                    name: "Livy"
                }
            ],
            bootstrapActions: [ // TODO: Why?
                {
                    name: "Dummy bootstrap action",
                    scriptBootstrapAction: {
                        args: ["dummy", "parameter"],
                        path: cdk.Fn.sub("s3://${SampleDataBucket}/artifacts/sma-milestone1/installpylibs.sh", {
                            "SampleDataBucket": sampleDataBucket.bucketName
                        })
                    }
                }
            ],
            autoScalingRole: "EMR_AutoScaling_DefaultRole",
            configurations: [ 
                {
                    classification: "livy-conf",
                    configurationProperties: { "livy.server.session.timeout": "2h" },
                }
            ],
            ebsRootVolumeSize: 100,
            instances: {
                coreInstanceGroup: {
                    // instanceCount: cfnParamMap.get("CoreInstanceCount")?.valueAsNumber || 2,
                    // There was a weird UI bug in Studio that prevented a valid selection here..
                    instanceCount: 2,
                    instanceType: cfnParamMap.get("CoreInstanceType")?.valueAsString || "m5.xlarge",
                    ebsConfiguration: {
                        ebsBlockDeviceConfigs: [
                            {
                                volumeSpecification: {
                                    sizeInGb: 320,
                                    volumeType: "gp2",
                                },
                            },
                        ],
                        ebsOptimized: true,
                    },
                    market: "ON_DEMAND",
                    name: "coreNode",
                },
                masterInstanceGroup: {
                    instanceCount: 1,
                    instanceType: cfnParamMap.get("CoreInstanceType")?.valueAsString || "m5.xlarge",
                    ebsConfiguration: {
                        ebsBlockDeviceConfigs: [
                            {
                                volumeSpecification: {
                                    sizeInGb: 320,
                                    volumeType: "gp2",
                                },
                            },
                        ],
                        ebsOptimized: true,
                    },
                    market: "ON_DEMAND",
                    name: "mainNode",
                },
                terminationProtected: false,
                ec2SubnetId: cdk.Fn.importValue(props!.ec2SubnetIdExportName),
                emrManagedMasterSecurityGroup: mainSG.ref,
                emrManagedSlaveSecurityGroup: coreSG.ref,
                serviceAccessSecurityGroup: svcSG.ref,
            },
            jobFlowRole: jobFlowInstanceProfile.ref,
            serviceRole: serviceRole.ref,
            logUri: cdk.Fn.sub("s3://${SampleDataBucket}/artifacts/sma-milestone1/", {
                "SampleDataBucket": sampleDataBucket.bucketName
            }),
            releaseLabel: cfnParamMap.get("EmrReleaseVersion")?.valueAsString || "",
            visibleToAllUsers: true,
            steps: [
                {
                    actionOnFailure: "CONTINUE",
                    hadoopJarStep: {
                        args: [cdk.Fn.sub("s3://${SampleDataBucket}/artifacts/sma-milestone1/configurekdc.sh", {
                            "SampleDataBucket": sampleDataBucket.bucketName
                        })],
                        jar: cdk.Fn.sub("s3://${AWS::Region}.elasticmapreduce/libs/script-runner/script-runner.jar", {}),
                        mainClass: ""
                    },
                    name: "run any bash or java job in spark",
                }
            ]
        })

        // Note: It would be great if the EMR team deprecated the master/slave terminology.
        // Trying to avoid using those terms where we have a choice, preferring main and core.

        // Cleanup bucket function is not necessary since we can configure that on the L2 bucket
        // TODO: Incorrect! Since we can't use assets with ServiceCatalog products, and 
        // the new S3 L2 auto delete functionality deploys a Lambda function.
        // We need to add the bucket cleanup function from the original templates.
        
        // Copy Files function
        //
        // We have to use an inline string here since `ProductStack` can't use assets
        const copyFilesFunction = new lambda.Function(this, "copy-files", {
            code: lambda.Code.fromInline(fs.readFileSync("lambda/copy-files.py").toString()),
            handler: "index.handler",
            runtime: lambda.Runtime.PYTHON_3_8,
            timeout: cdk.Duration.seconds(900),
        })

        sampleDataBucket.grantReadWrite(copyFilesFunction)

        const sourceBucket = s3.Bucket.fromBucketAttributes(this, "source-bucket", {
            bucketName: config.sourceDataBucket
        })

        sourceBucket.grantRead(copyFilesFunction)
            
        // Custom resource to copy the files on deployment
        const cr = new cdk.CustomResource(this, "custom-copy", {
            serviceToken: copyFilesFunction.functionArn,
            properties: {
                DestBucket: sampleDataBucket.bucketName,
                SourceBucket: config.sourceDataBucket,
                Prefix: config.sourceDataKey,
                Objects: [
                    config.emrBootstrapScriptFile,
                    config.emrStepScriptFile
                ]
            }
        })

        // The actual sample data gets copied as part of the init script `configurekdc.sh`, 
        // which is in the hard coded blog bucket.

        emrCluster.node.addDependency(cr)

        new cdk.CfnOutput(this, "sample-data-bucket-output", {
            description: "Bucket Name for Amazon S3 bucket",
            value: sampleDataBucket.bucketName,
        })

        new cdk.CfnOutput(this, "emr-main-dns-name-output", {
            description: "DNS Name of the EMR Master Node",
            value: emrCluster.attrMasterPublicDns,
        })
    }
}