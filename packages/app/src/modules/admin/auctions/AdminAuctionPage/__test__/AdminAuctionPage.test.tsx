import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import DineroFactory from 'dinero.js';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import {
  AuctionForAdminPageQuery,
  ChargeCurrentAuctionMutation,
  CustomerInformationQuery,
  AuctionMetricsQuery,
} from 'src/apollo/queries/auctions';
import { PopulatedAuctionBidsQuery, ChargeCurrentBidMutation } from 'src/apollo/queries/bids';
import AsyncButton from 'src/components/buttons/AsyncButton';
import Layout from 'src/components/layouts/Layout';
import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import { bids } from 'src/helpers/testHelpers/bids';
import { metrics } from 'src/helpers/testHelpers/metrics';
import { Modal } from 'src/modules/admin/auctions/AdminAuctionPage/Modal';
import { UserAccountStatus } from 'src/types/UserAccount';

import AdminAuctionPage from '..';
import Bids from '../Bids';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

jest.mock('react-chartjs-2', () => ({
  Doughnut: () => null,
  Bar: () => null,
}));

const mockChargeAuction = jest.fn();
const mockChargeCurrentBid = jest.fn();

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionForAdminPageQuery,
  variables: {
    id: 'testId',
  },
  data: {
    auction: auctionForAdminPage,
  },
});
cache.writeQuery({
  query: AuctionMetricsQuery,
  variables: {
    auctionId: 'testId',
  },
  data: {
    getAuctionMetrics: metrics,
  },
});
cache.writeQuery({
  query: PopulatedAuctionBidsQuery,
  variables: {
    auctionId: 'testId',
  },
  data: {
    populatedBids: bids,
  },
});
cache.writeQuery({
  query: CustomerInformationQuery,
  variables: { stripeCustomerId: 'testId' },
  data: {
    getCustomerInformation: { email: 'test@gmail.com', phone: '+375290000000' },
  },
});
const mocks = [
  {
    request: {
      query: ChargeCurrentAuctionMutation,
      variables: {
        id: 'testId',
      },
    },
    newData: () => {
      mockChargeAuction();
      return {
        data: {
          chargeAuction: {
            id: 'testId',
          },
        },
      };
    },
  },
  {
    request: {
      query: ChargeCurrentBidMutation,
      variables: {
        charityId: '60c1f579ff49a51d6f2ee61b',
        charityStripeAccountId: 'acct_1J0nltPSFS13RiaC',
        bid: { amount: 2000, currency: 'USD', precision: 2 },
        auctionTitle: '1',
        user: {
          id: 'test',
          mongodbId: 'test',
          phoneNumber: '+000000000000',
          status: 'COMPLETED',
          stripeCustomerId: 'test',
          createdAt: '2021-07-20T21:47:12.849Z',
        },
      },
    },
    newData: () => {
      mockChargeCurrentBid();
      return {
        data: {
          chargeCurrendBid: {
            id: 'testId',
          },
        },
      };
    },
  },
];

const arg = {
  id: 'testId',
  bid: { amount: 2000, currency: DineroFactory.defaultCurrency, precision: 2 },
  createdAt: new Date('2021-07-20T21:47:12.849Z'),
  charityId: '',
  user: {
    createdAt: new Date('2021-07-20T21:47:12.849Z'),
    id: 'test',
    mongodbId: 'test',
    phoneNumber: '+000000000000',
    stripeCustomerId: 'test',
    notAcceptedTerms: null,
    status: UserAccountStatus.COMPLETED,
    paymentInformation: null,
  },
};
describe('AdminAuctionPage ', () => {
  beforeAll(() => {
    process.env = { ...process.env, REACT_APP_PLATFORM_URL: 'https://dev.contrib.org' };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component returns null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <AdminAuctionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <AdminAuctionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper!.update();

      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });

    act(() => {
      wrapper!.find(Modal).props().onClose();
    });
    act(() => {
      wrapper!.find(Modal).props().onConfirm();
    });
    await act(async () => {
      await wrapper!.find(Bids).props().onBidClickHandler(arg);
    });
    await act(async () => {
      await wrapper!.find(AsyncButton).at(0).simulate('click');
    });
  });

  describe('call charge bid handler', () => {
    it('should charge current bid', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cache} mocks={mocks}>
                <AdminAuctionPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );

        await new Promise((resolve) => setTimeout(resolve));
        wrapper!.update();
      });

      await act(async () => {
        await wrapper!.find(Bids).props().onBidClickHandler(arg);
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      await act(async () => {
        wrapper!.find(Modal).props().onConfirm();
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
    });
  });

  describe('call charge auction handler', () => {
    it('should charge auction', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cache} mocks={mocks}>
                <AdminAuctionPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );

        await new Promise((resolve) => setTimeout(resolve));
        wrapper!.update();
      });

      await act(async () => {
        await wrapper!.find(AsyncButton).at(0).simulate('click');
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      await act(async () => {
        wrapper!.find(Modal).props().onConfirm();
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockChargeAuction).toBeCalled();
    });
  });
});
