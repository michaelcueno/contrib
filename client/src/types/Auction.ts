import { DineroObject } from 'dinero.js';

import { InfluencerProfile } from './InfluencerProfile';

export enum AuctionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
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
  bid: Dinero.Dinero;
  createdAt: Date;
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
  gameWorn: boolean;
  autographed: boolean;
  authenticityCertificate: boolean;
  sport: string;
  maxBid: AuctionBid;
  startDate: string;
  endDate: string;
  initialPrice: DineroObject;
  auctionOrganizer: InfluencerProfile;
}