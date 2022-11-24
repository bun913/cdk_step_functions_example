import { Construct } from 'constructs';
import { aws_stepfunctions_tasks } from 'aws-cdk-lib';
import { FargateTaskDefinition, TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Cluster } from 'aws-cdk-lib/aws-ecs'
import { Vpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Errors, IntegrationPattern, Pass, TaskStateBase, Fail, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { EcsFargateLaunchTarget } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StepFunctionInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export class StepFunc {

    readonly scope: Construct
    readonly okTaskDef: FargateTaskDefinition
    readonly ngTaskDef: FargateTaskDefinition
    readonly cluster: Cluster
    readonly vpc: Vpc

    constructor(scope: Construct, okTaskDef: FargateTaskDefinition,
        ngTaskDef: FargateTaskDefinition,
        cluster: Cluster, vpc: Vpc) {

        this.scope = scope
        this.okTaskDef = okTaskDef
        this.ngTaskDef = ngTaskDef
        this.cluster = cluster
        this.vpc = vpc
    }

    public createResources() {

        const sg = this.createSG()
        // Step1
        const okTask = this.getRunTaskParam('Step1 OKRun', this.okTaskDef, [sg])
        const failStep1 = new Fail(this.scope, 'Step1Fail')
        okTask.addCatch(failStep1)
        // Step2
        const ngTask = this.getRunTaskParam('Step2 NGRun', this.ngTaskDef, [sg])
        const failStep2 = new Fail(this.scope, 'Step2Fail')
        ngTask.addCatch(failStep2)
        const definition = okTask.next(ngTask)
        // createSteate
        new StateMachine(this.scope, 'ExampleStepStateMachine', {
            definition
        })
    }

    private createSG(): SecurityGroup {
        // RunTaskの際に利用するSG
        const sg = new SecurityGroup(this.scope, 'RunTaskSG', {
            vpc: this.vpc,
            securityGroupName: 'stepExampleRuntaskSG',
            allowAllOutbound: true
        })
        return sg
    }

    private getRunTaskParam(id: string, taskdef: TaskDefinition, sg: [SecurityGroup]) {
        const runTask = new aws_stepfunctions_tasks.EcsRunTask(this.scope, id, {
            integrationPattern: IntegrationPattern.RUN_JOB,
            cluster: this.cluster,
            taskDefinition: taskdef,
            assignPublicIp: false,
            launchTarget: new EcsFargateLaunchTarget(),
            subnets: {
                subnets: this.vpc.isolatedSubnets
            },
            securityGroups: sg
        })
        return runTask
    }
}
