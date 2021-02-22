import { render } from '@testing-library/react';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';
import { UserAccountStatus } from '../../model/UserAccount';
import { MockedProvider } from '@apollo/client/testing';
import PhoneNumberConfirmation from '../PhoneNumberConfirmation/PhoneNumberConfirmation';
import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();
cache.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {
      id: '123',
      phoneNumber: '123',
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      influencerProfile: null,
    },
  },
});

const mockHistoryReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

test('renders without crashing', () => {
  render(
    <MockedProvider cache={cache}>
      <PhoneNumberConfirmation />
    </MockedProvider>,
  );
});
