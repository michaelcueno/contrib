import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import AttachmentModal from 'src/components/modals/AttachmentModal';
import { attachments } from 'src/helpers/testHelpers/attachments';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

describe('Dialog', () => {
  it('component returns null', () => {
    const props: any = {
      closeModal: jest.fn(),
    };
    const wrapper = mount(
      <Router>
        <AttachmentModal {...props} />
      </Router>,
    );
    expect(wrapper.find('Modal')).toHaveLength(0);
  });

  it('component is defined', () => {
    const props: any = {
      attachment: attachments[0],
      closeModal: jest.fn(),
    };
    const wrapper = mount(
      <Router>
        <AttachmentModal {...props} />
      </Router>,
    );
    expect(wrapper.find('Modal')).toHaveLength(2);
  });
});
