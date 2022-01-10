# CDK Sagemaker EMR

This repository contains constructs that set up a SageMaker domain and an EMR cluster to demonstrate the ability to interact with EMR from SageMaker studio.

It was adapted from the following blog post:

https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/

The blog referenced two CloudFormation templates. This CDK application is a re-write 
of those templates in Typescript using L2 constructs when they are available.

## Note on SageMaker L2 construct

There are currently no L2s, only an old PR that is *very* unlikely to merged soon given the priority attached to it: https://github.com/aws/aws-cdk/pull/6107

The PR branch implementation: https://github.com/petermeansrock/aws-cdk/tree/sagemaker-l2/packages/%40aws-cdk/aws-sagemaker/lib

## EMR also has no L2

The EMR CloudFormation resource, and therefore the L1, still has some unfortunate usage of
insensitive language that can't be entirely avoided in this sample. Where possible we use 
"main" and "core" to refer to EMR instances.






