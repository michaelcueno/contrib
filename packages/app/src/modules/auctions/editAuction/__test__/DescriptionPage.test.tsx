import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import Form from 'src/components/forms/Form/Form';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { testAccount } from 'src/helpers/testHelpers/account';
import { auctionForCreation as auction } from 'src/helpers/testHelpers/auction';

import DescriptionPage from '../DescriptionPage';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
    push: mockHistoryFn,
    goBack: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));
const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const nullDataCache = new InMemoryCache();
const undefinedlDataCache = new InMemoryCache();
cache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});
cache2.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...auction,
      isActive: false,
    },
  },
});

nullDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: null },
});

undefinedlDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: undefined },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateAuctionMutation,
      variables: { id: 'testId', input: { description: 'test' } },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateAuction: {
            id: 'testId',
            description: 'test',
            title: 'test',
            link: 'test',
            startsAt: '2021-07-01T22:28:00.261Z',
            endsAt: '2021-08-14T19:01:00.232Z',
            startPrice: { amount: 100, currency: 'USD', precision: 2 },
            itemPrice: null,
            charity: {
              id: 'testId',
              name: 'test',
            },
            fairMarketValue: { amount: 100, currency: 'USD', precision: 2 },
            items: [],
          },
        },
      };
    },
  },
];
const submitValues = {
  description: 'test',
};
describe('EditAuctionDescriptionPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <DescriptionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
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
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache}>
                <DescriptionPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Layout)).toHaveLength(1);

    wrapper!.find(StepByStepPageLayout).prop('prevAction')!();
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('component should return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={undefinedlDataCache}>
              <DescriptionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <DescriptionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('component should redirect if isActive true and user is not admin', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <DescriptionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('should submit form and not call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={mocks}>
                <DescriptionPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should submit form and call the mutation and goBack', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2} mocks={mocks}>
                <DescriptionPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValues);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('should submit form and call the mutation and push', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={mocks}>
                <DescriptionPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValues);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockHistoryFn).toHaveBeenCalled();
  });
});
