import { bids } from './bids';
import { bitly } from './bitly';

export const auction = {
  id: 'test',
  title: 'test',
  sport: 'test',
  gameWorn: true,
  autographed: true,
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
  fullPageDescription: 'test',
  currentPrice: { amount: 100, currency: 'USD', precision: 2 },
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
  itemPrice: { amount: 1000, currency: 'USD', precision: 2 },
  link: 'test',
  fairMarketValue: { amount: 100, currency: 'USD', precision: 2 },
  followers: [],
  timeZone: 'PDT',
  isActive: false,
  isDraft: false,
  isPending: false,
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
  id: '60cf0ade0092860f2c7a0bc1',
  isActive: false,
  isFailed: true,
  isSold: false,
  link: 'https://go.contrib.org/3qbU9JG',
  startDate: '2021-06-23T08:00:18.000Z',
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
  status: 'FAILED',
  timeZone: 'PDT',
  title: '1',
};
