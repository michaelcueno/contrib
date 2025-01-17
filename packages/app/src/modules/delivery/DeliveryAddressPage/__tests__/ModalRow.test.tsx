import { MockedProvider } from '@apollo/client/testing';
import { mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';
import { ModalRow } from 'src/modules/delivery/DeliveryAddressPage/ModalRow';

describe('Should render correctly "ModalRow"', () => {
  const props: any = {
    title: 'zip code',
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <ToastProvider>
        <Form onSubmit={jest.fn()}>
          <ModalRow {...props} />
        </Form>
      </ToastProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('span').text()).toEqual('zip code');
  });
});
