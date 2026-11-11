import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Stages } from '../../interfaces/IStages';
import { IStackBasicProps } from '../../interfaces/IStackProps';
import { PROJECT_NAME } from '../..';

export class TrainingTable {
  static build(props: IStackBasicProps): ITable {
    return new Table(props.scope, `${PROJECT_NAME}-training-${props.stage}`, {
      tableName: `${PROJECT_NAME}-training-${props.stage}`,
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: [Stages.PROD, Stages.TEST].includes(props.stage as Stages)
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: props.stage === Stages.PROD,
      },
    });
  }
}
