# Interactive Notebooks with EMR integration though SageMaker Studio

This directory contains examples of utilizing EMR alongside SageMaker to perform analytics and machine learning tasks. 
User's can use the graphical "Cluster" button on Studio Notebooks to seamlessly connect to existing EMR clusters. 
This will auto-populate the `%%sm_analytics` cell. This connection will return a pre-signed SparkUI link for the user 
to debug.

## Example Notebooks
* [SageMaker Studio Local PySpark](local-pyspark-smstudio.ipynb)
* SageMaker Studio Local Spark Scala (Coming Soon)
  * Requires a [BYO Studio Image for local Scala execution](https://github.com/aws-samples/sagemaker-studio-custom-image-samples/tree/main/examples/scala-image)
* [SparkMagic Functionality](sparkmagic-example.ipynb)
* [PyHive Functionality](pyhive-example.ipynb)
* [Installing Python libraries on a running EMR cluster](../interactive_notebooks/install-py-libraries.ipynb)
* EMR PySpark + SageMaker PyTorch Example (Coming Soon)
* EMR PySpark + SageMaker TensorFlow Example (Coming Soon)
* Presto Analytics (Coming Soon)


![sm_analytics](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/11/30/ML-6841-PART1-image030.png)

![spark_ui](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/11/30/ML-6841-PART1-image032.png)



## Related Blogs
* [Perform interactive data engineering and data science workflows from Amazon SageMaker Studio notebooks](https://aws.amazon.com/blogs/machine-learning/perform-interactive-data-engineering-and-data-science-workflows-from-amazon-sagemaker-studio-notebooks/)