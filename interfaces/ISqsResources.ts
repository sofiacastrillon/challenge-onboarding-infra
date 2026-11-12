import { IQueue } from 'aws-cdk-lib/aws-sqs';

export enum SqsQueueKeys {
  TRAINING = 'training-queue',
  TRAINING_DLQ = 'training-dlq-queue',
}

export interface SqsResources {
  [key: string]: IQueue;
}
