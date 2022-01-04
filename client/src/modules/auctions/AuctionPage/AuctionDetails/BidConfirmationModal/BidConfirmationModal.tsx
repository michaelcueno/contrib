import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';

import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import clsx from 'clsx';
import { isPast } from 'date-fns';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { BuyAuctionMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { MakeAuctionBidMutation } from 'src/apollo/queries/bids';
import AsyncButton from 'src/components/buttons/AsyncButton';
import { CardInput } from 'src/components/forms/inputs/CardInput';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Dialog from 'src/components/modals/Dialog';
import DialogActions from 'src/components/modals/Dialog/DialogActions';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './BidConfirmationModal.module.scss';

export interface BidConfirmationRef {
  placeBid: (amount: Dinero.Dinero) => void;
}

interface Props {
  auctionId: string;
  isBuying: boolean;
  setIsBuying: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

export const BidConfirmationModal = forwardRef<BidConfirmationRef, Props>(
  ({ auctionId, isBuying, setIsBuying }, ref) => {
    const [buyAuction] = useMutation(BuyAuctionMutation);
    const stripe = useStripe();
    const elements = useElements();
    const { showMessage, showError } = useShowNotification();

    const [cardComplete, setCardComplete] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [activeBid, setActiveBid] = useState<Dinero.Dinero | null>(null);
    const [newCard, setNewCard] = useState(false);
    const { account } = useContext(UserAccountContext);

    const [makeBid] = useMutation(MakeAuctionBidMutation);
    const [registerPaymentMethod] = useMutation(RegisterPaymentMethodMutation, {
      refetchQueries: [{ query: MyAccountQuery }],
    });

    const paymentInformation = account?.paymentInformation;

    const expired = isPast(new Date(paymentInformation?.cardExpirationYear!, paymentInformation?.cardExpirationMonth!));

    const hasPaymentMethod = Boolean(paymentInformation);
    const title = hasPaymentMethod ? 'Confirm bid' : 'Payment information';
    const buyingTitle = 'Confirm buying';

    const handleClose = useCallback(() => {
      setActiveBid(null);
      setNewCard(false);
      setIsBuying(false);
    }, [setIsBuying]);

    const handleAddCard = useCallback(() => {
      setNewCard(true);
    }, []);

    const handleCardInputChange = useCallback((event: StripeCardElementChangeEvent) => {
      setCardComplete(event.complete);
    }, []);

    const handleNewCardCancelBtnClick = useCallback(() => {
      setNewCard(false);
    }, [setNewCard]);

    const handleRegisterPayment = useCallback(
      async (paymentInformation, newCard) => {
        if (!paymentInformation || newCard) {
          const tokenResult = await stripe?.createToken(elements!.getElement(CardElement) as StripeCardElement);
          if (tokenResult?.error) {
            setSubmitting(false);
            showError(tokenResult.error.message);
            return;
          }
          const token = tokenResult?.token ?? { id: '' };

          await registerPaymentMethod({ variables: { token: token.id } });
        }
      },
      [elements, registerPaymentMethod, showError, stripe],
    );

    const handleBiding = useCallback(async () => {
      if (!elements || process.title === 'browser' ? !activeBid : false) {
        return;
      }

      setSubmitting(true);

      try {
        await handleRegisterPayment(paymentInformation, newCard);

        await makeBid({ variables: { id: auctionId, bid: activeBid?.toObject() } });

        setSubmitting(false);
        setActiveBid(null);
        setNewCard(false);
        showMessage(`Your bid of ${activeBid!.toFormat('$0,0')} was accepted.`);
      } catch (error: any) {
        setSubmitting(false);
        setNewCard(false);
        showError(error.message);
      }
    }, [
      elements,
      activeBid,
      paymentInformation,
      newCard,
      makeBid,
      auctionId,
      showMessage,
      showError,
      handleRegisterPayment,
    ]);

    const handleBuying = useCallback(async () => {
      setSubmitting(true);
      try {
        await handleRegisterPayment(paymentInformation, newCard);

        await buyAuction({ variables: { id: auctionId } });
        showMessage(`Thank you for your purchase!`);
        handleClose();
      } catch (error: any) {
        setSubmitting(false);
        setNewCard(false);
        showError(error.message);
      }
    }, [
      auctionId,
      buyAuction,
      showError,
      showMessage,
      handleRegisterPayment,
      handleClose,
      paymentInformation,
      newCard,
    ]);

    useImperativeHandle(ref, () => ({
      placeBid: (amount: Dinero.Dinero) => {
        setActiveBid(amount);
      },
    }));

    useEffect(() => setNewCard(false), []);
    const buttonsAreDisabled = isSubmitting || expired || ((newCard || !paymentInformation) && !cardComplete);

    return (
      <Dialog
        backdrop="static"
        keyboard={false}
        open={process.title === 'browser' ? Boolean(activeBid) : true}
        title={isBuying ? buyingTitle : title}
        onClose={handleClose}
      >
        <DialogContent>
          <div className={clsx(styles.cardInputWrapper, 'text--body')}>
            {isBuying || (
              <p>
                We need your card number in order to place your bid. Card will be charged only after auction end, in
                case your bid is winning.
              </p>
            )}
            <p>Please make sure this card has enough available funds at time of auction finalization.</p>
            <CardInput
              expired={expired}
              handleAddCard={handleAddCard}
              isSubmitting={isSubmitting}
              newCard={newCard}
              paymentInformation={paymentInformation}
              onCancel={handleNewCardCancelBtnClick}
              onChange={handleCardInputChange}
            />
            <p className="text-center pt-0 pt-sm-3 mb-0">
              {isBuying ? 'Price is' : 'Your bid is'}
              <span className="pl-1 font-weight-bold">{activeBid?.toFormat('$0,0')}</span>
            </p>
          </div>
        </DialogContent>

        <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-0 pt-sm-2">
          <Button
            className={clsx(styles.actionBtn, 'ml-0 mr-sm-auto p-3')}
            disabled={buttonsAreDisabled}
            size="sm"
            variant="light"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <AsyncButton
            className={styles.actionBtn}
            data-test-id="bid-button"
            disabled={buttonsAreDisabled}
            loading={isSubmitting}
            variant="secondary"
            onClick={isBuying ? handleBuying : handleBiding}
          >
            {isBuying ? 'Buy it now' : 'Confirm bidding'}
          </AsyncButton>
        </DialogActions>
      </Dialog>
    );
  },
);

BidConfirmationModal.displayName = 'PaymentConfirmationModal';
