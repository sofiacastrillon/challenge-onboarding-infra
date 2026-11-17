import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { IStackBasicProps } from '../../../interfaces/IStackProps';
import { PROJECT_NAME } from '../../..';

export class TrainingTopic {
  static build(props: IStackBasicProps): ITopic {
    return new Topic(
      props.scope,
      `${PROJECT_NAME}-training-topic-${props.stage}`,
      {
        topicName: `${PROJECT_NAME}-training-${props.stage}`,
      },
    );
  }
}
