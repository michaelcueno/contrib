import { render } from '@testing-library/react';

import { ActionsDropdown } from 'src/components/forms/selects/ActionsDropdown';

const props: any = {
  title: 'test',
};
test('renders without crashing', () => {
  render(<ActionsDropdown {...props} />);
});
