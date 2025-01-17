import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import { AdminPage } from 'src/components/layouts/AdminPage';

import AdminAuctionsPage from '..';

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionsListQuery,
  variables: {
    size: 20,
    skip: 0,
    query: '',
  },
  data: {
    auctions: {
      items: [
        {
          attachments: [{ thumbnail: null, type: 'IMAGE', url: 'test' }],
          auctionOrganizer: {
            avatarUrl: 'test',
            id: 'testId',
            name: '123 123',
          },
          currentPrice: { amount: 5100, currency: 'USD', precision: 2 },
          description: 'test',
          startsAt: '2021-07-29T05:35:00.521Z',
          endsAt: '2021-07-30T15:35:00.521Z',
          fairMarketValue: null,
          followers: [],
          id: 'testId',
          isActive: false,
          isDraft: false,
          isFailed: true,
          isSettled: false,
          isSold: false,
          isStopped: false,
          itemPrice: { amount: 10000, currency: 'USD', precision: 2 },
          delivery: {
            parcel: {
              height: 1,
              length: 1,
              weight: 1,
              width: 1,
            },
          },
          startPrice: { amount: 100, currency: 'USD', precision: 2 },
          status: 'ACTIVE',
          title: 'test',
          totalBids: 1,
        },
      ],
      size: 1,
      skip: 0,
      totalItems: 1,
    },
  },
});

describe('AdminAuctionsPage ', () => {
  it('component is defined and has input with close button on it', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <AdminAuctionsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });
  it('component is defined and has search input without cancel button on it ', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <AdminAuctionsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      await wrapper!
        .find(AdminPage)
        .children()
        .find('input')
        .simulate('change', { target: { value: '' } });
      expect(wrapper!.find(AdminPage).children().find(SearchInput).children().text()).toHaveLength(0);
    });
  });
  it('component is defined, get data by query and has search input with cancel button on it', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <AdminAuctionsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper!).toHaveLength(1);

      await wrapper!
        .find(AdminPage)
        .children()
        .find('input')
        .simulate('change', { target: { value: 'test' } });
      expect(wrapper!.find(AdminPage).children().find(SearchInput).children().find('button').text()).toEqual('Cancel');
      wrapper!.find(AdminPage).children().find(SearchInput).children().find('button').simulate('click');
    });
  });
});
