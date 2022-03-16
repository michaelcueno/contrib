import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/logo-with-text-white.svg';

import styles from './styles.module.scss';

export default function Footer() {
  return (
    <footer className={clsx('d-print-none ps-0 p-4 ps-sm-4', styles.footer)}>
      <Container fluid="xxl">
        <Row>
          <Col md className="p-0">
            <Link to="/">
              <img alt="Contrib" className={styles.logo} src={Logo} />
            </Link>
          </Col>
        </Row>
        <Row className={clsx('py-4', styles.info)}>
          <Col className="p-0 text-headline">Auction your items quickly and hassle free.</Col>
        </Row>
        <Row>
          <Col md className="p-0 text-label text-all-cups">
            Copyright {new Date().getFullYear()} Contrib Inc.
          </Col>
        </Row>
        <Row>
          <Col md className="p-0">
            <div className="text-label text-all-cups">
              <Link className={clsx('privacy', styles.link)} to="/privacy-policy">
                Privacy
              </Link>
              &#160;and&#160;
              <Link className={clsx('privacy', styles.link)} to="/terms">
                Terms
              </Link>
              &#160;&gt;&gt;
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
