import { Construct } from 'constructs';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs'
import { Vpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';

export interface EcsParam {
    scope: Construct,
    // ECSのタスク定義に利用するコンテナイメージ
    okImage: ContainerImage,
    ngImage: ContainerImage,
    vpc: Vpc
}