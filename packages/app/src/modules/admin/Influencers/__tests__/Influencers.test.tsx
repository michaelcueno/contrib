import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { Button } from 'react-bootstrap';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { InfluencersListQuery } from 'src/apollo/queries/influencers';
import { ResendInviteMessageMutation } from 'src/apollo/queries/invitations';
import { ResendInvitationButton } from 'src/components/buttons/ResendInvitationButton';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import { AdminPage } from 'src/components/layouts/AdminPage';

import Influencers from '..';

const cache = new InMemoryCache();

cache.writeQuery({
  query: InfluencersListQuery,
  variables: { size: 20, skip: 0, filters: { query: '' }, orderBy: 'STATUS_ASC' },
  data: {
    influencersList: {
      items: [
        {
          id: 'testId',
          name: 'test',
          avatarUrl: 'test',
          sport: 'test',
          status: 'INVITATION_PENDING',
          totalRaisedAmount: 0,
          followers: {
            user: 'test',
          },
        },
      ],
      size: 20,
      skip: 0,
      totalItems: 1,
    },
  },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: ResendInviteMessageMutation,
      variables: { influencerId: 'testId', name: 'test' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          resendInviteMessage: {
            link: 'test',
            phoneNumber: 'test',
            firstName: 'test',
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: ResendInviteMessageMutation,
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

describe('AdminAuctionPage ', () => {
  afterEach(() => jest.clearAllMocks());
  it('component is defined and has input with close button on it', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });
  it('component is defined and get data by query', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
      expect(wrapper!).toHaveLength(1);

      await wrapper
        .find(AdminPage)
        .children()
        .find('input')
        .simulate('change', { target: { value: 'test' } });
      expect(wrapper.find(AdminPage).children().find(SearchInput).children().find('button').text()).toEqual('Cancel');
      wrapper.find(AdminPage).children().find(SearchInput).children().find('button').simulate('click');
    });
  });
  it('should call the mutation ResendInviteMessageMutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper.find(Button).last().text()).toEqual('...');

      wrapper.find(Button).last().simulate('click');
      expect(wrapper.find(ResendInvitationButton)).toHaveLength(1);
      wrapper.find(ResendInvitationButton).first().simulate('click');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
  it('should not call the mutation ResendInviteMessageMutation becouse of error ', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={errorMocks}>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      wrapper.find(Button).last().simulate('click');
      expect(wrapper.find(ResendInvitationButton).first().text()).toEqual('Resend Invite Message');

      wrapper.find(ResendInvitationButton).first().simulate('click');
      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
});
