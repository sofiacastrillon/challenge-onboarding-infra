import { ITopic } from 'aws-cdk-lib/aws-sns';

export enum SNS_KEYS {
  EXAMPLE_ENTITY = 'example-topic-entity',
  TRAINING = 'training-topic',
}

export interface SnsResources {
  [key: string]: ITopic;
}
