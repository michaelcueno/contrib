import { DineroObject } from 'dinero.js';

import { Auction } from './Auction';
import { UserAccount } from './UserAccount';

export interface AuctionBid {
  id: string;
  bid: DineroObject;
  createdAt: string;
  charityId: string;
  user: UserAccount;
  auction?: Auction;
}
