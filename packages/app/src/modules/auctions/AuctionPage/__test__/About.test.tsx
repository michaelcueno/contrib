import { render } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import About from '../GeneralInformation/About';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  description: 'test',
};

test('renders without crashing', () => {
  render(
    <Router>
      <About {...props} />
    </Router>,
  );
});
