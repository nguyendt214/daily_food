import { ISalesAgent } from './salesAgent';
import { ICity } from './city';
import * as moment from 'moment';
import * as _ from 'lodash';
export interface IMission {
  id?: string;
  ambassador?: string;
  status?: string;
  startDateF?: string;
  endDateF?: string;
  towns?: string;
  townsF?: string;
  idMission?: any;
  salesAgent?: ISalesAgent;
  startDate?: string;
  endDate?: string;
  cities?: Array<ICity>;
  fiberStatuses?: Array<string>;
  totalHousingNumber?: number;
}

export class Mission implements IMission {
  idMission;
  salesAgent: ISalesAgent;
  startDate;
  endDate;
  cities: Array<ICity>;
  fiberStatuses: Array<string>;

  private _id;
  private _ambassador = '';
  private _startDateF = '';
  private _endDateF = '';
  private _status = '';
  private _towns = '';
  private _townsF = '';

  set id(id) {
    this._id = id;
  }
  get id() {
    return this.idMission;
  }
  get ambassador() {
    return this.salesAgent.firstName + ' ' + this.salesAgent.lastName.toUpperCase();
  }
  get startDateF() {
    return moment(this.startDate).format('DD/MM/YYYY');
  }
  get endDateF() {
    return moment(this.endDate).format('DD/MM/YYYY');
  }
  get status() {
    return this.fiberStatuses.join(', ');
  }
  get towns() {
    this._towns = '';
    if (this.cities) {
      _.each(this.cities, (c: ICity, index) => {
        if (index <= 1) {
          this._towns += (index === 1) ? ((this.cities.length > 2) ? c.city + ' ...' : c.city) :
            ((this.cities.length === 1) ? c.city : c.city + ', ');
        }
      });
    }
    return this._towns;
  }
  get townsF() {
    return this.cities.map(o => o.city).join(', ');
  }

  /**
   * Get tooltip message for City
   * @return string
   */
  public getTooltipText(): string {
    if (this.towns.includes('...')) {
      return this.townsF;
    }
    return '';
  }
}
