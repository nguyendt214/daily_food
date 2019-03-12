import { IMission } from './mission';

export interface IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  userName?: string;
  position?: string;
  missions?: Array<IMission>;
  ambassador?: string;
  lastSyncDate?: string;
}
