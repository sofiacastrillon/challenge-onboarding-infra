import { CfnOutput } from 'aws-cdk-lib/core';
import { IStackBasicProps } from '../../interfaces/IStackProps';
import { KafkaKeys, KafkaResources } from '../../interfaces/IKafkaResources';
import { generateOutputName } from '../../utils/utils';
import { TrainingKafkaCluster } from './training/TrainingKafkaCluster';
import { TrainingSchemaRegistry } from './training/TrainingSchemaRegistry';

export class KafkaStacks {
  static build(props: IStackBasicProps): KafkaResources {
    const kafka: KafkaResources = {};

    const trainingCluster = TrainingKafkaCluster.build(props);
    kafka[KafkaKeys.TRAINING] = {
      ...trainingCluster,
      ...TrainingSchemaRegistry.build(props, trainingCluster.topicName),
    };

    Object.entries(kafka).forEach(([kafkaKey, resources]) => {
      const outputs: { [suffix: string]: string } = {
        'cluster-arn': resources.cluster.attrArn,
        'security-group-id': resources.securityGroup.securityGroupId,
        'subnet-ids': resources.subnetIds.join(','),
        'topic-name': resources.topicName,
        'registry-name': resources.registry.name,
        'schema-arn': resources.schema.attrArn,
      };

      Object.entries(outputs).forEach(([suffix, value]) => {
        const outputName = generateOutputName(kafkaKey, suffix);
        new CfnOutput(props.scope, outputName, {
          value,
          description: `${suffix} for ${kafkaKey}`,
          exportName: outputName,
        });
      });
    });

    return kafka;
  }
}
