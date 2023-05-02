import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { auction } from 'src/helpers/testHelpers/auction';

import { EditDeliveryParcelButton } from '../EditDeliveryParcelButton';
import { Modal } from '../EditDeliveryParcelButton/Modal';

describe('Should render correctly "EditDeliveryParcelButton"', () => {
  const props: any = {
    auction,
    mutation: gql`
      mutation test($name: String!) {
        test(name: $name) {
          name
        }
      }
    `,
    getAuctionsList: jest.fn(),
    className: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <EditDeliveryParcelButton {...props} />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should open Modal when clicking', () => {
    wrapper.find('Button').simulate('click');
  });
  it('it should close Modal when clicking', () => {
    wrapper.find('Button').simulate('click');
    act(() => {
      wrapper.find(Modal).props().onClose();
    });
  });
});
