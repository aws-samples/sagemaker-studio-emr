# EMR Cluster Management from SageMaker Studio

SageMaker Studio provides user's with the ability to create, terminate, and manage EMR clusters from the notebook 
interface. Cluster's can be located in the same AWS account as the SageMaker Studio domain or in separate AWS 
accounts through the use of VPC peering.

To enable this functionality, domain admins must configure Service Catalog templates that can be launched by 
SageMaker Studio users.

## Service Catalog Templates
SageMaker Studio users can leverage provisioned [AWS Service Catalog](https://aws.amazon.com/servicecatalog/) templates 
to spin up EMR clusters that have authorized by a team's DevOps administrators.

Example Templates:
* [Single Account](single-account.yaml)
* [Multi Account ](cross-account.yaml)
* EMR on EC2 Spot Instances (Coming Soon)
* EMR on EC2 Graviton Instances (Coming Soon)
* Autoscaling EMR Cluster (Coming Soon)
* Auto-terminating EMR Clusters (Coming Soon)

![create_cluster](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/11/30/ML-6841-PART1-image024.png)

## Terminating EMR Clusters
The SageMaker Studio notebook interface lets user's seamlessly terminate EMR Clusters after they are done with them.
Because this runs DELETE STACK under the hood, users only have access to stop clusters that were launched using 
provisioned Service Catalog templates and can’t stop existing clusters that were created outside of Studio.

![terminate_cluster](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/11/30/ML-6841-PART1-image050.png)

## Related Blogs
* Create and manage Amazon EMR Clusters from SageMaker Studio to run interactive Spark and ML workloads
    * [Part 1: Single Account](https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/)
    * [Part 2: Cross Account](https://aws.amazon.com/blogs/machine-learning/part-2-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/)

