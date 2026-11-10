import { Construct } from 'constructs';

export interface IStackBasicProps {
  scope: Construct;
  name: string;
  stage: string;
  account: string;
  region: string;
}
