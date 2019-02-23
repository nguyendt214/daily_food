import { Component, OnInit, Input } from '@angular/core';
import { NgxDatatablesFilterService } from '../../service/ngx-datatable-filter.service';
import * as _ from 'lodash';
import { IMission } from '../../../../routes/home/home/model/mission';

@Component({
  selector: 'app-ngx-datatable-filter',
  templateUrl: './ngx-datatable-filter.component.html',
  styleUrls: ['./ngx-datatable-filter.component.scss']
})
export class NgxDatatableFilterComponent implements OnInit {

  @Input() public ngxDatas: Array<any> = [];
  @Input() public sortBy: string;
  sortActive = false;
  active = {
    asc: false,
    desc: false
  };
  checklist = [];
  checklistOrigin = [];
  checkedAll = false;

  constructor(
    private ngxFilter: NgxDatatablesFilterService
  ) { }

  ngOnInit() { }

  sort(sortValue: string) {
    this.ngxFilter.filter.sortValue = sortValue;
    const search = {
      sort: {
        col: this.sortBy,
        val: {
          by: this.ngxFilter.sortByAlphabet,
          type: sortValue
        }
      }
    };
    this.updateDataFilter(search);
    this.ngxFilter.change(this.ngxFilter.sortByAlphabet);
  }

  updateDataFilter(data: any) {
    // Find item. Update if exist
    const idx = _.findIndex(this.ngxFilter.filter.sortData, o => {
      if (o.sort) {
        return o.sort.col === this.sortBy;
      }
    });
    if (idx > -1) {
      this.ngxFilter.filter.sortData.splice(idx, 1, data);
      return;
    }
    this.ngxFilter.filter.sortData.push(data);
  }

  filterToggle(): boolean {
    this.ngxFilter.filter.sortBy = this.sortBy;
    this.prepareListData();
    // Return false to show the list filter
    return false;
  }

  prepareListData() {
    _.each(this.ngxDatas, (ms: IMission) => {
      if (!_.includes(this.checklist, ms[this.sortBy])) {
        this.checklist.push(ms[this.sortBy]);
        this.checklistOrigin.push(ms[this.sortBy]);
      }
    });
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

  filterByList(event) {
    this.checkAllState();

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
    // Call back to update the list
    this.ngxFilter.change(this.ngxFilter.sortByList);
  }

  checkAllState() {
    this.checkedAll = _.isEqual(_.sortBy(this.checklist), _.sortBy(this.checklistOrigin));
  }


}
