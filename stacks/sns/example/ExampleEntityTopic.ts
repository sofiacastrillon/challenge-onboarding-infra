import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { IStackBasicProps } from '../../../interfaces/IStackProps';
import { PROJECT_NAME } from '../../..';

export class ExampleEntityTopic {
  static build(props: IStackBasicProps): ITopic {
    return new Topic(
      props.scope,
      `${PROJECT_NAME}-example-entity-topic-${props.stage}`,
      {
        topicName: `${PROJECT_NAME}-example-entity-${props.stage}`,
      },
    );
  }
}
