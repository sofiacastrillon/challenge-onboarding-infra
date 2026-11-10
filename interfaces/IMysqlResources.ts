import { DatabaseCluster } from 'aws-cdk-lib/aws-rds';

export enum MysqlDatabaseKeys {
  EXAMPLE_DATABASE = 'example-database',
}

export interface MysqlResources {
  [key: string]: DatabaseCluster;
}
