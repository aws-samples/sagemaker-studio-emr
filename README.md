![SageMaker](https://github.com/aws/amazon-sagemaker-examples/raw/master/_static/sagemaker-banner.png)

# SageMaker Studio EMR Integration
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

This is a repository of examples, templates, and informative links which guide SageMaker Studio users
to manage clusters and run EMR workloads in conjunction with SageMaker ML tasks. Typically, these workloads 
involve utilization of Apache Spark, but we'll also show integrations with other analytic libraries like PyHive and 
Presto.

## Example EMR Templates
SageMaker Studio provides users the ability to visually browse and connect to Amazon EMR clusters right from the Studio 
notebook. Additionally, you can now create, stop, and manage EMR clusters directly from Studio.

For more information and examples see the Example EMR Templates' [README](emr_templates/README.md)

## Interactive Notebooks
SageMaker Studio supports interactive EMR processing through a graphical and programmatic way of connecting to 
existing EMR clusters. Several kernels include the 
[SageMaker Studio Analytics Extension](https://pypi.org/project/sagemaker-studio-analytics-extension/) for seamless EMR 
connectivity and generating pre-signed SparkUI links for debugging. 

User's can leverage the [SparkMagic](https://github.com/jupyter-incubator/sparkmagic) kernels for
interactively working with remote Spark clusters through [Livy](http://livy.incubator.apache.org./) or libraries such 
as PyHive can be used after connection to the cluster has been established.

Lastly, we show examples of [locally running Spark](interactive_notebooks/LocalSpark) within SageMaker Studio 
notebooks since this is often done during while prototyping prior to standing up an EMR cluster.

For more information and examples see the Interactive Spark directory's [README](interactive_notebooks/README.md)


## Submitting EMR Jobs

For more information and examples see the Submitting Spark Job directory's [README](job_submission/README.md)


## Workshop
We've created a guided workshop for users to become familiar with SageMaker Studio's EMR integration.

For more information see the Workshop directory's [README](workshop/README.md)

## CDK

We have provided a CDK sample app in the `cdk` folder that demonstrates the deployment of 
a VPC, a SageMaker Studio domain, and a Service Catalog product that enables studio users 
to deploy and interact with an EMR cluster. It is based on the CloudFormation templates provided 
in this blog post: 

[https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/](https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/)

The CDK application is written in Typescript to facilitate future conversion to a construct 
library that can be published to various languages with JSII and listed on the [Construct Hub](https://constructs.dev).

## FAQs
* What is the [sagemaker-spark](https://github.com/aws/sagemaker-spark) repository and how does it relate?
* How can I run local spark testing within SageMaker Studio notebooks?
* How can I interact with AWS Glue from SageMaker Studio?

## Formatting
We utilize black for `.py` and `.ipynb` formatting in this repository. 
