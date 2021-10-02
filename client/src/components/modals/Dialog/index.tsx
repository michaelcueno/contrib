import React, { FC, SyntheticEvent } from 'react';

import { Modal, ModalProps } from 'react-bootstrap';

const { Header, Title } = Modal;

interface Props extends ModalProps {
  open: boolean;
  onClose(event: SyntheticEvent): void;
  title?: string;
  size?: 'sm' | 'lg' | 'xl';
  withCloseButton?: boolean;
}

const Dialog: FC<Props> = ({ open, onClose, title, children, size, withCloseButton, ...rest }) => {
  return (
    <Modal centered aria-labelledby="contained-modal" show={open} size={size} onHide={onClose} {...rest}>
      {title && (
        <Header closeButton={withCloseButton ?? true}>
          <Title id="contained-modal">{title}</Title>
        </Header>
      )}
      {children}
    </Modal>
  );
};

export default Dialog;