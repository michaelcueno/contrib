import React from 'react';

import clsx from 'clsx';
import { Container, Row, Col, Button } from 'react-bootstrap';

import styles from './styles.module.scss';

export default function AboutUs() {
  return (
    <section className={styles.aboutUs}>
      <Container className={styles.homepageContainer}>
        <Row>
          <Col className="text-label label-with-separator">Who we are</Col>
        </Row>
        <Row>
          <Col className="text-headline">
            Contrib is a digital fundraising platform that empowers athletes to engage with their fans, raise money for
            important charities, and make direct and meaningful impact in their communities.
          </Col>
        </Row>
        <Row>
          <Col className="pt-3">
            <Button className={clsx('btn-with-arrows text-label', styles.button)} variant="secondary">
              How does it work?
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
