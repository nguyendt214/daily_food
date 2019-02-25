import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { INgxDatatableFilter } from '../model/ngxDatatableFilter';
import { IMission } from '../../../routes/home/home/model/mission';

@Injectable()
export class NgxDatatablesFilterService {
  filter = {
    sortBy: '',
    sortValue: '',
    sortData: []
  };
  sortByAlphabet = 'SORT';
  sortByDate = 'SORT_DATE';
  sortByDateRange = 'SORT_DATE_RANGE';
  sortByList = 'SORT_BY_LIST';
  sortOrder = 0;
  finalData: Array<IMission> = [];
  filtering = false;
  ngxDataObj = new Subject<any>();
  ngxDataChange = this.ngxDataObj.asObservable();

  constructor() { }

  change(type: string): any {
    this.ngxDataObj.next({
      action: type,
      sortBy: this.filter.sortBy,
      sortValue: this.filter.sortValue,
      sortData: this.filter.sortData
    });
  }
}
