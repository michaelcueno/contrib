import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import { CreateInfluencerModal } from 'src/modules/admin/Influencers/CreateInfluencer/CreateInfluencerModal';

import { CreateInfluencer } from '../CreateInfluencer';

describe('CreateInfluencer', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <Router>
          <CreateInfluencer />
        </Router>
      </MockedProvider>,
    );
  });

  it('renders component', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('opens Modal on the button clicking', () => {
    wrapper.children().find('Button').simulate('click');
  });

  it('closes Modal on the close button click', () => {
    wrapper.children().find('Button').simulate('click');
    wrapper.children().find(CreateInfluencerModal).children().find('.btn-close').simulate('click');
  });
});
