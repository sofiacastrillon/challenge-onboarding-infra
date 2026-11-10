import { IStackBasicProps } from '../interfaces/IStackProps';
import { DynamoTableKeys } from '../interfaces/IDynamoResources';
import { SqsQueueKeys } from '../interfaces/ISqsResources';
import { SNS_KEYS } from '../interfaces/ISnsResources';
import { MysqlDatabaseKeys } from '../interfaces/IMysqlResources';
import { S3BucketKeys } from '../interfaces/IS3Resources';
import { PROJECT_NAME } from '..';

export const formatToCdkProps = (props: IStackBasicProps) => {
  return {
    stackName: props.name,
    env: {
      account: props.account,
      region: props.region,
    },
  };
};

export const shortStagename = (stage: string) => {
  if (stage === 'production') {
    return 'prod';
  }
  if (stage === 'testing') {
    return 'test';
  }
  if (stage === 'training') {
    return 'train';
  }
  if (stage === 'sandbox') {
    return 'sand';
  }
  if (stage === 'development') {
    return 'dev';
  }
  return stage;
};

export const generateTableName = (
  tableName: DynamoTableKeys,
  stage: string,
) => {
  return `${PROJECT_NAME}-${tableName.toLowerCase()}-${shortStagename(stage)}-table`;
};

export const generateQueueName = (props: {
  queueName: SqsQueueKeys;
  stage: string;
  isFifo?: boolean;
  isDLQ?: boolean;
}): string => {
  return `${PROJECT_NAME}-${props.queueName.toLowerCase()}-${shortStagename(props.stage)}-${props.isDLQ ? 'dlq-queue' : 'queue'}${props.isFifo ? '.fifo' : ''}`;
};

export const generateTopicName = (topicName: SNS_KEYS, stage: string) => {
  return `${PROJECT_NAME}-${topicName.toLowerCase()}-${shortStagename(stage)}-topic`;
};

export const generateDatabaseName = (
  databaseName: MysqlDatabaseKeys,
  stage: string,
) => {
  return `${PROJECT_NAME}-${databaseName.toLowerCase()}-${shortStagename(stage)}-cluster`;
};

export const generateBucketName = (bucketName: S3BucketKeys, stage: string) => {
  return `${PROJECT_NAME}-${bucketName.toLowerCase()}-${shortStagename(stage)}-bucket`;
};

export const generateOutputName = (key: string, suffix?: string): string =>
  `${PROJECT_NAME}-${key.toLowerCase().replace(/\//g, '-')}${suffix ? `-${suffix.toLowerCase().replace('_', '-')}` : ''}`;
