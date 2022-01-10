import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ProductConstruct, ProductConstructProps } from './product-construct';

/**
 * This stack deploys a VPC, a SageMaker domain, and a ServiceCatalog product.
 * 
 * The Service Catalog product allows SageMaker studio users to deploy an EMR
 * cluster with sample data to demonstrate interacting with the cluster from 
 * SageMaker studio.
 */
export class CdkSagemakerEmrStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The stack should be a thin layer over the construct, keeping 
    // in mind compatibility with Industry Kit and QuickStart

    const productProps = new ProductConstructProps();
    new ProductConstruct(this, "sagemaker-emr-product", productProps)
  }
}
