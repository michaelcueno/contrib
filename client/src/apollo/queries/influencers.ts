import { gql } from '@apollo/client';

export const AllInfluencersQuery = gql`
  query GetInfluencers($size: Int!, $skip: Int!) {
    influencers(size: $size, skip: $skip) {
      totalItems
      size
      skip
      items {
        id
        name
        sport
        status
      }
    }
  }
`;

export const InviteInfluencerMutation = gql`
  mutation InviteInfluencer($firstName: String!, $lastName: String!, $phoneNumber: String!, $welcomeMessage: String!) {
    inviteInfluencer(
      input: { firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, welcomeMessage: $welcomeMessage }
    ) {
      id
    }
  }
`;

export const GetInfluencerQuery = gql`
  query GetInfluencerById($id: String!) {
    influencer(id: $id) {
      avatarUrl
      id
      name
      profileDescription
      sport
      status
      team

      auctions {
        attachments {
          url
          id
        }
        endDate
        initialPrice
        startDate
        title
        totalBids
        maxBid {
          bid
        }
      }
    }
  }
`;
