import { useContext, useCallback, useEffect, useState, useRef, BaseSyntheticEvent } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import creditCardType from 'credit-card-type';
import { format } from 'date-fns';
import Dinero from 'dinero.js';
import { Row, Spinner, Col } from 'react-bootstrap';
import { useHistory, useParams, Link } from 'react-router-dom';

import { AuctionQuery, CalculateShippingCostQuery, ShippingRegistrationMutation } from 'src/apollo/queries/auctions';
import CVCInput from 'src/components/CVCInput';
import DeliveryCardInput from 'src/components/DeliveryCardInput';
import { DeliveryTextBlock } from 'src/components/DeliveryTextBlock';
import DialogActions from 'src/components/Dialog/DialogActions';
import Form from 'src/components/Form/Form';
import Select from 'src/components/Select';
import { SubmitButton } from 'src/components/SubmitButton/SubmitButton';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { UserDialogLayout } from 'src/components/UserDialogLayout';
import { expirationDate } from 'src/helpers/expirationDate';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { USAStates } from 'src/modules/delivery/DeliveryAddressPage/USAStates';
import { deliveryMethods, cardTypes } from 'src/modules/delivery/DeliveryPaymentPage/consts';
import { Modal } from 'src/modules/delivery/DeliveryPaymentPage/Modal';
import { AuctionDeliveryStatus } from 'src/types/Auction';

import { MutationProps } from './ModalMutationProps';
import styles from './styles.module.scss';

const minCardNumberLength = 9;
const maxCardNumberLength = 16;

export default function DeliveryPricePage() {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const { showWarning } = useShowNotification();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
  const [showDialog, setShowDialog] = useState(false);
  const [modalProps, setModalProps] = useState<MutationProps | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [selectedCardType, setCardType] = useState('');
  const [enteredMonth, setMonth] = useState('');
  const [enteredYear, setYear] = useState('');
  const [currentCVC, setCurrentCVC] = useState('');

  const selected = cardTypes.find((option) => option.value === selectedCardType);
  const selectedDeliveryMethod = useRef(deliveryMethods[0].value);

  const month = useRef<HTMLInputElement | null>(null);
  const year = useRef<HTMLInputElement | null>(null);
  const cvc = useRef<HTMLInputElement | null>(null);

  const initialDeliveryMethod = deliveryMethods[0].value;

  const creditCardInfo = creditCardType(cardNumber);

  const FoundType = cardTypes.find(
    ({ value, label }: { value: string; label: string }) => label === creditCardType(cardNumber)[0]?.niceType,
  );

  const isValidCardNumber = cardNumber.length < minCardNumberLength;
  const isValidYear = enteredYear.length < 2;
  const isValidMonth = enteredMonth.length < 2;
  const isValidCVC = currentCVC.length < (selected?.code?.size || 3);

  const [ExecuteAuctionData, { loading: executeAuctionLoading, data: auctionData }] = useLazyQuery(AuctionQuery, {
    fetchPolicy: 'network-only',
  });

  const [CalculateShippingCost, { loading: calculateShippingCostLoading, data: shippingCostData }] = useLazyQuery(
    CalculateShippingCostQuery,
    {
      fetchPolicy: 'cache-and-network',
    },
  );
  const handleCardTypeChange = (cardType: string) => {
    setCardType(cardType);
    setCurrentCVC('');
  };
  useEffect(() => {
    handleCardTypeChange(cardTypes[0].value);
    ExecuteAuctionData({ variables: { id: auctionId } });
    CalculateShippingCost({
      variables: {
        auctionId,
        deliveryMethod: initialDeliveryMethod,
      },
    });
  }, [ExecuteAuctionData, auctionId, initialDeliveryMethod, CalculateShippingCost]);

  const shippingCost = shippingCostData?.calculateShippingCost;

  const handleAccepting = useCallback(
    ({
      number,
      expirationDateMonth,
      expirationDateYear,
      securityCode,
      deliveryMethod,
    }: {
      number: string;
      expirationDateMonth: string;
      expirationDateYear: string;
      securityCode: string;
      deliveryMethod: string;
    }) => {
      if (!number || !expirationDateMonth || !expirationDateYear || !deliveryMethod) {
        showWarning('Please, check the data');
        return;
      }
      setShowDialog(true);
      setModalProps({
        auctionId,
        type: selected?.value || cardTypes[0].value,
        number,
        expirationDateMonth,
        expirationDateYear,
        securityCode: currentCVC || '',
        timeInTransit: shippingCost?.timeInTransit,
        deliveryMethod: selectedDeliveryMethod.current,
      });
    },
    [showWarning, auctionId, shippingCost?.timeInTransit, selected?.value, currentCVC],
  );

  if (!auctionData) {
    return null;
  }

  if (!account) {
    RedirectWithReturnAfterLogin(`/auctions/${auctionId}/delivery/payment`);
    return null;
  }

  const { auction } = auctionData;
  const isWinner = auction?.winner?.mongodbId === account?.mongodbId;

  if (!isWinner) {
    history.goBack();
    return null;
  }

  if (auction?.delivery?.status === AuctionDeliveryStatus.PAID) {
    history.push(`/auctions/${auctionId}/delivery/status`);
    return null;
  }

  if (
    auction?.delivery?.status !== AuctionDeliveryStatus.ADDRESS_PROVIDED &&
    auction?.delivery?.status !== AuctionDeliveryStatus.PAID
  ) {
    history.push(`/auctions/${auctionId}/delivery/address`);
    return null;
  }

  const { name, state, city, street, zipCode, phoneNumber } = auction.delivery.address;

  const handleDeliveryMethodChange = (deliveryMethod: string) => {
    selectedDeliveryMethod.current = deliveryMethod;
    CalculateShippingCost({
      variables: {
        auctionId,
        deliveryMethod: selectedDeliveryMethod.current,
      },
    });
  };

  const incomingState = USAStates.find((option) => option.value === state)?.label;
  const { title } = auction;

  if (!isWinner) {
    history.push(`/`);
    return null;
  }

  const textBlock = (
    <DeliveryTextBlock
      city={city}
      incomingState={incomingState}
      loading={executeAuctionLoading}
      name={name}
      phoneNumber={phoneNumber}
      state={state}
      street={street}
      subtitle="Your package will be delivered to:"
      zipCode={zipCode}
    >
      <p className="text-headline pt-2">
        Please choose the delivery method or
        {
          <Link to={`/auctions/${auctionId}/delivery/address`}>
            {<span className={styles.markedText}>go back</span>}
          </Link>
        }
        to edit the recipient or address.
      </p>
    </DeliveryTextBlock>
  );

  setPageTitle(`Delivery price for ${title} auction`);

  const disabled = calculateShippingCostLoading || executeAuctionLoading;
  const arrivalDate = new Date(shippingCost?.timeInTransit || null);

  const handleInputChange = (e: BaseSyntheticEvent) => {
    const { name, maxLength, value } = e.target;
    if (name === 'securityCode') {
      setCurrentCVC(value);
    }
    if (name === 'number') {
      setCurrentCVC('');

      if (FoundType && creditCardInfo.length === 1) {
        setCardType(FoundType.value);
      }

      setCardNumber(value);
      if (maxLength === value.length) {
        month.current?.focus();
      }
    }
    expirationDate(e, value, maxLength, name, year, cvc, setMonth, setYear);
  };

  return (
    <UserDialogLayout textBlock={textBlock} title="UPS Delivery">
      <Form
        initialValues={{
          auctionId: modalProps?.auctionId || '',
          securityCode: modalProps?.securityCode || '',
          timeInTransit: modalProps?.timeInTransit || '',
          number: modalProps?.number || '',
          expirationDateMonth: modalProps?.expirationDateMonth || '',
          expirationDateYear: modalProps?.expirationDateYear || '',
          deliveryMethod: deliveryMethods[0].value,
          type: modalProps?.type || cardTypes[0].value,
        }}
        onSubmit={handleAccepting}
      >
        <Row className="d-flex align-items-baseline">
          <span className="pt-1 pb-1 text-label">Delivery Method</span>
        </Row>
        <Row className="d-flex align-items-baseline w-100 mb-2">
          <div className="w-100">
            <Select
              className={styles.select}
              disabled={disabled}
              options={deliveryMethods}
              selected={deliveryMethods[0]}
              onChange={handleDeliveryMethodChange}
            />
          </div>
        </Row>
        {calculateShippingCostLoading ? (
          <Row className={clsx(styles.deliveryInfo, 'justify-content-center align-items-center w-100')}>
            <Spinner animation="border" size="sm" />
          </Row>
        ) : (
          <div className={styles.deliveryInfo}>
            <Row className="mb-2 justify-content-center w-100">
              <span className="pt-1 pb-1">
                {`Delivery price: ${Dinero(shippingCost?.deliveryPrice).toFormat('$0,0.00')}`}
              </span>
            </Row>
            <Row className="mb-2 justify-content-center w-100">
              <span className="pt-1 pb-1">{`Estimated arrival date: ${format(arrivalDate, 'MM/dd/yyyy')}`}</span>
            </Row>
          </div>
        )}
        <Row className="d-flex align-items-baseline w-100 mb-1">
          <Select
            className={styles.select}
            disabled={disabled}
            options={cardTypes}
            selected={selected || cardTypes[0]}
            onChange={handleCardTypeChange}
          />
        </Row>
        <Row className="d-flex align-items-baseline w-100">
          <DeliveryCardInput
            disabled={disabled}
            isInvalid={isValidCardNumber}
            labelText="Card Number"
            maxLength={maxCardNumberLength}
            name="number"
            type="string"
            onInput={handleInputChange}
          />
        </Row>
        <Row className="d-flex align-items-baseline w-100 ">
          <Col className="d-flex align-items-baseline pl-0">
            <DeliveryCardInput
              ref={month}
              disabled={disabled}
              isInvalid={isValidMonth}
              labelText="Month"
              maxLength={2}
              name="expirationDateMonth"
              placeholder="MM"
              type="string"
              onInput={handleInputChange}
            />
          </Col>
          <Col className="d-flex align-items-baseline">
            <DeliveryCardInput
              ref={year}
              disabled={disabled}
              isInvalid={isValidYear}
              labelText="Year"
              maxLength={2}
              name="expirationDateYear"
              placeholder="YY"
              type="string"
              onInput={handleInputChange}
            />
          </Col>
          <Col className="d-flex align-items-baseline pr-0">
            <span className="glyphicon glyphicon-print"></span>
            <CVCInput
              ref={cvc}
              required
              disabled={disabled}
              isInvalid={isValidCVC}
              labelText={selected?.code?.name || 'CVC'}
              maxLength={selected?.code?.size || 3}
              name="securityCode"
              type="password"
              value={currentCVC}
              onInput={handleInputChange}
            />
          </Col>
        </Row>
        <Row className="pt-sm-3 pt-0">
          <DialogActions className="justify-content-between flex-column-reverse flex-sm-row p-0 w-100">
            <div className={clsx(disabled ? styles.actionLinkWrapper : styles.actionLink)}>
              <Link
                className={clsx(disabled ? styles.actionLinkDisabled : styles.actionLink, 'ml-0 mr-sm-auto p-0')}
                to={`/auctions/${auctionId}/delivery/address`}
              >
                {disabled ? <Spinner animation="border" size="sm" /> : 'Back'}
              </Link>
            </div>
            <SubmitButton
              className={clsx(styles.submitBtn, 'p-0')}
              disabled={disabled || isValidCardNumber || isValidCVC || isValidYear || isValidMonth}
            >
              {disabled ? <Spinner animation="border" size="sm" /> : 'Submit'}
            </SubmitButton>
          </DialogActions>
        </Row>
      </Form>
      <Modal
        mutation={ShippingRegistrationMutation}
        mutationProps={modalProps}
        open={showDialog}
        shippingCost={shippingCost?.deliveryPrice}
        onClose={() => setShowDialog(false)}
      />
    </UserDialogLayout>
  );
}