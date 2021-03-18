import { UserAccountStatus } from './UserAccountStatus';

export interface UserAccount {
  id: string;
  phoneNumber?: string;
  status: UserAccountStatus;
  mongodbId?: string;
  isAdmin?: boolean;
}
