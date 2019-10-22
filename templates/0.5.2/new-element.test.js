import {instantiateForTest} from '../../util/test-utils';
import NewElement from './new-element';

let newElement;
beforeEach(() => {
  newElement = instantiateForTest(NewElement);
});

test('new-element has working is', () => {
  expect(newElement.constructor.is).toEqual('new-element');
});
