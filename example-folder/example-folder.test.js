import {instantiateForTest} from '../../util/test-utils';
import ExampleFolder from './example-folder';

let exampleFolder;
beforeEach(() => {
  exampleFolder = instantiateForTest(ExampleFolder );
});

test('example-folder has working is', () => {
  expect(exampleFolder.constructor.is).toEqual(example-folder);
});
