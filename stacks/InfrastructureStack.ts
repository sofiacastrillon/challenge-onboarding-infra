import { Stack } from 'aws-cdk-lib';
import { IStackBasicProps } from '../interfaces/IStackProps';
import { formatToCdkProps } from '../utils/utils';
import { DynamoStacks } from './dynamo';
import { SnsStacks } from './sns';
import { SqsStacks } from './sqs';
import { MysqlStacks } from './mysql';
import { S3Stacks } from './s3';
import { KafkaStacks } from './kafka';
import { getResourceTags, applyTags } from '../utils/tags';
import { PROJECT_NAME } from '..';

export class InfrastructureStack extends Stack {
  constructor(props: IStackBasicProps) {
    super(props.scope, props.name, formatToCdkProps(props));

    const tags = getResourceTags({
      Project: PROJECT_NAME,
      ProjectName: PROJECT_NAME, // Para los proyectos que ya usaban ProjectName, para no perder el historico del cost explorer
      Repository:
        'https://github.com/sofiacastrillon/challenge-onboarding-infra',
      Environment: props.stage,
      Owner: 'Ledger', // Validar en https://opsless.alegra.com/ el nombre del owner
      IsCritical: 'true',
      IsTemporal: 'false',
    });
    applyTags(this, tags);

    const stackProps = { ...props, scope: this };

    DynamoStacks.build(stackProps);
    const snsStacks = SnsStacks.build(stackProps);
    const sqsStacks = SqsStacks.build(stackProps);
    MysqlStacks.build(stackProps);
    S3Stacks.build(stackProps);
    KafkaStacks.build(stackProps);

    // Bind topics to queues
    SqsStacks.bindTopicWithQueues(sqsStacks, snsStacks);

    // Bind topics to queues with filter policies for specific event types
    // SqsStacks.bindTopicWithQueuesWithFilters(sqsStacks, snsStacks); // remove the comment if you want to create subscriptions with filter policies for specific event types
  }
}
