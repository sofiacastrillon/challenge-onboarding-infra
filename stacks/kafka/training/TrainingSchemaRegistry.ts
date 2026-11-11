import { CfnRegistry, CfnSchema } from 'aws-cdk-lib/aws-glue';
import { IStackBasicProps } from '../../../interfaces/IStackProps';
import { SchemaRegistryResources } from '../../../interfaces/IKafkaResources';
import { PROJECT_NAME } from '../../..';

const TRAINING_EVENT_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'TrainingEvent',
  type: 'object',
  properties: {
    text: { type: 'string' },
    eventType: { type: 'string' },
    datetime: { type: 'string', format: 'date-time' },
    timestamp: { type: 'number' },
  },
  required: ['text', 'eventType', 'datetime', 'timestamp'],
  additionalProperties: false,
};

export class TrainingSchemaRegistry {
  static build(
    props: IStackBasicProps,
    topicName: string,
  ): SchemaRegistryResources {
    const registry = new CfnRegistry(
      props.scope,
      `${PROJECT_NAME}-schema-registry-${props.stage}`,
      {
        name: `${PROJECT_NAME}-training-${props.stage}`,
        description: `Schema registry for the ${PROJECT_NAME} training Kafka topics`,
      },
    );

    // The Glue serializers resolve the schema by topic name by default.
    const schema = new CfnSchema(
      props.scope,
      `${PROJECT_NAME}-training-event-schema-${props.stage}`,
      {
        name: topicName,
        registry: { arn: registry.attrArn },
        dataFormat: 'JSON',
        compatibility: 'BACKWARD',
        schemaDefinition: JSON.stringify(TRAINING_EVENT_SCHEMA),
      },
    );

    return { registry, schema };
  }
}
