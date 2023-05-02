import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';
import { influencer } from 'src/helpers/testHelpers/influencer';

import { BasicFormFields } from '../BasicFormFields';

describe('BasicFormFields', () => {
  it('renders component', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <ToastProvider>
            <Form onSubmit={jest.fn}>
              <BasicFormFields influencer={influencer} />
            </Form>
          </ToastProvider>
        </MockedProvider>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });

    expect(wrapper).toHaveLength(1);
  });
});
