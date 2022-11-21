import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr'

export class StepExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const okRepo = new ecr.Repository(this, 'OKRepo')
    const ngRepo = new ecr.Repository(this, 'NGRepo')
  }
}
