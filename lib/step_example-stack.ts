import { join } from 'path'
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr'
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrdeploy from 'cdk-ecr-deployment';

export class StepExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // ECR
    const okRepo = new ecr.Repository(this, 'OKRepo')
    const ngRepo = new ecr.Repository(this, 'NGRepo')
    const okImage = new DockerImageAsset(this, 'OKImage', {
      directory: join('./', 'docker', 'ok'),
      platform: Platform.LINUX_AMD64
    })
    const ngImage = new DockerImageAsset(this, 'NGImage', {
      directory: join('./', 'docker', 'ng'),
      platform: Platform.LINUX_AMD64
    })
    const ecrDeploySet = [
      { 'name': 'okImage', 'imgSource': okImage.imageUri, 'repoUri': okRepo.repositoryUri },
      { 'name': 'ngImage', 'imgSource': ngImage.imageUri, 'repoUri': ngRepo.repositoryUri }
    ]
    ecrDeploySet.forEach(dic => {
      new ecrdeploy.ECRDeployment(this, dic.name, {
        src: new ecrdeploy.DockerImageName(dic.imgSource),
        dest: new ecrdeploy.DockerImageName(dic.repoUri)
      })
    })
  }
}
