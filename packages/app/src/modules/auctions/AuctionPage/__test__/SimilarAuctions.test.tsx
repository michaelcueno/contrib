import React from 'react';

import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { auction } from 'src/helpers/testHelpers/auction';
import { AuctionStatus } from 'src/types/Auction';

import SimilarAuctions from '../SimilarAuctions';

jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionsListQuery,
  variables: {
    size: 10,
    skip: 0,
    filters: {
      status: [AuctionStatus.ACTIVE],
    },
  },
  data: {
    auctions: {
      items: [auction],
      size: 1,
      skip: 0,
      totalItems: 1,
    },
  },
});

describe('SimilarAuctions ', () => {
  it('component is defined but has not section', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <SimilarAuctions />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find('section')).toHaveLength(0);
  });
  it('component is defined and has section', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <SimilarAuctions />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find('section')).toHaveLength(1);
  });
});
