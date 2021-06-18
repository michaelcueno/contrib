import { FC, useContext, useCallback, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';
import { ProfileSliderRow } from 'src/components/ProfileSliderRow';
import { TotalRaisedAmount } from 'src/components/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import WatchBtn from 'src/components/WatchBtn';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { AuctionStatus, Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { FollowInfluencer, UnfollowInfluencer } from '../../../apollo/queries/influencers';
import AdminDropdown from './AdminDropdown';
import styles from './InfluencerProfilePageContent.module.scss';

interface Props {
  influencer: InfluencerProfile;
  totalRaisedAmount: Dinero.DineroObject;
}

export const InfluencerProfilePageContent: FC<Props> = ({ influencer, totalRaisedAmount }) => {
  const { addToast } = useToasts();
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const [followed, setFollowed] = useState(() =>
    influencer?.followers?.some((follower) => follower.user === account?.mongodbId),
  );
  const [followersNumber, setFollowersNumber] = useState(() => influencer?.followers?.length);

  const { data } = useQuery(AuctionsListQuery, {
    variables: {
      filters: {
        auctionOrganizer: influencer.id,
        status: [
          AuctionStatus.DRAFT,
          AuctionStatus.ACTIVE,
          AuctionStatus.SETTLED,
          AuctionStatus.PENDING,
          AuctionStatus.STOPPED,
        ],
      },
    },
  });

  const [followInfluencer, { loading: followLoading }] = useMutation(FollowInfluencer);
  const [unfollowInfluencer, { loading: unfollowLoading }] = useMutation(UnfollowInfluencer);

  const handleFollowInfluencer = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await followInfluencer({ variables: { influencerId: influencer.id } });
        addToast('Successfully followed', { autoDismiss: true, appearance: 'success' });
        setFollowed(true);
        setFollowersNumber(followersNumber + 1);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'warning' });
      }
      return;
    }

    const followPath = `/profiles/${influencer.id}`;
    const redirectUri = mergeUrlPath(
      process.env.REACT_APP_PLATFORM_URL,
      `/after-login?returnUrl=${encodeURIComponent(followPath)}`,
    );
    loginWithRedirect({ redirectUri }).catch((error) => {
      addToast(error.message, { appearance: 'error', autoDismiss: true });
    });
  }, [influencer.id, addToast, followInfluencer, followersNumber, isAuthenticated, loginWithRedirect]);

  const handleUnfollowInfluencer = useCallback(async () => {
    try {
      await unfollowInfluencer({ variables: { influencerId: influencer.id } });
      addToast('Successfully unfollowed', { autoDismiss: true, appearance: 'success' });
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'warning' });
    }
  }, [influencer.id, addToast, unfollowInfluencer, followersNumber]);

  const auctions = data?.auctions?.items;

  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pendingAuctions = profileAuctions.PENDING;
  const pastAuctions = profileAuctions.SETTLED;
  const draftAuctions = profileAuctions.DRAFT;
  const stoppedAuctions = profileAuctions.STOPPED;

  const profileDescriptionParagraphs = (influencer.profileDescription ?? '').split('\n');

  const hasLiveAuctions = Boolean(liveAuctions.length);
  const hasPendingAuctions = Boolean(pendingAuctions.length);
  const hasPastAuctions = Boolean(pastAuctions.length);
  const hasDraftAuctions = Boolean(draftAuctions.length);
  const hasStoppedAuctions = Boolean(stoppedAuctions.length);

  const hasAuctions = hasLiveAuctions || hasPastAuctions || hasDraftAuctions;
  const isMyProfile = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(influencer.id);

  const liveAuctionsLayout = liveAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const pendingAuctionsLayout = pendingAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const draftAuctionsLayout = draftAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const stoppedAuctionsLayout = stoppedAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const pastAuctionsLayout = pastAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));

  return (
    <Layout>
      <section className={styles.root}>
        <Container className="p-0">
          <Row>
            <Col className="p-0">
              {isMyProfile && (
                <Link className={clsx(styles.editBtn, 'text-label btn btn-secondary')} to={'/profiles/me/edit'}>
                  Edit
                </Link>
              )}
              {account?.isAdmin && (
                <AdminDropdown>
                  <Link
                    className={clsx(styles.dropdownItem, 'dropdown-item text-label float-right')}
                    to={`/assistants/${influencer.id}`}
                  >
                    Assistants
                  </Link>
                  <Link
                    className={clsx(styles.dropdownItem, 'dropdown-item text-label float-right')}
                    to={`/auctions/${influencer.id}/new/basic`}
                  >
                    Create Auction
                  </Link>
                  <Link
                    className={clsx(styles.dropdownItem, 'dropdown-item text-label float-right')}
                    to={`/profiles/${influencer.id}/edit`}
                  >
                    Edit
                  </Link>
                </AdminDropdown>
              )}
            </Col>
          </Row>
        </Container>
        <div className={styles.header}>
          <Image roundedCircle className={styles.avatar} src={ResizedImageUrl(influencer.avatarUrl, 194)} />
        </div>

        <Container className={styles.content}>
          <Row>
            <Col md="6">
              <p className="text-headline break-word">{influencer.name}</p>
              <TotalRaisedAmount value={totalRaisedAmount} />
              {/*<div className="d-flex">
                <a
                  className={clsx(styles.socialIcon, 'mr-3')}
                  href="/"
                  rel="noreferrer noopener"
                  target="_blank"
                  title="twitter"
                >
                  <TwitterIcon />
                </a>
                <a className={styles.socialIcon} href="/" rel="noreferrer noopener" target="_blank" title="instagram">
                  <InstagramIcon />
                </a>
              </div>*/}
            </Col>
            <Col md="6">
              <span className="label-with-separator text-label">Player profile</span>
              {profileDescriptionParagraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text--body mb-4 mt-4 break-word">
                  {paragraph}
                </p>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <WatchBtn
                disabled={isMyProfile}
                entityType="influencer"
                followHandler={handleFollowInfluencer}
                followed={followed}
                followersNumber={followersNumber}
                loading={followLoading || unfollowLoading}
                unfollowHandler={handleUnfollowInfluencer}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {hasAuctions && (
        <section className={styles.sliders}>
          <Container>
            {hasLiveAuctions && (
              <ProfileSliderRow items={liveAuctionsLayout}>{influencer.name}'s live auctions</ProfileSliderRow>
            )}
            {hasPendingAuctions && (
              <ProfileSliderRow items={pendingAuctionsLayout}>
                {influencer.name}'s outboarding auctions
              </ProfileSliderRow>
            )}
            {(account?.isAdmin || isMyProfile) && (
              <>
                {hasDraftAuctions && (
                  <ProfileSliderRow items={draftAuctionsLayout}>{influencer.name}'s draft auctions</ProfileSliderRow>
                )}
                {hasStoppedAuctions && (
                  <ProfileSliderRow items={stoppedAuctionsLayout}>
                    {influencer.name}'s stopped auctions
                  </ProfileSliderRow>
                )}
              </>
            )}

            {hasPastAuctions && (
              <ProfileSliderRow items={pastAuctionsLayout}>{influencer.name}'s past auctions</ProfileSliderRow>
            )}
          </Container>
        </section>
      )}
    </Layout>
  );
};
