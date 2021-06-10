import { gql } from 'apollo-server-express';

/**
 * @description holds user account schema
 */

export const UserAccountSchema = gql`
  """
  The supported user account statuses.
  """
  enum UserAccountStatus {
    """
    Account have verified phone number.
    """
    COMPLETED

    """
    Account provided with a phone but not confirmed.
    """
    PHONE_NUMBER_CONFIRMATION_REQUIRED

    """
    Account have no attached phone number.
    """
    PHONE_NUMBER_REQUIRED
  }

  type UserAccountForBid {
    id: String!
    createdAt: String!
    phoneNumber: String!
    stripeCustomerId: String!
  }

  type UserAccount {
    """
    ID is the user_id received from Auth0.
    """
    id: String!

    """
    Account verified phone number.
    """
    phoneNumber: String

    """
    Account onboarding status.
    """
    status: UserAccountStatus!

    """
    Admin users will have True here, others will have null.
    """
    isAdmin: Boolean

    """
    User creation datetime
    """
    createdAt: String!
    notAcceptedTerms: String
  }

  extend type Query {
    myAccount: UserAccount!
    getAccountById(id: String!): UserAccountForBid!
  }

  extend type Mutation {
    acceptAccountTerms(version: String!): UserAccount!
    createAccountWithPhoneNumber(phoneNumber: String): UserAccount!
    confirmAccountWithPhoneNumber(phoneNumber: String!, otp: String!): UserAccount!
  }
`;
