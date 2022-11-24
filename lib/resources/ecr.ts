import { join } from 'path'
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr'
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrdeploy from 'cdk-ecr-deployment';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs'
import { RemovalPolicy } from 'aws-cdk-lib';

export class Ecr {

    private scope: Construct
    private okRepo: ecr.Repository
    private ngRepo: ecr.Repository

    constructor(scope: Construct) {
        this.scope = scope
    }

    public createResources() {
        const okRepo = new ecr.Repository(this.scope, 'OKRepo', { removalPolicy: RemovalPolicy.DESTROY })
        const ngRepo = new ecr.Repository(this.scope, 'NGRepo', { removalPolicy: RemovalPolicy.DESTROY })
        const okImage = new DockerImageAsset(this.scope, 'OKImage', {
            directory: join('./', 'docker', 'ok'),
            platform: Platform.LINUX_AMD64
        })
        const ngImage = new DockerImageAsset(this.scope, 'NGImage', {
            directory: join('./', 'docker', 'ng'),
            platform: Platform.LINUX_AMD64
        })
        const ecrDeploySet = [
            { 'name': 'okImage', 'imgSource': okImage.imageUri, 'repoUri': okRepo.repositoryUri },
            { 'name': 'ngImage', 'imgSource': ngImage.imageUri, 'repoUri': ngRepo.repositoryUri }
        ]
        ecrDeploySet.forEach(dic => {
            new ecrdeploy.ECRDeployment(this.scope, dic.name, {
                src: new ecrdeploy.DockerImageName(dic.imgSource),
                dest: new ecrdeploy.DockerImageName(dic.repoUri)
            })
        })
        this.okRepo = okRepo
        this.ngRepo = ngRepo
    }

    public getOKImage(): ContainerImage {
        const okImage = ContainerImage.fromEcrRepository(this.okRepo, 'latest')
        return okImage
    }

    public getNGImage(): ContainerImage {
        const ngImage = ContainerImage.fromEcrRepository(this.ngRepo, 'latest')
        return ngImage
    }
}
