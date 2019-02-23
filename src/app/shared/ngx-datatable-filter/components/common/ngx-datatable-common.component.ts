import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxDatatablesFilterService } from '../../service/ngx-datatable-filter.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { INgxDatatableFilter } from '../../model/ngxDatatableFilter';

@Component({
  selector: 'app-ngx-datatable-common',
  template: ``
})
export class NgxDatatableCommonFilterComponent implements OnInit {

  @Input() ngxDatas: Array<any> = [];
  @Output() filterCallback = new EventEmitter<Array<any>>();
  constructor(
    private ngxFilter: NgxDatatablesFilterService
  ) { }

  ngOnInit() {
    // Filter change
    this.ngxFilter.ngxDataChange.subscribe((sortData: INgxDatatableFilter) => {
      console.log(sortData);
      if (sortData.action === this.ngxFilter.sortByAlphabet) {
        this.sortByAlphabet(sortData);
      }
      this.filterCallback.emit(this.ngxDatas);
    });
  }
  /**
   * Sort column follow ASC or DESC
   * @param event
   */
  sortByAlphabet(sortData: INgxDatatableFilter) {
    this.ngxDatas = _.orderBy(this.ngxDatas, sortData.sortBy, sortData.sortValue);
  }
}
