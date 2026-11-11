import { ISecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { CfnRegistry, CfnSchema } from 'aws-cdk-lib/aws-glue';
import { CfnServerlessCluster } from 'aws-cdk-lib/aws-msk';

export enum KafkaKeys {
  TRAINING = 'training-kafka',
}

export interface KafkaClusterResources {
  cluster: CfnServerlessCluster;
  securityGroup: ISecurityGroup;
  subnetIds: string[];
  topicName: string;
}

export interface SchemaRegistryResources {
  registry: CfnRegistry;
  schema: CfnSchema;
}

export interface KafkaResources {
  [key: string]: KafkaClusterResources & SchemaRegistryResources;
}
