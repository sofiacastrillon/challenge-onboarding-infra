import { ITable } from 'aws-cdk-lib/aws-dynamodb';

export interface DynamoResources {
  [key: string]: ITable;
}

export enum DynamoTableKeys {
  EXAMPLES = 'examples',
  OUTBOX = 'outbox',
  OUTBOX_INTEGRATION_TEST = 'outbox-integration-test',
}

export enum OutboxTableIndexes {
  STATUS_GSI = 'status-GSI',
}
