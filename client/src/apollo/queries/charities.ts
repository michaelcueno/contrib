import { gql } from '@apollo/client';

export const AllCharitiesQuery = gql`
  query GetCharities($size: Int!, $skip: Int!) {
    charities(size: $size, skip: $skip) {
      totalItems
      size
      skip
      items {
        id
        name
      }
    }
  }
`;

export const CharitiesSearch = gql`
  query charitiesSearch($query: String!) {
    charitiesSearch(query: $query) {
      id
      name
    }
  }
`;

export const UpdateMyFavoriteCharities = gql`
  mutation updateMyFavoriteCarities($charities: [String!]!) {
    updateMyInfluencerProfileFavoriteCharities(charities: $charities) {
      id
      name
    }
  }
`;

export const UpdateFavoriteCharities = gql`
  mutation updateFavoriteCarities($influencerId: String!, $charities: [String!]!) {
    updateInfluencerProfileFavoriteCharities(influencerId: $influencerId, charities: $charities) {
      id
      name
    }
  }
`;
