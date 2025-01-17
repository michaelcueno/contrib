import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { AfterLogin } from '..';

describe('Should render correctly "AfterLogin"', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/test']}>
        <AfterLogin />
      </MemoryRouter>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
