import { Queue, IQueue } from 'aws-cdk-lib/aws-sqs';
import { Duration } from 'aws-cdk-lib';
import { IStackBasicProps } from '../../../interfaces/IStackProps';
import { PROJECT_NAME } from '../../..';

export class TrainingQueue {
  static build(props: IStackBasicProps): { queue: IQueue; dlq: IQueue } {
    const dlq = new Queue(
      props.scope,
      `${PROJECT_NAME}-training-queue-dlq-${props.stage}`,
      {
        queueName: `${PROJECT_NAME}-training-dlq-${props.stage}`,
        retentionPeriod: Duration.days(14),
      },
    );

    // visibilityTimeout must be >= the timeout of the consumer lambda,
    // otherwise the SQS event source mapping cannot be created.
    const queue = new Queue(
      props.scope,
      `${PROJECT_NAME}-training-queue-${props.stage}`,
      {
        queueName: `${PROJECT_NAME}-training-${props.stage}`,
        visibilityTimeout: Duration.seconds(60),
        deadLetterQueue: {
          maxReceiveCount: 3,
          queue: dlq,
        },
      },
    );

    return { queue, dlq };
  }
}
