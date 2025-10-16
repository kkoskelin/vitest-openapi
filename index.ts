import { expect } from 'vitest';
import type { OpenAPISpecObject } from 'openapi-validator';
import openapiValidator from 'openapi-validator';
import jestToSatisfyApiSpec from 'jest-openapi/dist/matchers/toSatisfyApiSpec.js';
import jestToSatisfySchemaInApiSpec from 'jest-openapi/dist/matchers/toSatisfySchemaInApiSpec.js';

interface MatcherResult {
  pass: boolean;
  message: () => string;
}

interface CustomMatchers<R = unknown> {
  toSatisfyApiSpec(): R;
  toSatisfySchemaInApiSpec(schemaName: string): R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

export default (filepathOrObject: string | OpenAPISpecObject): void => {
  const openApiSpec = openapiValidator.makeApiSpec(filepathOrObject);

  expect.extend({
    toSatisfyApiSpec: (received: unknown): MatcherResult =>
      jestToSatisfyApiSpec.default(received, openApiSpec) as MatcherResult,
    toSatisfySchemaInApiSpec: (received: unknown, schemaName: string): MatcherResult =>
      jestToSatisfySchemaInApiSpec.default(received, schemaName, openApiSpec) as MatcherResult
  });
};
