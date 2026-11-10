import {
  MysqlResources,
  MysqlDatabaseKeys,
} from '../../interfaces/IMysqlResources';
import { IStackBasicProps } from '../../interfaces/IStackProps';
import { generateOutputName, generateDatabaseName } from '../../utils/utils';
import { Tags } from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib/core';
// import { ExampleDatabase } from './ExampleDatabase';

export class MysqlStacks {
  static build(props: IStackBasicProps): MysqlResources {
    const databases: MysqlResources = {};

    // Example database - remove the comment if you want to deploy it
    // databases[MysqlDatabaseKeys.EXAMPLE_DATABASE] =
    //   ExampleDatabase.build(props);

    // Generate outputs for database cluster ARNs
    Object.entries(databases).forEach(([databaseKey, cluster]) => {
      const databaseName = generateDatabaseName(
        databaseKey as MysqlDatabaseKeys,
        props.stage,
      );
      Tags.of(cluster).add('Database', databaseName);

      const outputArn = generateOutputName(databaseKey, 'arn');
      new CfnOutput(props.scope, outputArn, {
        value: cluster.clusterArn,
        description: `ARN for ${databaseKey} MySQL cluster`,
        exportName: outputArn,
      });

      const outputEndpoint = generateOutputName(databaseKey, 'endpoint');
      new CfnOutput(props.scope, outputEndpoint, {
        value: cluster.clusterEndpoint.hostname,
        description: `Endpoint for ${databaseKey} MySQL cluster`,
        exportName: outputEndpoint,
      });

      const outputPort = generateOutputName(databaseKey, 'port');
      new CfnOutput(props.scope, outputPort, {
        value: cluster.clusterEndpoint.port.toString(),
        description: `Port for ${databaseKey} MySQL cluster`,
        exportName: outputPort,
      });

      if (cluster.secret) {
        const outputSecretArn = generateOutputName(databaseKey, 'secrets-arn');
        new CfnOutput(props.scope, outputSecretArn, {
          value: cluster.secret.secretArn,
          description: `Secrets ARN for ${databaseKey} MySQL cluster credentials`,
          exportName: outputSecretArn,
        });
      }
    });

    return databases;
  }
}
