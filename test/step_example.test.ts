import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as StepExample from '../lib/step_example-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/step_example-stack.ts
test('snapshot test', () => {
  const app = new cdk.App();
  const stack = new StepExample.StepExampleStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});
