import Dinero from 'dinero.js';

import { Auction } from '../dto/Auction';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionInput } from './model/AuctionInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { GraphqlResolver } from '../../../graphql/types';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionStatusResponse } from '../dto/AuctionStatusResponse';
import { loadRole } from '../../../graphql/middleware/loadRole';

interface AuctionResolversType {
  Query: {
    auctions: GraphqlResolver<
      { items: Auction[]; totalItems: number; size: number; skip: number },
      { size: number; skip: number; query?: string; filters?: AuctionSearchFilters; orderBy?: AuctionOrderBy }
    >;
    auctionPriceLimits: GraphqlResolver<{ min: Dinero.Dinero; max: Dinero.Dinero }>;
    sports: GraphqlResolver<string[]>;
    auction: GraphqlResolver<Auction, { id: string; organizerId?: string }>;
    getTotalRaisedAmount: GraphqlResolver<any>;
  };
  Mutation: {
    createAuction: GraphqlResolver<Auction, { input: AuctionInput }>;
    updateAuction: GraphqlResolver<Auction, { id: string; input: AuctionInput }>;
    deleteAuction: GraphqlResolver<Auction, { id: string }>;
    addAuctionAttachment: GraphqlResolver<AuctionAssets, { id: string; attachment: any; organizerId: string }>;
    removeAuctionAttachment: GraphqlResolver<AuctionAssets, { id: string; attachmentUrl: string }>;
    createAuctionBid: GraphqlResolver<Auction, { id: string } & ICreateAuctionBidInput>;
    finishAuctionCreation: GraphqlResolver<Auction, { id: string }>;
    buyAuction: GraphqlResolver<AuctionStatusResponse, { id: string }>;
  };
  InfluencerProfile: {
    auctions: GraphqlResolver<Auction[], Record<string, never>, InfluencerProfile>;
  };
}

export const AuctionResolvers: AuctionResolversType = {
  Query: {
    auctions: async (_, { size, skip, query, filters, orderBy }, { auction }) =>
      auction.listAuctions({ query, filters, orderBy, size, skip }),
    auctionPriceLimits: (_, __, { auction }) => auction.getAuctionPriceLimits(),
    sports: (_, __, { auction }) => auction.listSports(),
    auction: loadRole(async (_, { id, organizerId }, { auction, currentAccount, currentInfluencerId }) => {
      const foundAuction = await auction.getAuction(id, organizerId);
      const isOwner = foundAuction?.auctionOrganizer?.id === currentInfluencerId;
      if (foundAuction?.status === AuctionStatus.DRAFT && !isOwner && !currentAccount.isAdmin) {
        return null;
      }
      return foundAuction;
    }),
    getTotalRaisedAmount: async (_, { charityId, influencerId }, { auction }) =>
      await auction.getTotalRaisedAmount(charityId, influencerId),
  },
  Mutation: {
    createAuction: requireRole(async (_, { input }, { auction, currentAccount, currentInfluencerId }) => {
      if (!input.organizerId || currentAccount.isAdmin || currentInfluencerId === input.organizerId) {
        return auction.createAuctionDraft(input.organizerId || currentInfluencerId, input);
      } else {
        return null;
      }
    }),
    updateAuction: requireRole(async (_, { id, input }, { auction, currentAccount, currentInfluencerId }) => {
      if (!currentAccount.isAdmin) {
        delete input.fairMarketValue;
      }
      return auction.updateAuction(id, currentAccount.isAdmin ? null : currentInfluencerId, input);
    }),
    deleteAuction: async () => Promise.resolve(null),
    buyAuction: requireAuthenticated(async (_, { id }, { auction, currentAccount }) =>
      auction.buyAuction(id, currentAccount),
    ),
    addAuctionAttachment: requireRole(
      async (_, { id, attachment, organizerId }, { auction, currentAccount, currentInfluencerId }) =>
        auction.addAuctionAttachment(id, currentAccount.isAdmin ? organizerId : currentInfluencerId, attachment),
    ),
    removeAuctionAttachment: requireRole(
      async (_, { id, attachmentUrl }, { auction, currentAccount, currentInfluencerId }) =>
        auction.removeAuctionAttachment(id, currentAccount.isAdmin ? null : currentInfluencerId, attachmentUrl),
    ),
    createAuctionBid: requireAuthenticated(async (_, { id, bid }, { auction, currentAccount }) => {
      await auction.addAuctionBid(id, { bid, user: currentAccount });
      return auction.getAuction(id);
    }),
    finishAuctionCreation: requireRole(async (_, { id }, { auction, currentAccount, currentInfluencerId }) =>
      auction.maybeActivateAuction(id, currentAccount?.isAdmin ? null : currentInfluencerId),
    ),
  },
  InfluencerProfile: {
    auctions: loadRole(async (influencerProfile, _, { auction, currentAccount, currentInfluencerId }) => {
      const auctions = await auction.getInfluencersAuctions(currentInfluencerId);
      const isOwner = influencerProfile.id === currentInfluencerId;
      return auctions.filter((foundAuction) => foundAuction.status !== AuctionStatus.DRAFT || isOwner);
    }),
  },
};
