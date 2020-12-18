
import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';

import { BackendProcessor } from '../src';

test('BackendProcessor components', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'MyStack');

  // WHEN
  new BackendProcessor(stack, 'test-stack');

  // THEN
  expectCDK(stack).to(
    haveResource('AWS::Lambda::Function'),
  );
  //THEN
  expectCDK(stack).to(
    haveResource('AWS::DynamoDB::Table'),
  );
});