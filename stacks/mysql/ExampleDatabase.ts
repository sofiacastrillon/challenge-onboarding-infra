import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AuroraMysqlEngineVersion,
  ClusterInstance,
  Credentials,
  DatabaseCluster,
  DatabaseClusterEngine,
} from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stages } from '../../interfaces/IStages';
import { IStackBasicProps } from '../../interfaces/IStackProps';
import { generateDatabaseName } from '../../utils/utils';
import { MysqlDatabaseKeys } from '../../interfaces/IMysqlResources';
import { PROJECT_NAME } from '../..';

export class ExampleDatabase {
  static build(props: IStackBasicProps): DatabaseCluster {
    const databaseName = generateDatabaseName(
      MysqlDatabaseKeys.EXAMPLE_DATABASE,
      props.stage,
    );

    const vpdId = process.env.VPC_ID!;

    // Use default VPC - replace with your VPC if needed (in the example we use the default VPC)
    const vpc = ec2.Vpc.fromLookup(
      props.scope,
      `${PROJECT_NAME}-vpc-${props.stage}`,
      {
        // isDefault: true, // Use default VPC - replace with your VPC if needed (in the example we use the default VPC)
        vpcId: vpdId, // Use the VPC ID if you want to use a specific VPC
      },
    );

    const subnetIds = [process.env.SUBNET_ID_1!, process.env.SUBNET_ID_2!];
    const subnets = subnetIds.map(subnetId =>
      ec2.Subnet.fromSubnetId(
        props.scope,
        `${PROJECT_NAME}-example-database-subnet-${subnetId}-${props.stage}`,
        subnetId,
      ),
    );

    // Writer instance
    const writerInstanceName = `${PROJECT_NAME}-writer-instance-${props.stage}`;
    const writer = [Stages.PROD].includes(props.stage as Stages)
      ? ClusterInstance.provisioned(writerInstanceName, {
          instanceIdentifier: writerInstanceName,
          instanceType: ec2.InstanceType.of(
            ec2.InstanceClass.R6G,
            ec2.InstanceSize.XLARGE,
          ),
          publiclyAccessible: false,
          enablePerformanceInsights: [Stages.PROD].includes(
            props.stage as Stages,
          ),
        })
      : ClusterInstance.serverlessV2(writerInstanceName, {
          instanceIdentifier: writerInstanceName,
          publiclyAccessible: false,
        });

    // Reader instances
    const readerInstanceName = `${PROJECT_NAME}-reader-instance-${props.stage}`;
    const readers = [Stages.PROD].includes(props.stage as Stages)
      ? [
          ClusterInstance.provisioned(readerInstanceName, {
            instanceIdentifier: readerInstanceName,
            instanceType: ec2.InstanceType.of(
              ec2.InstanceClass.R6G,
              ec2.InstanceSize.XLARGE,
            ),
            publiclyAccessible: false,
          }),
        ]
      : [];

    return new DatabaseCluster(
      props.scope,
      `${PROJECT_NAME}-example-database-${props.stage}`,
      {
        engine: DatabaseClusterEngine.auroraMysql({
          version: AuroraMysqlEngineVersion.VER_3_10_2, // Check the latest version in the AWS CDK documentation
        }),
        clusterIdentifier: databaseName,
        defaultDatabaseName: 'example_db',
        credentials: Credentials.fromGeneratedSecret('hippo', {
          secretName: `${databaseName}-credentials`,
        }),
        writer,
        readers,
        serverlessV2MinCapacity: [Stages.PROD].includes(props.stage as Stages)
          ? undefined
          : 0.5,
        serverlessV2MaxCapacity: [Stages.PROD].includes(props.stage as Stages)
          ? undefined
          : 2,
        vpc,
        vpcSubnets: {
          subnets,
        },
        removalPolicy: [Stages.PROD, Stages.TEST].includes(
          props.stage as Stages,
        )
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
        storageEncrypted: true,
      },
    );
  }
}
