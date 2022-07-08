# Workshop Setup

### Event Engine Temporary Account
If you are performing this workshop with a pre-configured AWS account provided to you by your instructor, then you 
can skip the `00_setup` module. You will already have a SageMaker Studio Domain, Studio User, and EMR template 
provisioned for you.

### Self Paced Lab Setup in Own Account
If you are performing this lab in your own account, you can still run this workshop by provisioning an EMR template 
which will stand up a cluster with the necessary settings and data sources. The easiest way to achieve this is to run 
this CloudFormation template for accounts with existing SageMaker Studio Domains: 

```
https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateURL=https://aws-ml-blog.s3.amazonaws.com/artifacts/astra-m4-sagemaker/existing-studio-domain/CFN-SageMakerEMRNoAuthProduct-v2.yaml&stackName=SagemakerEMRNoAuthProduct
```

You can change the region in the above URL to match which ever region your Studio Domain is in, but be sure to keep the 
stack name as `SagemakerEMRNoAuthProduct` since the stack outputs will be referenced when launching an EMR cluster. 
We've committed the bootstrapping scripts and CloudFormation templates directly into the `00_setup` module of this 
repository for your reference.

**Note you will need to supply parameters to this template, as seen below. Your SageMaker Studio Domain will need to be
running in [VPCOnly mode](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-notebooks-and-internet-access.html#studio-notebooks-and-internet-access-vpc) 
so that Subnets are attached through an Elastic Network Interface**

![Screen Shot](https://user-images.githubusercontent.com/18154355/178036181-0ebe7358-02d9-4eaf-8da9-b0365f779079.png)


### Self Paced Lab Clean Up in Own Account

After Completing your lab, the launched EMR cluster should timeout automatically, but you may want to remove any 
dangling data files on S3 that were used in the lab. 

