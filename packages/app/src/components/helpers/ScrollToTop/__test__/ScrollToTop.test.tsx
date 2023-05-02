import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScrollToTop } from '..';

test('renders without crashing', () => {
  document.documentElement.scrollTo = function () {};
  render(
    <MemoryRouter>
      <MockedProvider>
        <ScrollToTop />
      </MockedProvider>
    </MemoryRouter>,
  );
});
