import { useCallback, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { addDays, differenceInCalendarDays, parseISO } from 'date-fns';
import { toDate, format } from 'date-fns-tz';
import { Button, Container, ProgressBar } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { useHistory, useParams } from 'react-router-dom';

import { getAuctionDetails, updateAuctionDetails, updateAuctionStatusMutation } from 'src/apollo/queries/auctions';
import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';
import SelectField from 'src/components/Form/SelectField';
import FormUpdateMessages from 'src/components/FormUpdateMessages';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';
import { Charity } from 'src/types/Charity';

import Row from '../common/Row';
import StepHeader from '../common/StepHeader';
import { durationOptions } from './consts';
import StartDateField from './StartDateField';
import styles from './styles.module.scss';
import { serializeStartDate } from './utils';

const EditAuctionDetailsPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const [charities, setCharities] = useState<Charity[]>([]);
  const { loading: loadingQuery, data: auctionData } = useQuery(getAuctionDetails, {
    variables: { id: auctionId },
    onCompleted({ auction }) {
      if (auction.charity) {
        setCharities([auction.charity]);
      }
    },
  });
  const [updateAuctionStatus, { loading: updatingStatus }] = useMutation(updateAuctionStatusMutation, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/done`);
    },
  });

  const [updateAuction, { loading: updating, error: updateError }] = useMutation(updateAuctionDetails, {
    onCompleted() {
      updateAuctionStatus({ variables: { id: auctionId, status: 'ACTIVE' } });
    },
    onError(error) {},
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/media`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    (values) => {
      const { startDate, duration, ...rest } = values;

      const serializedStartDate = serializeStartDate(startDate);
      const endDate = addDays(toDate(parseISO(serializedStartDate)), duration).toISOString();

      const clearValues = { ...rest, startDate: serializedStartDate, endDate: endDate, charity: charities[0]?.id };

      updateAuction({ variables: { id: auctionId, ...clearValues } });
    },
    [auctionId, charities, updateAuction],
  );

  const handleCharityChange = useCallback(
    (charity: Charity, shouldBeFavorite: boolean) => {
      const index = charities.findIndex((c: Charity) => c.id === charity.id);
      const isFavorite = index >= 0;

      if (isFavorite && !shouldBeFavorite) {
        setCharities([...charities.slice(0, index), ...charities.slice(index + 1)]);
      } else if (!isFavorite && shouldBeFavorite) {
        setCharities([charity]);
      }
    },
    [charities, setCharities],
  );

  const selectedOption = useCallback(() => {
    const { startDate, endDate } = auctionData?.auction;
    const duration = differenceInCalendarDays(toDate(parseISO(endDate)), toDate(parseISO(startDate)));

    const selected = durationOptions.find(({ value }) => parseInt(value, 10) === duration);
    return selected;
  }, [auctionData?.auction]);

  if (loadingQuery) {
    return null;
  }

  const { startDate, endDate, ...rest } = auctionData?.auction;

  const currentDate = toDate(startDate);
  const time = format(currentDate, 'hh:mm');
  const dayPeriod = format(currentDate, 'aaa');
  const currentTimeZone = format(currentDate, 'x');
  const duration = differenceInCalendarDays(toDate(parseISO(endDate)), toDate(parseISO(startDate)));

  const initialValues = {
    ...rest,
    startDate: {
      date: currentDate,
      time: time,
      dayPeriod: dayPeriod,
      timeZone: currentTimeZone,
    },
    duration: duration,
  };

  return (
    <Layout>
      <ProgressBar now={75} />

      <section className={styles.section}>
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
          <FormUpdateMessages errorMessage={updateError?.message} />

          <Container>
            <StepHeader step="3" title="Details" />

            <Row
              description="The starting price for the item which determines the minimum amount that can be bid. The item will not sell if no bids at or above this price are received."
              title="Starting price"
            >
              <MoneyField name="initialPrice" />
            </Row>

            <Row description="The day and time your auction will start." title="Start date & time">
              <StartDateField name="startDate" />
            </Row>
            <Row description="How long the auction should run for." title="Duration">
              <SelectField
                name="duration"
                options={durationOptions}
                placeholder="Choose length of time"
                selected={selectedOption()}
              />
            </Row>
            <Row description="What charity will benefit from the proceeds of this auction." title="Charity">
              <CharitiesAutocomplete charities={charities} onChange={handleCharityChange} />
              <p className="text--body mb-sm-4">Don’t see a charity you’re looking for?</p>
              <Button className={styles.suggestButton} variant="secondary">
                Suggest a charity
              </Button>
            </Row>
          </Container>
          <Field name="charity">{({ input }) => <input type="hidden" {...input} />}</Field>
          <StepByStepRow last loading={updating || updatingStatus} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionDetailsPage;