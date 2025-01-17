import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';

import { ChartDoughnut } from '../index';

jest.mock('react-chartjs-2', () => ({
  Doughnut: () => null,
}));
describe('Should render correctly "ChartDoughnut"', () => {
  const props: any = {
    labels: ['test', 'test2', 'test3', 'test3', 'test5', 'test6'],
    values: ['test', 'test2'],
  };
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <ChartDoughnut {...props} />
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
