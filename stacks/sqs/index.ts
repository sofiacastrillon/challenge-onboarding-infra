import { IStackBasicProps } from '../../interfaces/IStackProps';
import { SqsResources, SqsQueueKeys } from '../../interfaces/ISqsResources';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { SnsResources, SNS_KEYS } from '../../interfaces/ISnsResources';
import { ExampleEntityQueue } from './example/ExampleEntityQueue';
import { generateOutputName } from '../../utils/utils';
import { CfnOutput } from 'aws-cdk-lib/core';
import { SubscriptionFilter } from 'aws-cdk-lib/aws-sns';

export const TOPIC_TO_QUEUE_BINDING = {
  [SNS_KEYS.EXAMPLE_ENTITY]: [SqsQueueKeys.EXAMPLE_ENTITY],
};

export const TOPIC_TO_QUEUE_BINDING_WITH_FILTERS = {
  [SNS_KEYS.EXAMPLE_ENTITY]: {
    [SqsQueueKeys.EXAMPLE_ENTITY]: {
      eventTypes: ['example-event'],
    },
  },
};

export class SqsStacks {
  static build(props: IStackBasicProps): SqsResources {
    const queues: SqsResources = {};

    queues[SqsQueueKeys.EXAMPLE_ENTITY] = ExampleEntityQueue.build(props);

    // Generate outputs for queue ARNs
    Object.entries(queues).forEach(([queueKey, queue]) => {
      const name = generateOutputName(queueKey, 'arn');
      new CfnOutput(props.scope, name, {
        value: queue.queueArn,
        description: `ARN for ${queueKey} SQS queue`,
        exportName: name,
      });
    });

    // Generate outputs for queue URLs
    Object.entries(queues).forEach(([queueKey, queue]) => {
      const name = generateOutputName(queueKey, 'url');
      new CfnOutput(props.scope, name, {
        value: queue.queueUrl!,
        description: `URL for ${queueKey} SQS queue`,
        exportName: name,
      });
    });

    return queues;
  }

  /**
   * Binds a topic to a queues. Supports multiple queues per topic.
   * @param queues - The queues to bind
   * @param topics - The topics to bind
   */
  static bindTopicWithQueues(queues: SqsResources, topics: SnsResources) {
    Object.entries(TOPIC_TO_QUEUE_BINDING).forEach(([topicKey, queueKeys]) => {
      const topic = topics[topicKey];
      queueKeys.forEach(queueKey => {
        const queue = queues[queueKey];

        topic.addSubscription(
          new SqsSubscription(queue, {
            rawMessageDelivery: true,
          }),
        );
      });
    });
  }

  /**
   * Binds topics to queues with filter policies for specific event types.
   * @param queues - The queues resources
   * @param topics - The topics resources
   */
  static bindTopicWithQueuesWithFilters(
    queues: SqsResources,
    topics: SnsResources,
  ) {
    Object.entries(TOPIC_TO_QUEUE_BINDING_WITH_FILTERS).forEach(
      ([topicKey, queueBindings]) => {
        const topic = topics[topicKey];
        Object.entries(queueBindings).forEach(([queueKey, filterConfig]) => {
          const queue = queues[queueKey];

          topic?.addSubscription(
            new SqsSubscription(queue, {
              rawMessageDelivery: true,
              filterPolicy: {
                eventType: SubscriptionFilter.stringFilter({
                  allowlist: [...filterConfig.eventTypes],
                }),
              },
            }),
          );
        });
      },
    );
  }
}
