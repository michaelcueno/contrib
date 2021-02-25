import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Auction } from '../dto/Auction';
import { AuctionStatus } from '../dto/AuctionStatus';
import { ICreateAuctionInput } from './model/CreateAuctionInput';
import { IUpdateAuctionInput } from './model/UpdateAuctionInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requirePermission } from '../../../graphql/middleware/requirePermission';
import { UserPermission } from '../../../authz';

export const AuctionResolvers = {
  Query: {
    auctions: async (
      _: unknown,
      { size, skip }: { size: number; skip: number },
      { auction }: GraphqlContext,
    ): Promise<any> => {
      return auction.listAuctions(skip, size);
    },
    auction: async (_: unknown, { id }: { id: string }, { auction }: GraphqlContext): Promise<any> => {
      return auction.getAuction(id);
    },
  },
  Mutation: {
    createAuction: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        input: { input: ICreateAuctionInput },
        { auction, user, userAccount }: GraphqlContext,
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.createAuctionDraft(account.mongodbId, input.input);
      },
    ),
    updateAuction: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, input }: { id: string; input: IUpdateAuctionInput },
        { auction, user, userAccount }: GraphqlContext,
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.updateAuction(id, account.mongodbId, input);
      },
    ),
    deleteAuction: async (_: unknown, input: { id: string }): Promise<any> => {
      return Promise.resolve(null);
    },
    addAuctionAttachment: async (_: unknown, input: { id: string; attachment: any }): Promise<any> => {
      return Promise.resolve(null);
    },
    createAuctionBid: requireAuthenticated(
      async (parent: unknown, { id, bid }: { id: string } & ICreateAuctionBidInput, { user, auction, userAccount }) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.addAuctionBid(id, { bid, user: account });
      },
    ),
    updateAuctionStatus: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, status }: { id: string; status: AuctionStatus },
        { auction, user, userAccount }: GraphqlContext,
      ): Promise<Auction> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.updateAuctionStatus(id, account.mongodbId, status);
      },
    ),
  },
};