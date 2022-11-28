import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Resource } from './abstract/resource';

export class Network extends Resource {
  private scope: Construct;
  public vpc: ec2.Vpc;

  constructor(scope: Construct) {
    super();
    this.scope = scope;
  }

  /**
   * createResources
   */
  public createResources() {
    this.addVPC();
    this.addVpcEndpoints();
  }

  private addVPC() {
    const vpc = new ec2.Vpc(this.scope, 'Vpc', {
      cidr: '10.10.0.0/16',
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    this.vpc = vpc;
  }

  private addVpcEndpoints() {
    this.vpc.addInterfaceEndpoint('ecr-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
    });
    this.vpc.addInterfaceEndpoint('ecr-dkr-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    });
    this.vpc.addInterfaceEndpoint('logs-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });
    this.vpc.addGatewayEndpoint('s3-endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnets: this.vpc.isolatedSubnets,
        },
      ],
    });
  }
}
