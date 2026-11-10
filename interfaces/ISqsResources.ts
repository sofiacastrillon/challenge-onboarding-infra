import { IQueue } from 'aws-cdk-lib/aws-sqs';

export enum SqsQueueKeys {
  EXAMPLE_ENTITY = 'example-queue-entity',
}

export interface SqsResources {
  [key: string]: IQueue;
}
