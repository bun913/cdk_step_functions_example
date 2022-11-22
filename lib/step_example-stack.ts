import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Ecr } from './resources/ecr'

export class StepExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // ECR
    const ecr = new Ecr(this)
    ecr.createResources()
  }
}
