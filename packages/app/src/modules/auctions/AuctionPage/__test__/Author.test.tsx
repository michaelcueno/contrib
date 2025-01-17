import { render } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import Author from '../GeneralInformation/Author';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  id: '123',
  name: 'test',
  avatarUrl: '/test/url',
};

test('renders without crashing', () => {
  render(
    <Router>
      <Author {...props} />
    </Router>,
  );
});
