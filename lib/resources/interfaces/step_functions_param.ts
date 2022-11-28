import { Construct } from 'constructs';
import { Cluster } from 'aws-cdk-lib/aws-ecs'
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';

export interface StepFunctionsParam {
    scope: Construct,
    vpc: Vpc
    okTaskDef: FargateTaskDefinition
    ngTaskDef: FargateTaskDefinition
    cluster: Cluster
}