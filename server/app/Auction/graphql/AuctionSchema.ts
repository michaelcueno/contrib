import { gql } from 'apollo-server-express';

export const AuctionSchema = gql`
  enum AuctionStatus {
    DRAFT
    ACTIVE
    SETTLED
    FAILED
    SOLD
    STOPPED
    PENDING
  }

  enum AuctionDeliveryStatus {
    ADDRESS_PROVIDED
    DELIVERY_PAID
    DELIVERY_PAYMENT_FAILED
    PAID
  }

  enum AuctionOrderBy {
    CREATED_AT_DESC
    TIME_ASC
    TIME_DESC
    PRICE_ASC
    PRICE_DESC
  }

  type AuctionAttachment {
    id: String!
    type: String!
    url: String
    uid: String
    cloudflareUrl: String
    thumbnail: String
    originalFileName: String
  }

  type TotalRaisedAmount {
    totalRaisedAmount: Money!
  }

  type AuctionDelivery {
    deliveryMethod: String
    shippingLabel: String
    parcel: Parcel
    address: Address
    status: AuctionDeliveryStatus
    updatedAt: DateTime
    timeInTransit: DateTime
    identificationNumber: String
  }

  type Auction {
    id: String!
    title: String!
    description: String
    status: AuctionStatus!
    attachments: [AuctionAttachment]
    startPrice: Money
    itemPrice: Money
    currentPrice: Money
    charity: Charity
    startDate: DateTime
    endDate: DateTime
    stoppedAt: DateTime
    auctionOrganizer: InfluencerProfile
    totalBids: Int
    bitlyLink: String
    shortLink: Link
    fairMarketValue: Money
    followers: [Follow]
    delivery: AuctionDelivery
    winner: Winner
    isActive: Boolean!
    isDraft: Boolean!
    isSettled: Boolean!
    isFailed: Boolean!
    isSold: Boolean!
    isStopped: Boolean!
  }

  type AuctionForAdminPage {
    id: String!
    title: String!
    status: AuctionStatus
    startDate: DateTime!
    endDate: DateTime!
    charity: AuctionCharity
    bids: [AuctionBid]
    currentPrice: Money!
    startPrice: Money!
    fairMarketValue: Money
    auctionOrganizer: AuctionAdminOrganizer
    delivery: AuctionDelivery
    winner: Winner
    isFailed: Boolean!
    isSold: Boolean!
    isActive: Boolean!
    link: String!
  }

  type Winner {
    mongodbId: String
    address: Address
    phoneNumber: String
  }

  type Address {
    name: String
    state: String
    city: String
    zipCode: String
    country: String
    street: String
    phoneNumber: String
  }

  type Metrics {
    clicks: [Clicks]
    clicksByDay: [Clicks]
    referrers: [MetricEntity]
    countries: [MetricEntity]
    browsers: [MetricEntity]
    oss: [MetricEntity]
  }

  type Clicks {
    date: String
    clicks: String
  }

  type MetricEntity {
    value: String
    clicks: String
  }

  type AuctionAdminOrganizer {
    id: String!
    name: String!
  }

  type AuctionCharity {
    id: String!
    name: String!
    stripeAccountId: String!
  }

  type ResponceId {
    id: String
  }

  type AuctionsPage {
    items: [Auction]!
    totalItems: Int!
    size: Int
    skip: Int
  }

  type AuctionPriceLimits {
    max: Money!
    min: Money!
  }

  type CustomerInformation {
    email: String
    phone: String
  }

  type Parcel {
    width: Int
    length: Int
    height: Int
    weight: Int
  }

  type DeliveryRate {
    deliveryPrice: Money
    timeInTransit: DateTime
  }

  type ShippingRegistration {
    deliveryPrice: Money
    identificationNumber: String
  }

  type ContentStorageAuthData {
    authToken: String
    accountId: String
  }

  type AuctionsForProfilePage {
    live: [Auction]
    won: [Auction]
  }

  input AuctionSearchFilters {
    minPrice: Int
    maxPrice: Int
    status: [String]
    auctionOrganizer: String
    charity: [String]
    selectedAuction: String
  }

  input AuctionInput {
    organizerId: String
    title: String
    description: String
    startDate: DateTime
    endDate: DateTime
    startPrice: Money
    charity: String
    fairMarketValue: Money
    itemPrice: Money
    duration: Int
  }

  input CurrentAuctionBid {
    charityId: String
    charityStripeAccountId: String!
    auctionTitle: String
    bid: Money
    user: AuctionInputUser
  }

  input AuctionInputUser {
    id: String!
    mongodbId: String!
    phoneNumber: String!
    status: UserAccountStatus
    stripeCustomerId: String!
    createdAt: String!
  }

  input ParcelInput {
    width: String!
    length: String!
    height: String!
    weight: String!
  }

  input ShippingRegistrationInput {
    auctionId: String!
    deliveryMethod: String
    timeInTransit: DateTime
    auctionWinnerId: String
  }

  input MetricsInput {
    referrer: String
    country: String
    userAgentData: String
  }

  extend type Query {
    auctions(
      size: Int
      skip: Int
      query: String
      filters: AuctionSearchFilters
      orderBy: String
      statusFilter: [String]
    ): AuctionsPage!
    getAuctionsForProfilePage: AuctionsForProfilePage
    auctionPriceLimits(query: String, filters: AuctionSearchFilters, statusFilter: [String]): AuctionPriceLimits!
    auction(id: String!): Auction
    getCustomerInformation(stripeCustomerId: String!): CustomerInformation
    getAuctionMetrics(auctionId: String!): Metrics!
    calculateShippingCost(auctionId: String!, deliveryMethod: String!): DeliveryRate
    getContentStorageAuthData: ContentStorageAuthData
  }

  extend type Mutation {
    updateOrCreateMetrics(shortLinkId: String, input: MetricsInput): ResponceId
    createAuction(input: AuctionInput!): Auction!
    updateAuction(id: String, input: AuctionInput): Auction!
    finishAuctionCreation(id: String!): Auction!
    buyAuction(id: String): Auction
    stopAuction(id: String): Auction
    activateAuction(id: String): Auction
    createAuctionBid(id: String!, bid: Money!): Auction!
    addAuctionAttachment(id: String!, attachment: Upload, uid: String, filename: String): AuctionAttachment!
    deleteAuctionAttachment(auctionId: String!, attachmentId: String!): AuctionAttachment!
    deleteAuction(id: String!): ResponceId!
    chargeAuction(id: String!): ResponceId!
    chargeCurrendBid(input: CurrentAuctionBid!): ResponceId!
    followAuction(auctionId: String!): Follow
    unfollowAuction(auctionId: String!): ResponceId
    updateAuctionParcel(auctionId: String!, input: ParcelInput!): Parcel!
    shippingRegistration(input: ShippingRegistrationInput): ShippingRegistration
  }

  extend type Subscription {
    auction: Auction
  }

  extend type InfluencerProfile {
    auctions: [Auction!]
  }
`;
