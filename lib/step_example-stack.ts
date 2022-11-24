import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Ecr } from './resources/ecr'
import { Network } from './resources/network'
import { Ecs } from './resources/ecs';

export class StepExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    env: {
      region: 'ap-northeast-1'
    }
    // ECR
    const ecr = new Ecr(this)
    ecr.createResources()
    // Network
    const network = new Network(this)
    network.createResources()
    // ECS taskdef
    const ecs = new Ecs(this, ecr.getOKImage(), ecr.getNGImage(), network.vpc)
    ecs.createResources()
  }
}
