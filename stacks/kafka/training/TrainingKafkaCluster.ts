import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { CfnServerlessCluster } from 'aws-cdk-lib/aws-msk';
import { IStackBasicProps } from '../../../interfaces/IStackProps';
import { KafkaClusterResources } from '../../../interfaces/IKafkaResources';
import { PROJECT_NAME } from '../../..';

// MSK Serverless only supports IAM authentication, exposed on this port.
const KAFKA_IAM_PORT = 9098;

export class TrainingKafkaCluster {
  static build(props: IStackBasicProps): KafkaClusterResources {
    const vpcId = process.env.VPC_ID;
    const subnetIds = [process.env.SUBNET_ID_1, process.env.SUBNET_ID_2];

    if (!vpcId || subnetIds.some(subnetId => !subnetId)) {
      throw new Error(
        'VPC_ID, SUBNET_ID_1 and SUBNET_ID_2 must be set to create the Kafka cluster',
      );
    }

    const vpc = ec2.Vpc.fromLookup(
      props.scope,
      `${PROJECT_NAME}-kafka-vpc-${props.stage}`,
      { vpcId },
    );

    const securityGroup = new ec2.SecurityGroup(
      props.scope,
      `${PROJECT_NAME}-kafka-sg-${props.stage}`,
      {
        vpc,
        securityGroupName: `${PROJECT_NAME}-kafka-${props.stage}`,
        description: `Access to the ${PROJECT_NAME} training MSK Serverless cluster`,
        allowAllOutbound: true,
      },
    );

    // Lambdas that produce/consume must be attached to this same security group.
    securityGroup.addIngressRule(
      securityGroup,
      ec2.Port.tcp(KAFKA_IAM_PORT),
      'Kafka IAM auth from members of this security group',
    );

    const cluster = new CfnServerlessCluster(
      props.scope,
      `${PROJECT_NAME}-kafka-cluster-${props.stage}`,
      {
        clusterName: `${PROJECT_NAME}-training-${props.stage}`,
        clientAuthentication: {
          sasl: {
            iam: { enabled: true },
          },
        },
        vpcConfigs: [
          {
            subnetIds: subnetIds as string[],
            securityGroups: [securityGroup.securityGroupId],
          },
        ],
      },
    );

    return {
      cluster,
      securityGroup,
      subnetIds: subnetIds as string[],
      topicName: `${PROJECT_NAME}-training-events-${props.stage}`,
    };
  }
}
