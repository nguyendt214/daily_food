import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { INgxDatatableFilter } from '../model/ngxDatatableFilter';

@Injectable()
export class NgxDatatablesFilterService {
  filter = {
    sortBy: '',
    sortValue: '',
    sortData: []
  };
  sortByAlphabet = 'SORT';
  sortByDate = 'SORT_DATE';
  sortByList = 'SORT_BY_LIST';
  ngxDataObj = new Subject<any>();
  ngxDataChange = this.ngxDataObj.asObservable();

  constructor() { }

  change(type: string): any {
    this.ngxDataObj.next({
      action: type,
      sortBy: this.filter.sortBy,
      sortValue: this.filter.sortValue,
      data: this.filter.sortData
    });
  }
}
