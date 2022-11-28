import { EcsParam } from './interfaces/ecs_param';
import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Cluster } from 'aws-cdk-lib/aws-ecs';

export class Ecs {
  private params: EcsParam;
  public cluster: Cluster;
  public okTaskDef: FargateTaskDefinition;
  public ngTaskDef: FargateTaskDefinition;

  constructor(params: EcsParam) {
    this.params = params;
  }

  public createResources() {
    // タスク定義
    const okTaskDef = new FargateTaskDefinition(
      this.params.scope,
      'okTaskDef',
      {
        memoryLimitMiB: 512,
        cpu: 256,
      }
    );
    const ngTaskDef = new FargateTaskDefinition(
      this.params.scope,
      'ngTaskDef',
      {
        memoryLimitMiB: 512,
        cpu: 256,
      }
    );
    const okContainer = okTaskDef.addContainer('okContainer', {
      image: this.params.okImage,
      containerName: 'ok',
      privileged: false,
      readonlyRootFilesystem: true,
    });
    const ngContainer = ngTaskDef.addContainer('ngContainer', {
      image: this.params.ngImage,
      containerName: 'ng',
      privileged: false,
      readonlyRootFilesystem: true,
    });
    // ECSクラスタ
    const cluster = new Cluster(this.params.scope, 'FargateCluster', {
      vpc: this.params.vpc,
      clusterName: 'StepExample',
      containerInsights: false,
    });
    this.cluster = cluster;
    this.ngTaskDef = ngTaskDef;
    this.okTaskDef = okTaskDef;
  }
}
