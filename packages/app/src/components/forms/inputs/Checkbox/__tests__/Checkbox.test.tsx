import { render } from '@testing-library/react';

import AsyncButton from 'src/components/buttons/AsyncButton';
import Form from 'src/components/forms/Form/Form';

import Checkbox from '..';

const mockedSumbit = jest.fn();
const props = {
  name: 'test',
};
test('renders without crashing', () => {
  render(
    <Form onSubmit={mockedSumbit}>
      <Checkbox {...props} />
    </Form>,
  );
});
