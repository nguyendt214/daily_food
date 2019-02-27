import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxDatatablesFilterService } from '../../service/ngx-datatable-filter.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { INgxDatatableFilter, INgxDatatableListFilter } from '../../model/ngxDatatableFilter';
import { IMission } from '../../../../routes/home/home/model/mission';

@Component({
  selector: 'app-ngx-datatable-common',
  template: ``
})
export class NgxDatatableCommonFilterComponent implements OnInit {
  @Input() ngxDatas: Array<any> = [];
  @Output() filterCallback = new EventEmitter<Array<any>>();
  @Output() listCallback = new EventEmitter<any>();
  @Output() resetCallback = new EventEmitter<any>();
  constructor(
    private ngxFilter: NgxDatatablesFilterService
  ) { }

  ngOnInit() {
    // Filter change
    this.ngxFilter.ngxDataChange.subscribe((filter: INgxDatatableFilter) => {
      this.ngxFilter.filtering = false;
      // Apply filter in the Filter list
      _.each(filter.sortData, (f: INgxDatatableListFilter) => {
        if (f.sortType === this.ngxFilter.sortByList) {
          this.sortByList(f);
          this.ngxFilter.filtering = true;
        }
        // Sort by Date
        if (f.sortType === this.ngxFilter.sortByDate) {
          this.sortByDate(f);
          this.ngxFilter.filtering = true;
        }
        // Sort by Alphabet
        if (f.sortType === this.ngxFilter.sortByAlphabet) {
          this.sortByAlphabet(f);
          this.ngxFilter.filtering = true;
        }
        // Sort by Date RANGE
        if (f.sortType === this.ngxFilter.sortByDateRange) {
          this.sortByDateRange(f);
          this.ngxFilter.filtering = true;
        }
      });
      // Callback to update the Parent list
      this.filterCallback.emit(this.ngxFilter.finalData);
      if ([this.ngxFilter.sortByList, this.ngxFilter.sortByDateRange].indexOf(filter.action) > -1) {
        // Callback to update another LIST
        this.listCallback.emit({ f: this.ngxFilter.filter, d: this.ngxFilter.finalData });
      }
      if (filter.action !== this.ngxFilter.sortByAlphabet) {
        // Callback to help parent update properties
        this.resetCallback.emit();
      }
    });
  }
  /**
   * Sort column follow ASC or DESC
   * @param event
   */
  sortByAlphabet(f: INgxDatatableListFilter): any {
    this.ngxFilter.finalData = _.orderBy(this.getDataCollection(), f.sortCol, f.sortValue);
  }
  /**
   * Filter follow the list data
   * @param item INgxDatatableListFilter
   */
  sortByList(item: INgxDatatableListFilter): any {
    const list = item.sortList || [];
    this.ngxFilter.finalData = _.filter(this.getDataCollection(), (ms: IMission) => {
      if (item.searchContains) {
        let rowVal = ms[item.sortCol].split(',') || [];
        rowVal = rowVal.map((str: string) => str.trim());
        const intersections = _.intersection(list, rowVal);
        ms['item.sortCol_filter'] = true;
        return Boolean(intersections && intersections.length);
      }

      return list.indexOf(ms[item.sortCol]) > -1;
    });
  }
  /**
   * Sort by date
   */
  sortByDate(f: INgxDatatableListFilter): any {
    this.ngxFilter.finalData = _.orderBy(this.getDataCollection(), (o: IMission) => {
      return moment(o[f.sortCol]).format(this.ngxFilter.dateFForSort);
    }, [f.sortValue]);
  }
  /**
   * Filter by date range
   */
  sortByDateRange(f: INgxDatatableListFilter): any {
    this.ngxFilter.finalData = _.filter(this.getDataCollection(), (ms: IMission) => {
      // startDate >= min + endDate <= max
      return (moment(ms.startDate) >= moment(f.searchByDate.min)) && (moment(ms.endDate) <= moment(f.searchByDate.max));
    });
  }

  getDataCollection() {
    return (this.ngxFilter.finalData && this.ngxFilter.filtering) ? this.ngxFilter.finalData : this.ngxDatas;
  }
}
