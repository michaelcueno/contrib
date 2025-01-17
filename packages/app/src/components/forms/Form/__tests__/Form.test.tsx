import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Form as FinalForm } from 'react-final-form';

import Form from 'src/components/forms/Form/Form';

describe('Form', () => {
  const props: any = {
    onSubmit: jest.fn(),
    constrains: 1,
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<Form {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should call onSubmit when submitting', async () => {
    await act(async () => {
      wrapper.simulate('submit', { data: 'test' });
    });

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });
});
