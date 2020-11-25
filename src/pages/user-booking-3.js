import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button, Alert, Media, } from 'reactstrap'
import ProgressBar from 'components/ProgressBar'
import data from 'data/user-booking.json'
import BookingForm from 'components/BookingForm'
import BookingColumn from 'components/BookingColumn'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "User booking",
            bookingForm: true
        },
    }
}

const UserBooking3 = () => {
    return (
        <React.Fragment>
            <ProgressBar progress={75} />
            <section className="py-5">
                <Container>
                    <Row>
                        <Col lg="7">
                            <p className="subtitle text-primary">
                                {data.steps[2].subtitle}
                            </p>
                            <h1 className="h2 mb-5">
                                {data.steps[2].title}
                                <span className="text-muted float-right">
                                    Step 3
                                </span>
                            </h1>
                            <div className="text-block">
                                <Alert color="warning" className="text-sm mb-3">
                                    <Media className="align-items-center">
                                        <svg className="svg-icon svg-icon svg-icon-light w-2rem h-2rem mr-3 text-reset">
                                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#heart-1" />
                                        </svg>
                                        <Media
                                            dangerouslySetInnerHTML={{ __html: data.steps[0].badge }}
                                            body
                                        />

                                    </Media>
                                </Alert>
                            </div>
                            <BookingForm
                                data={data.steps[2].formBlocks}
                            />
                            <Row className="form-block flex-column flex-sm-row">
                                <Col className="text-center text-sm-left">
                                    <Link href="/user-booking-2" passHref>
                                        <Button
                                            color="link"
                                            className="text-muted"
                                        >
                                            <i className="fa-chevron-left fa mr-2" />
                                            Back
                                        </Button>
                                    </Link>
                                </Col>
                                <Col className="text-center text-sm-right">
                                    <Link href="/user-booking-4" passHref>
                                        <Button
                                            color="primary"
                                            className="px-3"
                                        >
                                            Next step<i className="fa-chevron-right fa ml-2" />
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="5" className="pl-xl-5">
                            <BookingColumn
                                from={data.from}
                                to={data.to}
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}

export default UserBooking3