import {
  DynamoResources,
  DynamoTableKeys,
} from '../../interfaces/IDynamoResources';
import { IStackBasicProps } from '../../interfaces/IStackProps';
import { ExamplesTable } from './ExamplesTable';
import { OutboxTable } from './OutboxTable';
import { OutboxIntegrationTestTable } from './OutboxIntegrationTestTable';
import { TrainingTable } from './TrainingTable';
import { generateOutputName, generateTableName } from '../../utils/utils';
import { Tags } from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib/core';

export class DynamoStacks {
  static build(props: IStackBasicProps): DynamoResources {
    const tables: DynamoResources = {};

    tables[DynamoTableKeys.EXAMPLES] = ExamplesTable.build(props);
    tables[DynamoTableKeys.OUTBOX] = OutboxTable.build(props);
    tables[DynamoTableKeys.OUTBOX_INTEGRATION_TEST] =
      OutboxIntegrationTestTable.build(props);
    tables[DynamoTableKeys.TRAINING] = TrainingTable.build(props);

    // Generate outputs for table ARNs
    Object.entries(tables).forEach(([tableKey, table]) => {
      const outputArn = generateOutputName(tableKey, 'arn');
      const tableName = generateTableName(
        tableKey as DynamoTableKeys,
        props.stage,
      );
      Tags.of(table).add('Database', tableName);
      new CfnOutput(props.scope, outputArn, {
        value: table.tableArn,
        description: `ARN for ${tableKey} DynamoDB table`,
        exportName: outputArn,
      });

      const outputName = generateOutputName(tableKey, 'name');

      new CfnOutput(props.scope, outputName, {
        value: table.tableName,
        description: `Name for ${tableKey} DynamoDB table`,
        exportName: outputName,
      });

      // Stream ARN for tables with DynamoDB Streams enabled (e.g. Outbox)
      if (table.tableStreamArn) {
        const outputStreamArn = generateOutputName(tableKey, 'stream-arn');
        new CfnOutput(props.scope, outputStreamArn, {
          value: table.tableStreamArn,
          description: `Stream ARN for ${tableKey} DynamoDB table`,
          exportName: outputStreamArn,
        });
      }
    });

    return tables;
  }
}
