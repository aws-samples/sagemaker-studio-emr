# Getting Started Cloud Formation Templates

In this directory you'll find cloudformation stacks for use as a getting started guide:

1. End-to-end stacks that deploy IAM roles, VPCs, SageMaker Studio Domains, and templates for launching EMR Clusters
   * [CFN-SMStudioAndNoAuthClusterTemplate.yaml](CFN-SMStudioAndNoAuthClusterTemplate.yaml)
   * **NOTE**: The launched stack name must be `SagemakerEMRNoAuthProductWithStudio` for the above template
2. End-to-end stacks that deploy IAM roles, VPCs, SageMaker Studio Domains, and running EMR Clusters
   * [CFN-SMStudioAndKerberosCluster.yaml](CFN-SMStudioAndKerberosCluster.yaml)
   * [CFN-SMStudioAndLDAPCluster.yaml](CFN-SMStudioAndLDAPCluster.yaml)


