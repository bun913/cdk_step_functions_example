import { Construct } from 'constructs';
import { aws_stepfunctions_tasks } from 'aws-cdk-lib';
import {
  Errors,
  IntegrationPattern,
  Pass,
  TaskStateBase,
  Fail,
  StateMachine,
} from 'aws-cdk-lib/aws-stepfunctions';
import { EcsFargateLaunchTarget } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StepFunctionInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { StepFunctionsParam } from './interfaces/step_functions_param';

export class StepFunc {
  readonly params: StepFunctionsParam;

  constructor(params: StepFunctionsParam) {
    this.params = params;
  }

  public createResources() {
    const sg = this.createSG();
    // Step1
    const okTask = this.getRunTaskParam('Step1 OKRun', this.params.okTaskDef, [
      sg,
    ]);
    const failStep1 = new Fail(this.params.scope, 'Step1Fail');
    okTask.addCatch(failStep1);
    // Step2
    const ngTask = this.getRunTaskParam('Step2 NGRun', this.params.ngTaskDef, [
      sg,
    ]);
    const failStep2 = new Fail(this.params.scope, 'Step2Fail');
    ngTask.addCatch(failStep2);
    const definition = okTask.next(ngTask);
    // createSteate
    new StateMachine(this.params.scope, 'ExampleStepStateMachine', {
      definition,
    });
  }

  private createSG(): SecurityGroup {
    // RunTaskの際に利用するSG
    const sg = new SecurityGroup(this.params.scope, 'RunTaskSG', {
      vpc: this.params.vpc,
      securityGroupName: 'stepExampleRuntaskSG',
      allowAllOutbound: true,
    });
    return sg;
  }

  private getRunTaskParam(
    id: string,
    taskdef: TaskDefinition,
    sg: [SecurityGroup]
  ) {
    const runTask = new aws_stepfunctions_tasks.EcsRunTask(
      this.params.scope,
      id,
      {
        integrationPattern: IntegrationPattern.RUN_JOB,
        cluster: this.params.cluster,
        taskDefinition: taskdef,
        assignPublicIp: false,
        launchTarget: new EcsFargateLaunchTarget(),
        subnets: {
          subnets: this.params.vpc.isolatedSubnets,
        },
        securityGroups: sg,
      }
    );
    return runTask;
  }
}
