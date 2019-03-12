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
  filterByDateRange = 'FILTER_DATE_RANGE';
  filterByList = 'FILTER_BY_LIST';
  sortOrder = 0;
  minDate: Date;
  maxDate: Date;
  dateF = 'DD/MM/YYYY';
  dateFForSort = 'YYYYMMDDD';
  autoSetStartDate = true;
  autoSetEndDate = true;
  finalData: Array<IMission>;
  filtering = false;
  column = {
    prev: '',
    current: '',
    change: false
  };
  // For main filter action
  ngxDataObj = new Subject<any>();
  ngxDataChange = this.ngxDataObj.asObservable();
  // For refresh filter action
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
