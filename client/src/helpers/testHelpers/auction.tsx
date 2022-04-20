import { bids } from './bids';

const date = new Date();
const endsAt = date.setDate(date.getDate() + 2);

export const AuctionQueryAuction = {
  attachments: [
    { cloudflareUrl: null, thumbnail: null, type: 'IMAGE', uid: null, url: 'test' },
    { cloudflareUrl: 'cloudflare/url', thumbnail: null, type: 'VIDEO', uid: 'uid', url: null },
  ],
  auctionOrganizer: {
    id: 'test',
    name: 'test',
    avatarUrl: 'test',
  },
  charity: {
    avatarUrl: 'test',
    id: 'test',
    semanticId: 'test',
    name: 'My Active Charity Name',
    status: 'ACTIVE',
    websiteUrl: 'test',
  },
  delivery: {
    deliveryMethod: '03',
    identificationNumber: '1Z3W090X0399152336',
    status: 'ADDRESS_PROVIDED',
    timeInTransit: '2021-08-27',
    shippingLabel: 'test',
    address: {
      city: 'Phoenix',
      country: 'USA',
      name: 'test',
      state: 'AZ',
      street: 'test',
      zipCode: '85027',
      phoneNumber: '+1',
    },
  },
  currentPrice: { amount: 112200, currency: 'USD', precision: 2 },
  endsAt,
  fairMarketValue: null,
  items: [],
  bidStep: { amount: 100, currency: 'USD', precision: 2 },
  followers: [{ createdAt: '2021-06-28T12:52:49.463Z', user: '60d9ac0f650c813a783906b0' }],
  description: 'test',
  id: 'testId',
  isActive: false,
  isDraft: false,
  isFailed: false,
  isSettled: false,
  isSold: false,
  isStopped: true,
  itemPrice: { amount: 10000, currency: 'USD', precision: 2 },
  bitlyLink: 'testBitlyLink',
  password: null,
  shortLink: {
    slug: 'testSlug',
    shortLink: 'shortLink',
  },
  startsAt: '2021-06-21T08:05:21.000Z',
  startPrice: { amount: 33300, currency: 'USD', precision: 2 },
  status: 'ACTIVE',
  stoppedAt: null,
  title: 'test',
  totalBids: 0,
  winner: {
    mongodbId: 'testId',
    address: {
      city: 'Phoenix',
      country: 'USA',
      name: 'test',
      state: 'AZ',
      street: 'test',
      zipCode: '85027',
      phoneNumber: '+12054319282',
    },
    phoneNumber: '+1',
  },
};

export const auction = {
  id: 'testId',
  title: 'test',
  attachments: [{ thumbnail: 'test', type: 'IMAGE', url: 'test', className: 'test' }],
  auctionOrganizer: { avatarUrl: 'test', id: 'test', name: 'test' },
  charity: {
    id: 'test',
    name: 'test',
    semanticId: 'test',
    status: 'test',
    profileStatus: 'test',
    stripeStatus: 'test',
    userAccount: 'test',
    stripeAccountId: 'test',
    avatarUrl: 'test',
    profileDescription: 'test',
    website: 'test',
    websiteUrl: 'test',
    followers: [],
  },
  bitlyLink: 'testBitlyLink',
  password: null,
  shortLink: {
    slug: 'testSlug',
  },
  startsAt: '2021-05-31T14:22:48.000+00:00',
  endsAt: '2021-05-31T14:22:48.000+00:00',
  stoppedAt: '2021-05-31T14:22:48.000+00:00',
  status: 'ACTIVE',
  bids: bids,
  totalBids: 1,
  description: 'test',
  currentPrice: { amount: 100, currency: 'USD', precision: 2 },
  bidStep: { amount: 100, currency: 'USD', precision: 2 },
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
  itemPrice: { amount: 1000, currency: 'USD', precision: 2 },
  fairMarketValue: { amount: 100, currency: 'USD', precision: 2 },
  followers: [],
  delivery: {
    parcel: { width: '12', length: '12', height: '12', weight: '2' },
  },
  isActive: false,
  isDraft: false,
  isSettled: false,
  isFailed: true,
  isSold: false,
  isStopped: false,
};

export const auctionForCreation = {
  id: 'testId',
  endsAt: '2021-07-01T22:28:00.270Z',
  itemPrice: { amount: 10000, currency: 'USD', precision: 2 },
  title: '1',
  link: 'test',
  description: 'test',
  status: 'ACTIVE',
  isActive: true,
  bidStep: { amount: 10, currency: 'USD', precision: 2 },
  startPrice: { amount: 10, currency: 'USD', precision: 2 },
  fairMarketValue: { amount: 10, currency: 'USD', precision: 2 },
  items: [],
  startsAt: '2021-07-01T22:28:00.261Z',
  charity: { id: 'testId', name: 'test' },
  auctionOrganizer: { id: 'testId', favoriteCharities: [] },
  attachments: [{ type: 'VIDEO' }],
  password: null,
};

export const auctionForAdminPage = {
  auctionOrganizer: { id: '6089456271a69b3254201019', name: 'sf.admin/influencer' },
  bids,
  charity: {
    id: '60c1f579ff49a51d6f2ee61b',
    name: 'My Active Charity Name',
    semanticId: null,
    stripeAccountId: 'acct_1J0nltPSFS13RiaC',
  },
  currentPrice: { amount: 10000000199, currency: 'USD', precision: 2 },
  endsAt: '2021-06-24T08:00:18.000Z',
  fairMarketValue: null,
  items: [],
  id: 'testId',
  isActive: false,
  isFailed: true,
  isSold: false,
  isSettled: false,
  bitlyLink: 'https://go.contrib.org/3qbU9JG',
  password: '',
  shortLink: {
    slug: 'testSlug',
  },
  startsAt: '2021-06-23T08:00:18.000Z',
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
  bidStep: { amount: 100, currency: 'USD', precision: 2 },
  status: 'FAILED',
  title: '1',
  delivery: {
    shippingLabel: '222',
    identificationNumber: null,
    status: 'DELIVERY_PAID',
    timeInTransit: null,
    updatedAt: '2021-08-24T18:12:00.639Z',
    address: {
      city: 'Phoenix',
      country: 'USA',
      name: 'Martin Iden ',
      state: 'AZ',
      street: 'Jefferson Street',
      zipCode: '85027',
      phoneNumber: '+12054319282',
    },
    parcel: { width: 12, length: 12, height: 12, weight: 2 },
  },
  winner: {
    address: {
      city: 'Phoenix',
      country: 'USA',
      name: 'Martin Iden ',
      state: 'AZ',
      street: 'Jefferson Street',
      zipCode: '85027',
      phoneNumber: '+12054319282',
    },
    mongodbId: 'testId',
  },
};
