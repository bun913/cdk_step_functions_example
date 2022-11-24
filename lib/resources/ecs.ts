import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { ContainerImage, Cluster } from 'aws-cdk-lib/aws-ecs'
import { Vpc,SecurityGroup } from 'aws-cdk-lib/aws-ec2';

export class Ecs {

    private scope: Construct
    private okImage: ContainerImage
    private ngImage: ContainerImage
    private vpc: Vpc

    constructor(scope: Construct, okImage: ContainerImage, ngImage: ContainerImage, vpc: Vpc) {
        this.scope = scope
        this.okImage = okImage
        this.ngImage = ngImage
        this.vpc = vpc
    }

    public createResources() {
        // タスク定義
        const okTaskDef = new FargateTaskDefinition(this.scope, 'okTaskDef', {
            memoryLimitMiB: 512,
            cpu: 256
        })
        const ngTaskDef = new FargateTaskDefinition(this.scope, 'ngTaskDef', {
            memoryLimitMiB: 512,
            cpu: 256
        })
        const okContainer = okTaskDef.addContainer('okContainer', {
            image: this.okImage,
            containerName: 'ok',
            privileged: false,
            readonlyRootFilesystem: true
        })
        const ngContainer = ngTaskDef.addContainer('ngContainer', {
            image: this.ngImage,
            containerName: 'ng',
            privileged: false,
            readonlyRootFilesystem: true
        })
        // ECSクラスタ
        const cluster = new Cluster(this.scope, 'FargateCluster', {
            vpc: this.vpc,
            clusterName: 'StepExample',
            containerInsights: false,
        });
        // RunTaskの際に利用するSG
        const sg = new SecurityGroup(this.scope, 'RunTaskSG', {
            vpc: this.vpc,
            securityGroupName: 'stepExampleRuntaskSG',
            allowAllOutbound: true
        })
    }
}
