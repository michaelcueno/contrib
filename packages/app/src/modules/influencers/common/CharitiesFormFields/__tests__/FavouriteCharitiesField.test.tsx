import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Form from 'src/components/forms/Form/Form';
import CharitiesAutocomplete from 'src/components/forms/selects/CharitiesAutocomplete';
import { CharityStatus, CharityProfileStatus, CharityStripeStatus } from 'src/types/Charity';

import { FavouriteCharitiesField } from '../FavouriteCharitiesField';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);
jest.mock('src/components/forms/Form/hooks/useField', () => () => {
  return {
    name: 'favoriteCharities',
    hasError: false,
    checked: undefined,
    disabled: false,
    errorMessage: null,
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: [
      {
        id: 'testId',
        name: 'test',
        profileStatus: 'COMPLETED',
        status: 'ACTIVE',
        stripeStatus: 'ACTIVE',
      },
    ],
  };
});
const props = {
  name: 'test',
  disabled: false,
};
const charity = {
  id: 'testId',
  name: 'test',
  profileStatus: CharityProfileStatus.COMPLETED,
  status: CharityStatus.ACTIVE,
  stripeStatus: CharityStripeStatus.ACTIVE,
  stripeAccountLink: 'test',
};
describe('Should render correctly', () => {
  let wrapper: ReactWrapper;
  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <Form onSubmit={jest.fn()}>
            <FavouriteCharitiesField {...props} />
          </Form>
        </MockedProvider>,
      );
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('', () => {
    expect(wrapper).toHaveLength(1);
    wrapper.find(CharitiesAutocomplete).props().onChange(charity, false);
  });
  it('', () => {
    expect(wrapper).toHaveLength(1);
    wrapper
      .find(CharitiesAutocomplete)
      .props()
      .onChange({ ...charity, id: 'testId2' }, true);
  });
});
