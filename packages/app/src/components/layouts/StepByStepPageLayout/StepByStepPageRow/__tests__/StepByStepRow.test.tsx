import { mount, ReactWrapper } from 'enzyme';

import StepByStepPageRow from '..';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));
describe('Should render correctly "StepByStepPageRow"', () => {
  const props = {
    loading: true,
    isActive: true,
  };
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<StepByStepPageRow {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call goBack', () => {
    wrapper.find('Button').first().simulate('click');
    expect(mockHistoryFn).toHaveBeenCalledTimes(1);
  });
});
