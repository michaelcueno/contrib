import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Form from 'src/components/forms/Form/Form';
import Layout from 'src/components/layouts/Layout';
import { UserAccountStatus } from 'src/types/UserAccount';

import { InfluencerOnboardingBasicPage } from '../InfluencerOnboardingBasicPage';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    influencerId: 'testId',
  }),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

cache.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {
      id: '123',
      phoneNumber: '123',
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      influencerProfile: {
        avatarUrl: 'test',
        id: 'test',
        name: 'test',
        profileDescription: '1',
        sport: '1',
        status: 'TRANSIENT',
        team: '1',
        favoriteCharities: [],
      },
      isAdmin: false,
      createdAt: '2021-02-18T14:36:35.208+00:00',
      notAcceptedTerms: null,
      assistant: null,
      paymentInformation: null,
      mongodbId: '321',
      charity: null,
      address: {
        name: 'test name',
        state: 'test state',
        city: 'test city',
        zipCode: 'test zipCode',
        country: 'test country',
        street: 'test street',
      },
    },
  },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateInfluencerProfileMutation,
      variables: { name: 'test', sport: 'test', team: 'test', profileDescription: 'test', influencerId: 'testId' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateInfluencerProfile: {
            id: 'testId',
            name: 'test',
            sport: 'test',
            team: 'test',
            profileDescription: 'test',
            avatarUrl: 'test',
            status: 'ONBOARDED',
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: UpdateInfluencerProfileMutation,
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

const submitValues = {
  name: 'test',
  sport: 'test',
  team: 'test',
  profileDescription: 'test',
};

describe('InfluencerOnboardingBasicPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <InfluencerOnboardingBasicPage />
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
            <MockedProvider cache={cache} mocks={mocks}>
              <InfluencerOnboardingBasicPage />
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
    expect(wrapper!.find(Layout)).toHaveLength(1);
  });

  it('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <InfluencerOnboardingBasicPage />
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
    expect(wrapper!.find(Layout)).toHaveLength(1);

    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValues);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
  it('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={errorMocks}>
              <InfluencerOnboardingBasicPage />
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
    expect(wrapper!.find(Layout)).toHaveLength(1);

    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValues);

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
});
