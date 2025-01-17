import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';

import { FormFields } from '../FormFields';
import {} from 'react-final-form';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  charity: {},
};

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider>
          <Form onSubmit={jest.fn()}>
            <FormFields {...props} />
          </Form>
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
