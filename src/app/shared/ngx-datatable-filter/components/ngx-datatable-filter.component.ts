import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgxDatatablesFilterService } from '../service/ngx-datatable-filter.service';
import { INgxDatatableListFilter } from '../model/ngxDatatableFilter';
import * as _ from 'lodash';

@Component({
  selector: 'app-ngx-datatable-filter',
  templateUrl: './ngx-datatable-filter.component.html',
  styleUrls: ['./ngx-datatable-filter.component.scss']
})
export class NgxDatatableFilterComponent implements OnInit {

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
  }

  sort(sortValue: string) {
    this.ngxFilter.filter.sortValue = sortValue;
    this.ngxFilter.sortOrder++;
    this.updateDataFilter({
      sortCol: this.sortBy,
      sortType: this.searchByDate ? this.ngxFilter.sortByDate : this.ngxFilter.sortByAlphabet,
      sortValue: sortValue,
      sortOrder: this.ngxFilter.sortOrder
    }, this.ngxFilter.sortByAlphabet);
    if (this.searchByDate) {
      const el: HTMLElement = this.linkFilter.nativeElement as HTMLElement;
      el.click();
    }
    this.ngxFilter.change(this.ngxFilter.sortByAlphabet);
  }

  filterToggle(): boolean {
    this.ngxFilter.filter.sortBy = this.sortBy;
    this.prepareListData();
    // Return false to show the list filter
    return false;
  }

  prepareListData() {
    this.checkAllState();
  }

  addActive(by: string) {
    Array.from(document.getElementsByClassName('sort-by')).forEach((item) => {
      item.classList.remove('active');
    });
    // Reset active data
    this.active.asc = false;
    this.active.desc = false;
    this.active[by] = true;
  }

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

  checkAllState() {
    this.checkedAll = _.isEqual(_.sortBy(this.checklist), _.sortBy(this.checklistOrigin));
  }
  /**
   *
   * @param data Update global search data
   */
  updateDataFilter(data: any, sortType?: string) {
    // Just keep last sort by Alphabet
    if (sortType === this.ngxFilter.sortByAlphabet || sortType === this.ngxFilter.sortByDate) {
      this.ngxFilter.filter.sortData = _.remove(this.ngxFilter.filter.sortData, (o: INgxDatatableListFilter) => {
        return o.sortType !== this.ngxFilter.sortByAlphabet || sortType === this.ngxFilter.sortByDate;
      });
    } else {
      // Find item. Update if exist
      const idx = _.findIndex(this.ngxFilter.filter.sortData, (o: INgxDatatableListFilter) => {
        return o.sortCol === this.sortBy && o.sortType === sortType;
      });
      if (idx > -1) {
        this.ngxFilter.filter.sortData.splice(idx, 1, data);
        return;
      }
    }
    this.ngxFilter.filter.sortData.push(data);
  }
  filterCheckboxList() {
    if (this.searchInList) {
      this.checklistForSearch = _.filter(this.checklistOrigin, (str: string) => {
        return str && str.toUpperCase().includes(this.searchInList.toLocaleUpperCase());
      });
      return;
    }
    this.checklistForSearch = [...this.checklistOrigin];
  }
  sortByDateRange() {

  }
  /**
   * Handle state of filter
   * @param val
   */
  handler(val: boolean) {
    this.isOpen = val;
  }
}
