import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IMission } from '../../../routes/home/home/model/mission';

@Injectable()
export class NgxDatatablesFilterService {
  filter = {
    sortBy: '',
    sortValue: '',
    sortData: [],
    cols: []
  };
  sortByAlphabet = 'SORT';
  sortByDate = 'SORT_DATE';
  sortByDateRange = 'SORT_DATE_RANGE';
  sortByList = 'SORT_BY_LIST';
  sortOrder = 0;
  minDate: Date;
  maxDate: Date;
  dateF = 'DD/MM/YYYY';
  dateFForSort = 'YYYYMMDDD';
  finalData: Array<IMission> = [];
  filtering = false;
  ngxDataObj = new Subject<any>();
  ngxDataChange = this.ngxDataObj.asObservable();
  ngxRefreshObj = new Subject<any>();
  ngxRefresh = this.ngxRefreshObj.asObservable();

  constructor() { }

  change(type: string): any {
    this.ngxDataObj.next({
      action: type,
      sortBy: this.filter.sortBy,
      sortValue: this.filter.sortValue,
      sortData: this.filter.sortData
    });
  }

  refresh(): any {
    this.ngxRefreshObj.next();
  }
}
