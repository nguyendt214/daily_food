import { ISalesAgent } from './salesAgent';
import { ICity } from './city';
export interface IMission {
  id?: string;
  ambassador?: string;
  status?: string;
  startDateF?: string;
  endDateF?: string;
  towns?: string;
  townsF?: string;
  idMission?: string;
  salesAgent?: ISalesAgent;
  startDate?: string;
  endDate?: string;
  cities?: Array<ICity>;
  fiberStatuses?: Array<string>;
}
