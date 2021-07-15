import { gql } from '@apollo/client';

export const AuctionBidsQuery = gql`
  query AuctionBids($auctionId: String!) {
    bids(auctionId: $auctionId) {
      user {
        id
        mongodbId
        phoneNumber
        stripeCustomerId
        createdAt
      }
      bid
      paymentSource
      createdAt
    }
  }
`;

export const ChargeCurrentBidMutation = gql`
  mutation ChargeCurrentBid(
    $charityId: String!
    $charityStripeAccountId: String!
    $auctionTitle: String!
    $bid: Money!
    $paymentSource: String!
    $user: AuctionInputUser!
  ) {
    chargeCurrendBid(
      input: {
        charityId: $charityId
        charityStripeAccountId: $charityStripeAccountId
        auctionTitle: $auctionTitle
        bid: $bid
        paymentSource: $paymentSource
        user: $user
      }
    ) {
      id
    }
  }
`;

export const MakeAuctionBidMutation = gql`
  mutation MakeAuctionBid($id: String!, $bid: Money!) {
    createAuctionBid(id: $id, bid: $bid) {
      id
      currentPrice
      totalBids
    }
  }
`;