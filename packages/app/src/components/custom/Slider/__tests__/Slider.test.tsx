import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import RSlider from 'react-slick';

import Slider from '..';

describe('Slider', () => {
  describe('without items', () => {
    it('component should return null', () => {
      const wrapper = mount(<Slider items={[]} />);
      expect(wrapper.find('div')).toHaveLength(0);
    });
  });

  describe('with items', () => {
    it('renders slider ', () => {
      const wrapper = mount(<Slider items={[<div key="1"></div>, <div key="2"></div>]} />);
      window.innerWidth = 2048;

      expect(wrapper.find(RSlider)).toHaveLength(1);
    });
  });
});
