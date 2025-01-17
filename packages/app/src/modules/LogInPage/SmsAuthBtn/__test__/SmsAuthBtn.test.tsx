import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

import { SmsAuthBtn } from '..';
import AuthBtn from '../../AuthBtn';
import { Modal } from '../Modal';

const props = {
  returnURL: 'test returnUrl',
};

describe('SmsAuthBtn ', () => {
  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(<SmsAuthBtn {...props} />);

      expect(wrapper!).toHaveLength(1);
    });
  });

  describe('Handle onClose method in Modal', () => {
    it('should clode Modal', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MockedProvider>
            <ToastProvider>
              <SmsAuthBtn {...props} />
            </ToastProvider>
          </MockedProvider>,
        );

        wrapper!.find(AuthBtn).props().smsOnClick();

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        const modal = wrapper!.find(Modal);

        modal.props().onClose();

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        expect(wrapper!).toHaveLength(1);
      });
    });
  });
});
