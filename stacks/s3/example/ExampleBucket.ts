import { RemovalPolicy } from 'aws-cdk-lib';
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  IBucket,
  ObjectOwnership,
} from 'aws-cdk-lib/aws-s3';
import { Stages } from '../../../interfaces/IStages';
import { IStackBasicProps } from '../../../interfaces/IStackProps';
import { generateBucketName } from '../../../utils/utils';
import { S3BucketKeys } from '../../../interfaces/IS3Resources';
import { PROJECT_NAME } from '../../..';

export class ExampleBucket {
  static build(props: IStackBasicProps): IBucket {
    const bucketName = generateBucketName(
      S3BucketKeys.EXAMPLE_BUCKET,
      props.stage,
    );

    return new Bucket(
      props.scope,
      `${PROJECT_NAME}-example-bucket-${props.stage}`,
      {
        bucketName,
        encryption: BucketEncryption.S3_MANAGED,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
        versioned: [Stages.PROD, Stages.TEST].includes(props.stage as Stages),
        removalPolicy: [Stages.PROD, Stages.TEST].includes(
          props.stage as Stages,
        )
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
        autoDeleteObjects: ![Stages.PROD, Stages.TEST].includes(
          props.stage as Stages,
        ),
      },
    );
  }
}
