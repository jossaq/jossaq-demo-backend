import * as fs from 'fs';
import * as path from 'path';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdanode from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';

// export interface BackendProcessor {
//   LambdaProcessorCore: lambda.Code;
// }

export class BackendProcessor extends cdk.Construct {
  public readonly handler: lambda.Function;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const entry = fs.existsSync(path.join(__dirname, 'lambda/handler.ts'))
      ? path.join(__dirname, 'lambda/handler.ts') // local development
      : path.join(__dirname, 'lambda/handler.js'); // when published in npm

    const table =new dynamodb.Table(this, 'backend-processor-table', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      readCapacity: 1,
      writeCapacity: 1,
    });

    this.handler = new lambdanode.NodejsFunction(this, 'backend-processor', {
      entry: entry,
      timeout: cdk.Duration.seconds(2),
      runtime: lambda.Runtime.NODEJS_12_X,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        TABLE_NAME: table.tableName,
      },
      bundling: {
        minify: true,
        externalModules: [
          'aws-sdk',
        ],
      },
    });

    table.grantFullAccess(this.handler);


  }
}
