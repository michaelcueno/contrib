import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { testAccount } from 'src/helpers/testHelpers/account';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import * as auth from 'src/helpers/useAuth';

import DeliveryStatusPage from '..';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryFn,
    replace: mockHistoryFn,
  }),
  useParams: () => ({
    auctionId: 'testId',
  }),
}));
window.prompt = () => {};
document.execCommand = jest.fn();

const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const cache3 = new InMemoryCache();

cache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...AuctionQueryAuction,
      winner: { ...AuctionQueryAuction.winner, mongodbId: 'ttestId' },
    },
  },
});
cache2.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: AuctionQueryAuction,
  },
});
cache3.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...AuctionQueryAuction,
      delivery: { ...AuctionQueryAuction.delivery, status: 'DELIVERY_PAID' },
      winner: { ...AuctionQueryAuction.winner, mongodbId: 'ttestId' },
    },
  },
});

describe('DeliveryPaymentPage', () => {
  beforeEach(() => {
    const spy = jest.spyOn(auth, 'useAuth');
    spy.mockReturnValue({
      isAuthenticated: true,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component returns null', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <UserAccountContext.Provider value={testAccount}>
            <MockedProvider>
              <DeliveryStatusPage />
            </MockedProvider>
          </UserAccountContext.Provider>
        </ToastProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
    wrapper!.unmount();
  });

  it('component should redirect without account', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={{ account: null }}>
              <MockedProvider cache={cache}>
                <DeliveryStatusPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component should redirect when auctions status is ADDRESS_PROVIDED', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache}>
                <DeliveryStatusPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('component should redirect without winner', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2}>
                <DeliveryStatusPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
  it('component defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache3}>
                <DeliveryStatusPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
      expect(wrapper.find(Layout)).toHaveLength(1);

      wrapper!.find('CopyToClipboard').children().find('Button').simulate('click');
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });
});
