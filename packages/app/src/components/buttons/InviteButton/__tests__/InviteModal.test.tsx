import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import PhoneInput from 'react-phone-input-2';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { InviteInfluencerMutation } from 'src/apollo/queries/invitations';
import { Modal } from 'src/components/buttons/InviteButton/Modal';
import Form from 'src/components/forms/Form/Form';

describe('InviteModal', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
    updateEntitisList: jest.fn(),
    mutation: InviteInfluencerMutation,
  };

  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: InviteInfluencerMutation,
        variables: {
          input: {
            firstName: 'test',
            lastName: 'test',
            phoneNumber: '+',
            welcomeMessage: 'test',
          },
        },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            inviteInfluencer: {
              invitationId: 'test',
            },
          },
        };
      },
    },
  ];
  const errorMocks = [
    {
      request: {
        query: InviteInfluencerMutation,
        variables: {},
      },
      newData: () => {
        mockFn();
        return {};
      },
    },
  ];

  it('component is defined', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Modal {...props} />
        </MockedProvider>
      </ToastProvider>,
    );
    expect(wrapper).toHaveLength(1);
  });

  it('should submit form and not call the mutation becouse of none submit values', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <Router>
              <Modal {...props} />
            </Router>
          </MockedProvider>
        </ToastProvider>,
      );

      wrapper.find(Form).props().onSubmit({});

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
  it('should submit the form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <Router>
              <Modal {...props} />
            </Router>
          </MockedProvider>
        </ToastProvider>,
      );

      wrapper.find(Form).props().onSubmit({
        firstName: 'test',
        lastName: 'test',
        welcomeMessage: 'test',
      });

      expect(mockFn).toHaveBeenCalledTimes(1);

      await new Promise((resolve) => setTimeout(resolve));

      expect(props.updateEntitisList).toHaveBeenCalledTimes(1);
      expect(props.onClose).toHaveBeenCalledTimes(1);

      wrapper!
        .find(PhoneInput)
        .children()
        .find('input')
        .simulate('change', { target: { value: '11111111111' } });
      expect(wrapper!.find(PhoneInput).props().inputClass).toEqual('');

      wrapper!
        .find(PhoneInput)
        .children()
        .find('input')
        .simulate('change', { target: { value: '78011111111' } });
      expect(wrapper!.find(PhoneInput).props().inputClass).toEqual('is-invalid');
    });
  });
  it('should not call mutation becouse of error', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={errorMocks}>
            <Router>
              <Modal {...props} />
            </Router>
          </MockedProvider>
        </ToastProvider>,
      );

      wrapper.find(Form).props().onSubmit({
        firstName: 'test',
        lastName: 'test',
        welcomeMessage: 'test',
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
});
