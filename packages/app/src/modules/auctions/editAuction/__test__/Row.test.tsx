import { mount } from 'enzyme';

import Row from '../common/Row';

describe('Row', () => {
  describe('with default params', () => {
    it('renders component', () => {
      const wrapper = mount(<Row description="description">{<>test</>}</Row>);
      expect(wrapper!).toHaveLength(1);
    });
  });
  describe('with all params', () => {
    it('renders component', () => {
      const wrapper = mount(
        <Row childrenWrapperClassName="pb-0" description="description" title="title">
          {<>test</>}
        </Row>,
      );
      expect(wrapper!).toHaveLength(1);
    });
  });
});
