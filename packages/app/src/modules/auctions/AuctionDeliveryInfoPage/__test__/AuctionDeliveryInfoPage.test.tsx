import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { testAccount } from 'src/helpers/testHelpers/account';

import AuctionDeliveryInfoPage from '../index';

const props: any = {
  isDeliveryPage: true,
};

test('renders without crashing AuctionDeliveryInfoPage', () => {
  mount(
    <UserAccountContext.Provider value={testAccount}>
      <MemoryRouter>
        <ToastProvider>
          <MockedProvider>
            <AuctionDeliveryInfoPage {...props} />
          </MockedProvider>
        </ToastProvider>
      </MemoryRouter>
    </UserAccountContext.Provider>,
  );
});
