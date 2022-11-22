import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs'

export class Ecs {

    private scope: Construct
    private okImage: ContainerImage
    private ngImage: ContainerImage

    constructor(scope: Construct, okImage: ContainerImage, ngImage: ContainerImage) {
        this.scope = scope
        this.okImage = okImage
        this.ngImage = ngImage
    }

    public createResources() {
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
    }
}
