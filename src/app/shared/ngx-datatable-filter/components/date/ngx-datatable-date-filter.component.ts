import { Component, OnInit, Input } from '@angular/core';
import { NgxDatatablesFilterService } from '../../service/ngx-datatable-filter.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-ngx-datatable-date-filter',
  templateUrl: './ngx-datatable-date-filter.component.html',
  styleUrls: ['./ngx-datatable-date-filter.component.scss']
})
export class NgxDatatableDateFilterComponent implements OnInit {

  @Input() public ngxDatas: Array<any> = [];
  @Input() public sortBy: string;

  maxDate: Date = moment().toDate();
  selectedDate: Date;
  constructor(
    private ngxFilter: NgxDatatablesFilterService
  ) { }

  ngOnInit() { }

  sort() {
    const dateSelected = moment(this.selectedDate).format('DD/MM/YYYY');
    const search = {
      date: {
        col: this.sortBy,
        val: dateSelected
      }
    };
    this.ngxFilter.filter.sortValue = dateSelected;
    this.updateDataFilter(search);
    this.ngxFilter.change(this.ngxFilter.sortByDate);
  }

  updateDataFilter(data: any) {
    // Find item. Update if exist
    const idx = _.findIndex(this.ngxFilter.filter.sortData, o => {
      if (o.date) {
        return o.date.col === this.sortBy;
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
    // Return false to show the list filter
    return false;
  }
}
