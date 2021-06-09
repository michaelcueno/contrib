import { DineroObject } from 'dinero.js';

import { InfluencerProfile } from './InfluencerProfile';

export enum AuctionStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
  SOLD = 'SOLD',
}

export interface AuctionAttachment {
  id: string;
  uid: string;
  url: string;
  type: string;
  cloudflareUrl: string;
  thumbnail: string;
  originalFileName: string;
}

export interface AuctionBid {
  id: string;
  bid: DineroObject;
  createdAt: Date;
  paymentSource: string;
  charityId: string;
  user: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  fullPageDescription: string;
  playedIn: string;
  status: AuctionStatus;
  attachments: [AuctionAttachment];
  bids: [AuctionBid];
  link: string;
  gameWorn: boolean;
  autographed: boolean;
  authenticityCertificate: boolean;
  sport: string;
  totalBids: number;
  startDate: string;
  endDate: string;
  startPrice: DineroObject;
  itemPrice?: DineroObject;
  currentPrice: DineroObject;
  auctionOrganizer: InfluencerProfile;
  fairMarketValue: DineroObject;
  timeZone: string;
  isActive: boolean;
  isDraft: boolean;
  isPending: boolean;
  isSettled: boolean;
  isFailed: boolean;
  isSold: boolean;
}
