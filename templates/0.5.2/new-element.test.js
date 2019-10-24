import {instantiateForTest} from './src/util/test-utils';
import {{className}} from './{{fileName}}';

let {{variableName}};
beforeEach(() => {
  {{variableName}} = instantiateForTest({{className}});
});

test('{{fileName}} has working is', () => {
  expect({{variableName}}.constructor.is).toEqual('{{fileName}}');
});
