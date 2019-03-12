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
  @Input() public filterRefresh: boolean;
  @Input() public labelType;
  @ViewChild('linkFilter') linkFilter: ElementRef;
  isOpen = false;
  active = {
    asc: false,
    desc: false
  };
  oSort = {
    icon: '',
    value: ''
  };
  checklist = [];
  checklistOrigin = [];
  checklistForSearch = [];
  checkedAll = false;
  searchInList = '';
  selectedDate: Date;
  filtered = false;

  constructor(
    private ngxFilter: NgxDatatablesFilterService
  ) {
    this.ngxFilter.ngxRefresh.subscribe(() => {
      this.filtered = false;
      this.active.asc = false;
      this.active.desc = false;
      this.ngxFilter.finalData = null;
      this.oSort.icon = '';
      this.updateDateData();
    });
  }

  ngOnInit() {
    this.initListVals(this.filterList);
  }

  ngOnChanges(changes: SimpleChanges) {
    const list: SimpleChange = changes.filterList;
    if (list && !list.firstChange) {
      this.initListVals(list.currentValue);
      this.updateDateData();
    }
  }

  initListVals(l: Array<string>) {
    this.checklist = l ? [...l] : [];
    this.checklistOrigin = l ? [...l] : [];
    this.checklistForSearch = l ? [...l] : [];
  }
  /**
   * Filter toggle
   */
  filterToggle(col: string): boolean {
    this.ngxFilter.column.current = col;
    this.ngxFilter.column.change = false;
    this.ngxFilter.filter.sortBy = this.sortBy;
    this.updateDateData();
    this.prepareData();
    // Return false to show the list filter
    return false;
  }

  prepareData() {
    this.checkAllState();
  }
  updateDateData() {
    // Prepare for filter by Date
    let m: IMission;
    const dataCollection = this.ngxFilter.finalData ? this.ngxFilter.finalData : this.ngxDatas;

    if (this.ngxFilter.autoSetEndDate && this.sortBy === 'endDate') {
      // EndDate
      m = _.maxBy(dataCollection, (ms: IMission) => {
        return ms && moment(ms.endDate).format(this.ngxFilter.dateFForSort);
      });
      this.ngxFilter.maxDate = m ? moment(m.endDate).toDate() : new Date();
      this.selectedDate = this.ngxFilter.maxDate;
    }
    if (this.ngxFilter.autoSetStartDate && this.sortBy === 'startDate') {
      // StartDate
      m = _.minBy(dataCollection, (ms: IMission) => {
        return ms && moment(ms.startDate).format(this.ngxFilter.dateFForSort);
      });
      this.ngxFilter.minDate = m ? moment(m.startDate).toDate() : new Date();
      this.selectedDate = this.ngxFilter.minDate;
    }
  }
  /**
   * prepare data for sort by Alphabet
   * @param sortValue
   */
  sort(sortValue: string) {
    this.oSort.value = sortValue;
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
      this.ngxFilter.autoSetStartDate = false;
    } else if (this.sortBy === 'endDate') {
      this.ngxFilter.maxDate = this.selectedDate;
      this.ngxFilter.autoSetEndDate = false;
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
    this.filtered = true;
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
    this.ngxFilter.column.change = true;
    this.updateSortIcon();
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
    this.filtered = true;
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

  updateSortIcon() {
    if (this.ngxFilter.column.change) {
      // Remove for another columns
      Array.from(document.getElementsByClassName('mu-sort-icon')).forEach((item) => {
        item.classList.add('mu-hide');
      });
      const currentEle = document.getElementById('col-' + this.sortBy);
      currentEle.classList.remove('mu-hide');
      currentEle.classList.add('mu-show');
      // Update icon sort
      this.oSort.icon = (this.active.asc) ? 'up' : ((this.active.desc) ? 'down' : '');
      this.oSort.value = (this.active.asc) ? 'asc' : ((this.active.desc) ? 'desc' : '');
      this.ngxFilter.column.prev = this.ngxFilter.column.current;
    }
  }
}
