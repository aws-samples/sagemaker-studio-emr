# Workshop Setup

### Event Engine / Workshop Studio Temporary Account
If you are performing this workshop with a pre-configured AWS account provided to you by your instructor, then you 
can skip the `00_setup` module. You will already have a SageMaker Studio Domain, Studio User, and EMR template 
provisioned for you.

### Self Paced Lab Setup in Own Account
If you are performing this lab in your own account, you can still run this workshop by provisioning an EMR cluster with 
the necessary settings and data sources. The easiest way to achieve this is to run this CloudFormation template which 
will create a new Studio Domain as a sandbox environment. 

```
https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateURL=https://aws-ml-blog.s3.amazonaws.com/artifacts/astra-m4-sagemaker/end-to-end/CFN-SagemakerEMRNoAuthProductWithStudio-v3.yaml
```

You can change the region in the above URL to match which ever region your Studio Domain is in. 
We've committed the bootstrapping scripts and CloudFormation template directly into the `00_setup` module of this 
repository for your reference.

### Self Paced Lab Clean Up in Own Account

After Completing your lab, the launched EMR cluster should timeout automatically, but you may want to remove any 
dangling data files on S3 that were used in the lab. 

