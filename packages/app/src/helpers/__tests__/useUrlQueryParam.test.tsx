import { shallow, mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';

import { useUrlQueryParam } from '../useUrlQueryParam';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
    search: '?test=1',
  }),
}));
it('should get query param', () => {
  expect(useUrlQueryParam('test')).toBe('1');
});
