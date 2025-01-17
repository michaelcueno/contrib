import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import { ActiveCharitiesList } from 'src/apollo/queries/charities';
import Form from 'src/components/forms/Form/Form';
import { CharitySearchSelect } from 'src/components/forms/selects/CharitySearchSelect';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { testAccount } from 'src/helpers/testHelpers/account';
import { auctionForCreation as auction } from 'src/helpers/testHelpers/auction';

import CharityPage from '../CharityPage';

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
const nullAuctionDataCache = new InMemoryCache();
const nullCharityDataCache = new InMemoryCache();
const undefinedlDataCache = new InMemoryCache();
const cacheAuctionWithoutDescription = new InMemoryCache();
const cacheAuctionWithoutVideoAttachments = new InMemoryCache();
const cacheAuctionWithoutItemPrice = new InMemoryCache();
const cacheAuctionWithoutFairMarketValue = new InMemoryCache();

const ActiveCharitiesListQuery = {
  query: ActiveCharitiesList,
  variables: { filters: { status: ['ACTIVE'] } },
  data: {
    charitiesList: {
      items: [
        { id: 'testId', name: 'test' },
        { id: 'testId2', name: 'test2' },
      ],
    },
  },
};

cache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});
cache.writeQuery(ActiveCharitiesListQuery);

nullAuctionDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: null },
});

undefinedlDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: undefined },
});

nullCharityDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});
nullCharityDataCache.writeQuery({
  query: ActiveCharitiesList,
  data: null,
});

cacheAuctionWithoutDescription.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...auction, description: null },
  },
});
cacheAuctionWithoutDescription.writeQuery(ActiveCharitiesListQuery);

cacheAuctionWithoutVideoAttachments.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...auction, attachments: [] },
  },
});
cacheAuctionWithoutVideoAttachments.writeQuery(ActiveCharitiesListQuery);

cacheAuctionWithoutItemPrice.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...auction, itemPrice: null },
  },
});
cacheAuctionWithoutItemPrice.writeQuery(ActiveCharitiesListQuery);

cacheAuctionWithoutFairMarketValue.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...auction, fairMarketValue: null },
  },
});
cacheAuctionWithoutFairMarketValue.writeQuery(ActiveCharitiesListQuery);

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateAuctionMutation,
      variables: { id: 'testId', input: { charity: 'testId' } },
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
const errorMocks = [
  {
    request: {
      query: UpdateAuctionMutation,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
];

describe('EditAuctionCharityPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <CharityPage />
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
  it('component should return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={undefinedlDataCache}>
              <CharityPage />
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

  it('component should return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={nullCharityDataCache}>
                <CharityPage />
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
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullAuctionDataCache}>
              <CharityPage />
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
              <CharityPage />
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
  it('should submit and redirect to description page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheAuctionWithoutDescription}>
                <CharityPage />
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
      wrapper!.find(CharitySearchSelect).props().onChange(null);
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    await act(async () => {
      wrapper!.find(CharitySearchSelect).props().onChange({ value: 'test', label: 'test', id: 'testId' });
    });
    wrapper!.update();
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('should submit and redirect to fmv page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheAuctionWithoutFairMarketValue}>
                <CharityPage />
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
      wrapper!.find(CharitySearchSelect).props().onChange(null);
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    await act(async () => {
      wrapper!.find(CharitySearchSelect).props().onChange({ value: 'test', label: 'test', id: 'testId' });
    });
    wrapper!.update();
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('should submit and redirect to video page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheAuctionWithoutVideoAttachments}>
                <CharityPage />
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
      wrapper!.find(CharitySearchSelect).props().onChange({ value: 'test', label: 'test', id: 'testId' });
    });
    wrapper!.update();
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('should submit and redirect to start price page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheAuctionWithoutItemPrice}>
                <CharityPage />
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
      wrapper!.find(CharitySearchSelect).props().onChange({ value: 'test', label: 'test', id: 'testId' });
    });
    wrapper!.update();
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('should redirect to duration page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={mocks}>
                <CharityPage />
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
  });
  it('should submit and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={mocks}>
                <CharityPage />
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
      wrapper!.find(CharitySearchSelect).props().onChange({ value: 'test', label: 'test', id: 'testId' });
    });
    wrapper!.update();
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should submit and not call the mutation becouse of eror', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={errorMocks}>
                <CharityPage />
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
      wrapper!.find(CharitySearchSelect).props().onChange({ value: 'test', label: 'test', id: 'testId' });
    });
    wrapper!.update();
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
