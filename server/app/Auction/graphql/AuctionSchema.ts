import { gql } from 'apollo-server-express';

export const AuctionSchema = gql`
  type AuctionAttachment {
    url: String!
    type: String!
  }

  enum AuctionStatus {
    DRAFT
    ACTIVE
    SETTLED
  }

  type AuctionStatusResponse {
    status: String!
  }

  type AuctionBid {
    id: String!
    bid: Money!
    createdAt: DateTime!
  }

  type Auction {
    id: String!
    title: String!
    description: String
    fullpageDescription: String
    playedIn: String
    status: AuctionStatus!
    attachments: [AuctionAttachment]
    bids: [AuctionBid]
    startPrice: Money!
    charity: Charity
    gameWorn: Boolean!
    autographed: Boolean!
    authenticityCertificate: Boolean!
    sport: String!
    maxBid: AuctionBid
    startDate: DateTime!
    initialPrice: Money!
    endDate: DateTime!
    auctionOrganizer: String!
  }

  input AuctionSearchFilters {
    sports: [String]
    minPrice: Int
    maxPrice: Int
  }

  enum AuctionOrderBy {
    CREATED_AT_DESC
    TIME_ASC
    TIME_DESC
    SPORT
    PRICE_ASC
    PRICE_DESC
  }

  type AuctionsPage {
    items: [Auction]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }

  type AuctionPriceLimits {
    max: Money!
    min: Money!
  }

  extend type Query {
    auctions(size: Int!, skip: Int!, query: String, filters: AuctionSearchFilters, orderBy: String): AuctionsPage!
    auctionPriceLimits: AuctionPriceLimits!
    auction(id: String!): Auction
    sports: [String]
  }

  input AuctionInput {
    title: String
    description: String
    fullpageDescription: String
    startDate: DateTime
    endDate: DateTime
    initialPrice: Money
    charity: String
    authenticityCertificate: Boolean
    gameWorn: Boolean
    autographed: Boolean
    playedIn: String
  }

  extend type Mutation {
    createAuction(input: AuctionInput!): Auction!
    updateAuction(id: String, input: AuctionInput): Auction!
    updateAuctionStatus(id: String!, status: AuctionStatus!): Auction!
    createAuctionBid(id: String!, bid: Money!): AuctionBid!
    addAuctionAttachment(id: String!, attachment: Upload!): Auction!
    removeAuctionAttachment(id: String!, attachmentUrl: String!): Auction!
    deleteAuction(id: String!): AuctionStatusResponse!
  }
`;
