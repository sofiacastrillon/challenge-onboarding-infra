import { IStackBasicProps } from '../../interfaces/IStackProps';
import { SNS_KEYS, SnsResources } from '../../interfaces/ISnsResources';
import { ExampleEntityTopic } from './example/ExampleEntityTopic';
import { generateOutputName } from '../../utils/utils';
import { CfnOutput } from 'aws-cdk-lib/core';

export class SnsStacks {
  static build(props: IStackBasicProps): SnsResources {
    const topics: SnsResources = {};

    topics[SNS_KEYS.EXAMPLE_ENTITY] = ExampleEntityTopic.build(props);

    // Generate outputs for topic ARNs
    Object.entries(topics).forEach(([topicKey, topic]) => {
      const name = generateOutputName(topicKey, 'arn');
      new CfnOutput(props.scope, name, {
        value: topic.topicArn,
        description: `ARN for ${topicKey} SNS topic`,
        exportName: name,
      });
    });

    return topics;
  }
}
