import { useCallback, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import InputField from 'src/components/forms/inputs/InputField';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './styles.module.scss';
import Row from '../common/Row';

const EditAuctionDescriptionPage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError } = useShowNotification();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;

  const { isActive } = auction || {};
  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    /* istanbul ignore next */
    onCompleted() {
      if (isActive) {
        history.goBack();
      } else {
        history.push(`/auctions/${auctionId}/attachments`);
      }
    },
  });
  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/title`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await updateAuction({ variables: { id: auctionId, input: values } });
        if (isActive) showMessage('Updated');
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, updateAuction, showMessage, showError, isActive],
  );

  if (!account?.isAdmin && isActive) {
    history.push(`/`);
    return null;
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined) return null;

  const textBlock =
    'This is the short one or two sentence description that will be used to describe the item. It will appear on the Contrib auction page along side the bidding box etc.';

  setPageTitle(`Edit Auction ${auction.title} | Description`);
  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ description: auction.description }}
      isActive={isActive}
      loading={updating || loadingQuery}
      prevAction={handlePrevAction}
      step={2}
      title={isActive ? 'Edit Description' : 'Description'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>
        {!loadingQuery && (
          <InputField
            required
            textarea
            className={styles.description}
            name="description"
            placeholder="Enter full description"
          />
        )}
      </Row>
    </StepByStepPageLayout>
  );
};

export default EditAuctionDescriptionPage;
