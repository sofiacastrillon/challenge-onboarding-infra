import { S3Resources } from '../../interfaces/IS3Resources';
import { IStackBasicProps } from '../../interfaces/IStackProps';
import { generateOutputName } from '../../utils/utils';
import { CfnOutput } from 'aws-cdk-lib/core';
// import { ExampleBucket } from './example/ExampleBucket';

export class S3Stacks {
  static build(props: IStackBasicProps): S3Resources {
    const buckets: S3Resources = {};

    // Example bucket - remove the comment if you want to deploy it
    // buckets[S3BucketKeys.EXAMPLE_BUCKET] = ExampleBucket.build(props);

    // Generate outputs for bucket ARNs
    Object.entries(buckets).forEach(([bucketKey, bucket]) => {
      const outputArn = generateOutputName(bucketKey, 'arn');
      new CfnOutput(props.scope, outputArn, {
        value: bucket.bucketArn,
        description: `ARN for ${bucketKey} S3 bucket`,
        exportName: outputArn,
      });

      const outputName = generateOutputName(bucketKey, 'name');
      new CfnOutput(props.scope, outputName, {
        value: bucket.bucketName,
        description: `Name for ${bucketKey} S3 bucket`,
        exportName: outputName,
      });
    });

    return buckets;
  }
}
