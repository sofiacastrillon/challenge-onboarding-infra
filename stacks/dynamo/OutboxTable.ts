import { RemovalPolicy } from 'aws-cdk-lib';
import { IStackBasicProps } from '../../interfaces/IStackProps';
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
  StreamViewType,
} from 'aws-cdk-lib/aws-dynamodb';
import { Stages } from '../../interfaces/IStages';
import { OutboxTableIndexes } from '../../interfaces/IDynamoResources';
import { PROJECT_NAME } from '../..';

export class OutboxTable {
  static build(props: IStackBasicProps): ITable {
    const outboxTable = new Table(
      props.scope,
      `${PROJECT_NAME}-outbox-${props.stage}`,
      {
        tableName: `${PROJECT_NAME}-outbox-${props.stage}`,
        partitionKey: {
          name: 'pk',
          type: AttributeType.STRING,
        },
        sortKey: {
          name: 'sk',
          type: AttributeType.STRING,
        },
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: [Stages.PROD, Stages.TEST].includes(
          props.stage as Stages,
        )
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
        stream: StreamViewType.NEW_AND_OLD_IMAGES,
        pointInTimeRecoverySpecification: {
          pointInTimeRecoveryEnabled: props.stage === Stages.PROD,
        },
      },
    );

    outboxTable.addGlobalSecondaryIndex({
      indexName: OutboxTableIndexes.STATUS_GSI,
      partitionKey: {
        name: 'status',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: AttributeType.STRING,
      },
    });

    return outboxTable;
  }
}
