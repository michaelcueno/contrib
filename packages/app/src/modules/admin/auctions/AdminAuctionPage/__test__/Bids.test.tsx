import { shallow, ShallowWrapper } from 'enzyme';

import AsyncButton from 'src/components/buttons/AsyncButton';
import { bids } from 'src/helpers/testHelpers/bids';

import { Bids } from '../Bids';

describe('Should render correctly "Bids"', () => {
  const props: any = {
    bids: bids,
    onBidClickHandler: jest.fn(),
    loading: false,
    showProcessBtn: true,
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<Bids {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should run onBidClickHandler on click ', () => {
    wrapper.find(AsyncButton).simulate('click');
    expect(props.onBidClickHandler).toHaveBeenCalledTimes(1);
  });
  it('it should render "no bids" text', () => {
    wrapper.setProps({ bids: [] });
    expect(wrapper.text()).toEqual('no bids for this auction');
  });
});
