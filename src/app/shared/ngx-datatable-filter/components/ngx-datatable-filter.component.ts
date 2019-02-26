import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { NgxDatatablesFilterService } from '../service/ngx-datatable-filter.service';
import { INgxDatatableListFilter } from '../model/ngxDatatableFilter';
import { IMission } from '../../../routes/home/home/model/mission';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-ngx-datatable-filter',
  templateUrl: './ngx-datatable-filter.component.html',
  styleUrls: ['./ngx-datatable-filter.component.scss']
})
export class NgxDatatableFilterComponent implements OnInit, OnChanges {

  @Input() public ngxDatas: Array<any> = [];
  @Input() public filterList: Array<any> = [];
  @Input() public sortBy: string;
  @Input() public searchContains: boolean;
  @Input() public searchByDate = false;
  @ViewChild('linkFilter') linkFilter: ElementRef;
  sortActive = false;
  isOpen = false;
  active = {
    asc: false,
    desc: false
  };
  checklist = [];
  checklistOrigin = [];
  checklistForSearch = [];
  checkedAll = false;
  searchInList = '';
  selectedDate: Date;
  constructor(
    private ngxFilter: NgxDatatablesFilterService
  ) { }

  ngOnInit() {
    this.checklist = [...this.filterList];
    this.checklistOrigin = [...this.filterList];
    this.checklistForSearch = [...this.filterList];
    this.initListVals(this.filterList);
  }

  ngOnChanges(changes: SimpleChanges) {
    const list: SimpleChange = changes.filterList;
    if (list && !list.firstChange) {
      this.initListVals(list.currentValue);
    }
  }

  initListVals(l: Array<string>) {
    this.checklist = [...l];
    this.checklistOrigin = [...l];
    this.checklistForSearch = [...l];
  }
  /**
   * Filter toggle
   */
  filterToggle(): boolean {
    this.ngxFilter.filter.sortBy = this.sortBy;
    this.prepareData();
    // Return false to show the list filter
    return false;
  }

  prepareData() {
    // Prepare for filter by Date
    if (!this.selectedDate && ['startDate', 'endDate'].indexOf(this.sortBy) > - 1) {
      let m: IMission;
      if (this.sortBy === 'endDate') {
        m = _.maxBy(this.ngxDatas, (ms: IMission) => {
          return moment(ms.endDate);
        });
        this.selectedDate = moment(m.endDate).toDate();
        this.ngxFilter.maxDate = this.selectedDate;
      } else {
        m = _.minBy(this.ngxDatas, (ms: IMission) => {
          return moment(ms.startDate);
        });
        this.selectedDate = moment(m.startDate).toDate();
        this.ngxFilter.minDate = this.selectedDate;
      }
    }
    this.checkAllState();
  }
  /**
   * prepare data for sort by Alphabet
   * @param sortValue
   */
  sort(sortValue: string) {
    this.ngxFilter.filter.sortValue = sortValue;
    this.ngxFilter.sortOrder++;
    this.updateDataFilter({
      sortCol: this.sortBy,
      sortType: this.searchByDate ? this.ngxFilter.sortByDate : this.ngxFilter.sortByAlphabet,
      sortValue: sortValue,
      sortOrder: this.ngxFilter.sortOrder
    }, this.ngxFilter.sortByAlphabet);
    this.ngxFilter.change(this.ngxFilter.sortByAlphabet);
  }
  /**
   * prepare data for sort date by RANGE
   */
  sortByDateRange() {
    if (this.sortBy === 'startDate') {
      this.ngxFilter.minDate = this.selectedDate;
    } else if (this.sortBy === 'endDate') {
      this.ngxFilter.maxDate = this.selectedDate;
    }
    this.ngxFilter.sortOrder++;
    this.updateDataFilter({
      sortCol: this.sortBy,
      sortType: this.ngxFilter.sortByDateRange,
      sortOrder: this.ngxFilter.sortOrder,
      searchByDate: {
        min: this.ngxFilter.minDate,
        max: this.ngxFilter.maxDate,
      }
    }, this.ngxFilter.sortByDateRange);
    this.ngxFilter.change(this.ngxFilter.sortByDateRange);
  }
  /**
   * For sort by ASC or DESC
   * @param by
   */
  addActive(by: string) {
    Array.from(document.getElementsByClassName('sort-by')).forEach((item) => {
      item.classList.remove('active');
    });
    // Reset active data
    this.active.asc = false;
    this.active.desc = false;
    this.active[by] = true;
  }
  /**
   * Filter base on select values in the LIST
   */
  filterByList() {
    this.ngxFilter.sortOrder++;
    this.updateDataFilter({
      sortCol: this.sortBy,
      sortType: this.ngxFilter.sortByList,
      sortList: this.checklist,
      sortOrder: this.ngxFilter.sortOrder,
      searchContains: this.searchContains
    }, this.ngxFilter.sortByList);
    this.checkAllState();
    this.ngxFilter.change(this.ngxFilter.sortByList);
  }
  /**
   * Select value in the LIST
   */
  selectAllChange() {
    this.checkAllState();
    if (this.checkedAll) {
      this.checklist = [];
    } else {
      this.checklist = _.clone(this.checklistOrigin);
    }
    // Update check all state
    this.checkAllState();
    // Callback to update the list
    this.filterByList();
  }
  /**
   * Check-all ( Un check-all ) values in the LIST
   */
  checkAllState() {
    this.checkedAll = _.isEqual(_.sortBy(this.checklist), _.sortBy(this.checklistOrigin));
  }
  /**
   * Filter in the LIST
   */
  filterCheckboxList() {
    if (this.searchInList) {
      this.checklistForSearch = _.filter(this.checklistOrigin, (str: string) => {
        return str && str.toUpperCase().includes(this.searchInList.toLocaleUpperCase());
      });
      return;
    }
    this.checklistForSearch = [...this.checklistOrigin];
  }
  /**
   * Update global search data
   * @param data
   * @param sortType
   */
  updateDataFilter(data: any, sortType?: string) {
    // Just keep last sort by Alphabet
    if (sortType === this.ngxFilter.sortByAlphabet) {
      this.ngxFilter.filter.sortData = _.remove(this.ngxFilter.filter.sortData, (o: INgxDatatableListFilter) => {
        return o.sortType !== this.ngxFilter.sortByAlphabet && o.sortType !== this.ngxFilter.sortByDate;
      });
    } else {
      // Find item. Update if exist
      const idx = _.findIndex(this.ngxFilter.filter.sortData, (o: INgxDatatableListFilter) => {
        return (o.sortCol === this.sortBy && o.sortType === sortType) || (o.sortType === this.ngxFilter.sortByDateRange);
      });
      if (idx > -1) {
        this.ngxFilter.filter.sortData.splice(idx, 1, data);
        return;
      }
    }
    this.ngxFilter.filter.sortData.push(data);
  }
  /**
   * Handle state of filter
   * @param val
   */
  handler(val: boolean) {
    this.isOpen = val;
  }
}
