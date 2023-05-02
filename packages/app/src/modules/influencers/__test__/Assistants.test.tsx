import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/layouts/Layout';

import { AssistantsQuery } from '../../../apollo/queries/assistants';
import Assistants from '../Assistants';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    influencerId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/assistants/testId' }),
}));

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
const nullDataCache = new InMemoryCache();

cache.writeQuery({
  query: AssistantsQuery,
  variables: { id: 'testId' },

  data: {
    influencer: {
      assistants: [{ id: 'testId', name: 'test', status: 'ONBOARDED' }],
      id: 'testId',
      name: 'test',
    },
  },
});
nullDataCache.writeQuery({
  query: AssistantsQuery,
  variables: { id: 'testId' },

  data: {
    influencer: null,
  },
});

describe('Assistants ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <Assistants />
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
            <MockedProvider cache={cache}>
              <Assistants />
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
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <Assistants />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
});
