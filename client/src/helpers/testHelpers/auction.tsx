import { bids } from './bids';
import { bitly } from './bitly';

export const AuctionQueryAuction = {
  attachments: [{ cloudflareUrl: null, thumbnail: null, type: 'IMAGE', uid: null, url: 'test' }],
  auctionOrganizer: {
    id: 'test',
    name: 'test',
    avatarUrl: 'test',
  },
  charity: {
    avatarUrl: 'test',
    id: 'test',
    name: 'My Active Charity Name',
    status: 'ACTIVE',
    websiteUrl: 'test',
  },
  delivery: {
    deliveryMethod: '03',
    identificationNumber: '1Z3W090X0399152336',
    status: 'ADDRESS_PROVIDED',
    timeInTransit: '2021-08-27',
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
  endDate: '2021-08-29T08:05:21.000Z',
  fairMarketValue: null,
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
  link: 'test',
  startDate: '2021-06-21T08:05:21.000Z',
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
  startDate: '2021-05-31T14:22:48.000+00:00',
  endDate: '2021-05-31T14:22:48.000+00:00',
  stoppedAt: '2021-05-31T14:22:48.000+00:00',
  status: 'ACTIVE',
  bids: bids,
  totalBids: 1,
  description: 'test',
  currentPrice: { amount: 100, currency: 'USD', precision: 2 },
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
  itemPrice: { amount: 1000, currency: 'USD', precision: 2 },
  link: 'test',
  fairMarketValue: { amount: 100, currency: 'USD', precision: 2 },
  followers: [],
  delivery: {
    parcel: { width: '12', length: '12', height: '12', weight: '2', units: 'imperial' },
  },
  isActive: false,
  isDraft: false,
  isSettled: false,
  isFailed: true,
  isSold: false,
  isStopped: false,
};

export const auctionForAdminPage = {
  auctionOrganizer: { id: '6089456271a69b3254201019', name: 'sf.admin/influencer' },
  bids: bids,
  bitly: bitly,
  charity: {
    id: '60c1f579ff49a51d6f2ee61b',
    name: 'My Active Charity Name',
    stripeAccountId: 'acct_1J0nltPSFS13RiaC',
  },
  currentPrice: { amount: 10000000199, currency: 'USD', precision: 2 },
  endDate: '2021-06-24T08:00:18.000Z',
  fairMarketValue: null,
  id: 'testId',
  isActive: false,
  isFailed: true,
  isSold: false,
  link: 'https://go.contrib.org/3qbU9JG',
  startDate: '2021-06-23T08:00:18.000Z',
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
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
    },
    parcel: { width: 12, length: 12, height: 12, weight: 2, units: 'imperial' },
  },
  winner: {
    address: {
      city: 'Phoenix',
      country: 'USA',
      name: 'Martin Iden ',
      state: 'AZ',
      street: 'Jefferson Street',
      zipCode: '85027',
    },
    mongodbId: 'testId',
  },
};
