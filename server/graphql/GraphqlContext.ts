import { Auth0User } from '../authz';
import { IAppServices } from '../app/AppServices';
import { IAppLoaders } from '../app/AppLoaders';
import { InfluencerProfile } from '../app/Influencer/dto/InfluencerProfile';
import { Assistant } from '../app/Assistant/dto/Assistant';
import { UserAccount } from '../app/UserAccount/dto/UserAccount';
import { Charity } from '../app/Charity/dto/Charity';

export interface GraphqlContext extends IAppServices {
  user: Auth0User;
  loaders: IAppLoaders;
  currentAccount?: UserAccount;
  currentInfluencer?: InfluencerProfile;
  currentCharity?: Charity;
  currentAssistant?: Assistant;
  currentInfluencerId?: string;
}
