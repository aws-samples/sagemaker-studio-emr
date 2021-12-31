# Interactive Notebooks with EMR integration though SageMaker Studio

This directory contains examples of utilizing EMR alongside SageMaker to perform analytics and machine learning tasks. 
User's can use the graphical "Cluster" button on Studio Notebooks to seamlessly connect to existing EMR clusters. 
This will auto-populate the `%%sm_analytics` cell. This connection will return a pre-signed SparkUI link for the user 
to debug.

![sm_analytics](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/11/30/ML-6841-PART1-image030.png)

![spark_ui](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/11/30/ML-6841-PART1-image032.png)

## Local Spark
* [SageMaker Studio Local PySpark](LocalSpark/SMStudio_PySpark_Local.ipynb)
* SageMaker Studio Local Spark Scala (Coming Soon)
  * Requires a [BYO Studio Image for local Scala execution](https://github.com/aws-samples/sagemaker-studio-custom-image-samples/tree/main/examples/scala-image)


## SparkMagic
* [EMR PySpark + SageMaker Blazing Text Sentiment Analysis](SparkMagic/smstudio-pyspark-hive-sentiment-analysis.ipynb)
  * Requires Hive Table provisioned in [this blog](https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/)
* EMR PySpark + SageMaker PyTorch Example (Coming Soon)
* EMR PySpark + SageMaker TensorFlow Example (Coming Soon)
* EMR Spark Scala + SageMaker SparkML (Coming Soon)

## PyHive
* [PyHive + SageMaker Blazing Text Sentiment Analysis](PyHive/smstudio-ds-pyhive-sentiment-analysis.ipynb)
  * Requires Hive Table provisioned in [this blog](https://aws.amazon.com/blogs/machine-learning/part-1-create-and-manage-amazon-emr-clusters-from-sagemaker-studio-to-run-interactive-spark-and-ml-workloads/)

## Presto
* Presto Analytics (Coming Soon)

## Related Blogs
* [Perform interactive data engineering and data science workflows from Amazon SageMaker Studio notebooks](https://aws.amazon.com/blogs/machine-learning/perform-interactive-data-engineering-and-data-science-workflows-from-amazon-sagemaker-studio-notebooks/)