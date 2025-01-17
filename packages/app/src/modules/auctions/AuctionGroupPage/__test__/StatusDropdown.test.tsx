import { MockedProvider } from '@apollo/client/testing';
import { ReactWrapper, mount } from 'enzyme';

import Select from 'src/components/forms/selects/Select';

import StatusDropdown from '../Filters/StatusDropdown';

describe('Should render correctly "StatusDropdown"', () => {
  const props: any = {
    selectedStatuses: [],
    changeFilters: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <StatusDropdown {...props} />
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call changeFilters when changing', () => {
    wrapper.find(Select).props().onChange('All');
    wrapper.find(Select).props().onChange('Past');
    wrapper.find(Select).props().onChange('Active');
    expect(props.changeFilters).toHaveBeenCalledTimes(3);
  });
});
