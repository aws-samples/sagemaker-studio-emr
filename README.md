![SageMaker](https://raw.githubusercontent.com/aws/amazon-sagemaker-examples/main/_static/sagemaker-banner.png)

# SageMaker Studio EMR Integration
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

This is a repository of examples, templates, and informative links which guide SageMaker Studio users
to manage clusters and run EMR workloads in conjunction with SageMaker ML tasks. Typically, these workloads 
involve utilization of Apache Spark, but we'll also show integrations with other analytic libraries like PyHive and 
Presto.

## Workshop
We've created a guided workshop for users to become familiar with SageMaker Studio's EMR integration:

Workshop Link: [https://catalog.workshops.aws/sagemaker-studio-emr/](https://catalog.workshops.aws/sagemaker-studio-emr/)

For more information see the Workshop directory's [README](workshop/README.md)

## CloudFormation
SageMaker Studio provides users the ability to visually browse and connect to Amazon EMR clusters right from the Studio 
notebook. Additionally, you can now provision and terminate EMR clusters directly from Studio. In the cloudformation 
directory you'll find:

1. Example EMR Templates that can be provisioned through SageMaker Studio using service catalog
2. Getting started templates that include end-to-end VPC, Studio, and EMR cluster CFN Stacks

For more information and examples see the Example EMR Templates' [README](cloudformation/emr_servicecatalog_templates/README.md)

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

## Formatting
We utilize black for `.py` and `.ipynb` formatting in this repository. 
