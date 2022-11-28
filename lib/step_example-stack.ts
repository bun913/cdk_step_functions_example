import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Ecr } from './resources/ecr'
import { Network } from './resources/network'
import { Ecs } from './resources/ecs';
import { StepFunc } from './resources/step_functions';

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
    const ecs = new Ecs({scope: this, okImage: ecr.getOKImage(), ngImage:ecr.getNGImage(), vpc: network.vpc})
    ecs.createResources()
    // StepFunc
    const sf = new StepFunc(this, ecs.okTaskDef, ecs.ngTaskDef, ecs.cluster, network.vpc)
    sf.createResources()
  }
}
