import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from './stacks/InfrastructureStack';
import { IStackBasicProps } from './interfaces/IStackProps';
import * as dotenv from 'dotenv';

dotenv.config();
const app = new cdk.App();

// NOTE: Ensure the infra PROJECT_NAME match with the backend PROJECT_NAME to facilitate the follow up.
export const PROJECT_NAME = 'cdk-example';

// IMPORTANT: STACK_NAME must not be the same as the PROJECT_NAME because it will
// be usedto create the stack name and may collide with Backend Project Stack.
export const STACK_NAME = 'cdk-example-infra';

if (
  !process.env.STAGE ||
  !process.env.AWS_ACCOUNT_ID ||
  !process.env.AWS_REGION
) {
  throw new Error('STAGE, AWS_ACCOUNT_ID, and AWS_REGION must be set');
}

const basicProps: IStackBasicProps = {
  scope: app,
  name: `${STACK_NAME}-${process.env.STAGE}`,
  stage: process.env.STAGE,
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
};

new InfrastructureStack(basicProps);
