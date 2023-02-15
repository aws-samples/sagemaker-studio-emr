# Getting Started Cloud Formation Templates

In this directory you'll find cloudformation stacks for use as a getting started guide:

1. End-to-end stack that deploys IAM roles, VPC, Sandbox SageMaker Studio Domain, and adds a templates to launch EMR Cluser
   * [CFN-SagemakerEMRNoAuthProductWithStudio-v3.yaml](CFN-SagemakerEMRNoAuthProductWithStudio-v3.yaml)
   * For more information see this blog: [https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/](https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/)
2. End-to-end stacks that deploy IAM roles, VPCs, SageMaker Studio Domains, and running EMR Clusters
   * [CFN-SMStudioAndKerberosCluster.yaml](CFN-SMStudioAndKerberosCluster.yaml)
   * [CFN-SMStudioAndLDAPCluster.yaml](CFN-SMStudioAndLDAPCluster.yaml)


