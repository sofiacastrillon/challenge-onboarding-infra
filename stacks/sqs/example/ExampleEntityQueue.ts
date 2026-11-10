import { Queue, IQueue } from 'aws-cdk-lib/aws-sqs';
import { IStackBasicProps } from '../../../interfaces/IStackProps';
import { Duration } from 'aws-cdk-lib';
import { PROJECT_NAME } from '../../..';

export class ExampleEntityQueue {
  static build(props: IStackBasicProps): IQueue {
    const dlq = new Queue(
      props.scope,
      `${PROJECT_NAME}-example-entity-queue-dlq-${props.stage}`,
      {
        queueName: `${PROJECT_NAME}-example-entity-dlq-${props.stage}`,
      },
    );

    return new Queue(
      props.scope,
      `${PROJECT_NAME}-example-entity-queue-${props.stage}`,
      {
        queueName: `${PROJECT_NAME}-example-entity-${props.stage}`,
        visibilityTimeout: Duration.seconds(60),
        deadLetterQueue: {
          maxReceiveCount: 3,
          queue: dlq,
        },
      },
    );
  }
}
