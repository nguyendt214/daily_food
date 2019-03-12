import { IEncounter } from './encounter';
import { count } from 'rxjs/operators';
import * as moment from 'moment';
import { QUALIFICATION } from './qualification';
export interface IMeeting {
  idMeeting: number;
  idBuilding?: string;
  idSalesAgent?: number;
  postCode: string;
  professional: boolean;
  company: string;
  lastName: string;
  firstName: string;
  phone: string;
  address: string;
  complementaryAddress: string;
  building: string;
  stair: string;
  floor: string;
  door: string;
  encounters: Array<IEncounter>;
  comment: string;
  city?: string;
}

export class Meeting implements IMeeting {
  idMeeting: number;
  idBuilding?: string;
  idSalesAgent?: number;
  postCode: string;
  professional: boolean;
  company: string;
  lastName: string;
  firstName: string;
  phone: string;
  address: string;
  complementaryAddress: string;
  building: string;
  stair: string;
  floor: string;
  door: string;
  encounters: Array<IEncounter>;
  comment: string;
  city?: string;

  private _lastEncounter: IEncounter;
  private _date: string;
  private _type: string;
  private _customer: boolean;
  private _interest: number;
  private _status: number;
  private _qualification: string;
  private _startDate: string;
  private _endDate: string;

  // take the last encounter with list encounters sorted by date DESC
  get lastEncounter(): IEncounter {
    return this.encounters[0];
  }

  get date(): string {
    if (this.lastEncounter.date) {
      return moment(this.lastEncounter.date).format('DD/MM/YYYY');
    }
    return '';
  }

  get startDate(): string {
    return moment(this.lastEncounter.date).format('YYYY-MM-DD');
  }

  get endDate(): string {
    return moment(this.lastEncounter.date).format('YYYY-MM-DD');
  }

  get type(): string {
    if (this.lastEncounter.type) {
      return this.lastEncounter.type;
    }
    return '';
  }

  get customer(): boolean {
    return this.lastEncounter.customer;
  }

  get interest(): number {
    return this.lastEncounter.interest;
  }

  get status(): number {
    return this.lastEncounter.status;
  }

  get qualification(): string {
    if (this.customer === false && this.status === 1 && this.interest === 3 ) {
      return QUALIFICATION[0];
    }
    if (this.customer === false && this.status === 1 && this.interest === 2 ) {
      return QUALIFICATION[1];
    }
    if (this.customer === false && this.status === 1 && this.interest === 1 ) {
      return QUALIFICATION[2];
    }
    if (this.customer === false && this.status === 2 && this.interest === 0 ) {
      return QUALIFICATION[3];
    }
    if (this.customer === true && this.status === 0 && this.interest === 3 ) {
      return QUALIFICATION[4];
    }
    if (this.customer === false && this.status === 3 && this.interest === 3 ) {
      return QUALIFICATION[5];
    }
    return '';
  }

}
