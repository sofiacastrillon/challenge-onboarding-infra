import { IBucket } from 'aws-cdk-lib/aws-s3';

export enum S3BucketKeys {
  EXAMPLE_BUCKET = 'example-bucket',
}

export interface S3Resources {
  [key: string]: IBucket;
}
