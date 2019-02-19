import { ISalesAgent } from './salesAgent';
import { ICity } from './city';
export interface IMission {
  idMission?: string;
  salesAgent?: ISalesAgent;
  startDate?: string;
  endDate?: string;
  cities?: Array<ICity>;
  fiberStatuses?: Array<string>;
}
