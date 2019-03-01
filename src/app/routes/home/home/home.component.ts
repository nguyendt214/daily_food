import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UserClaims } from '@okta/okta-angular';
import { ActivatedRoute } from '@angular/router';
import { ScoutService } from './service/scout.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { IMission } from './model/mission';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ICity } from './model/city';
import { LocalStorageService } from '../../../shared/LocalStorage/local-storage.service';
import { NgxDatatablesFilterService } from '../../../shared/ngx-datatable-filter/service/ngx-datatable-filter.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
@AutoUnsubscribe()
export class HomeComponent implements OnInit {
  user: UserClaims;
  missions: Array<IMission> = [];
  missionsOrigin: Array<IMission> = [];
  apiSub: Subscription;
  loadingIndicator = true;
  pageLimitOptions = [{ value: 5 }, { value: 10 }, { value: 25 }, { value: 100 }];
  currentPageLimit = 10;
  curPage = 0;
  messages = { emptyMessage: `<div class='text-center'><span>Aucune mission trouvée</span></div>` };
  currentComponentWidth: number;
  hasError = false;
  filterList = new Object();
  @ViewChild(DatatableComponent) public table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private scoutService: ScoutService,
    private ngxFilter: NgxDatatablesFilterService
  ) {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
    // Add cols want to update the LIST values
    this.ngxFilter.filter.cols = ['ambassador', 'townsF', 'status'];
    // Prepare for checlist and filterlist
    _.each(this.ngxFilter.filter.cols, (col: string) => {
      Object.defineProperty(this.filterList, col, {
        value: [],
        writable: true,
        enumerable: true
      });
    });
  }

  ngOnInit() {
    this.getListMission();
    this.loadingIndicator = true;
  }

  clearFilter() {
    this.getListMission();
    this.ngxFilter.filter.sortData = [];
    this.ngxFilter.refresh();
  }

  getListMission() {
    this.apiSub = this.scoutService.getMissions().subscribe(
      (ms: Array<IMission>) => {
        this.missions = this.prepareData(ms);
        // cache our list
        this.missionsOrigin = [...ms];
        this.filterFromLocalStorage();
        this.fixBugColumnResize(true);
        this.loadingIndicator = false;
      }, () => {
        this.hasError = true;
      }
    );
  }

  filterFromLocalStorage() {
    // Get search box value
    if (this.localStorageService.isAvailable()) {
      this.curPage = this.localStorageService.get('paginationMission') ? this.localStorageService.get('paginationMission') : 0;
      this.currentPageLimit = this.localStorageService.get('currentPageLimitMission') ?
        this.localStorageService.get('currentPageLimitMission') : 10;
      setTimeout(() => {
        this.updateFilter(false);
      });
    }
  }

  prepareData(ms: Array<IMission>) {
    _.each(ms, (m: IMission) => {
      m.id = m.idMission;
      m.ambassador = m.salesAgent.firstName + ' ' + m.salesAgent.lastName.toUpperCase();
      m.startDateF = moment(m.startDate).format('DD/MM/YYYY');
      m.endDateF = moment(m.endDate).format('DD/MM/YYYY');
      // Status
      m.status = m.fiberStatuses.join(', ');
      // Init data for filter list by Status
      _.each(m.fiberStatuses, s => {
        this.filterList['status'] = _.union(this.filterList['status'], [s]);
      });
      // Init data for filter list by Ambassador
      this.filterList['ambassador'] = _.union(this.filterList['ambassador'], [m.ambassador]);
      // Towns
      m.towns = '';
      m.townsF = '';
      if (m.cities) {
        _.each(m.cities, (c: ICity, index) => {
          m.townsF += (m.cities.length === index + 1) ? c.city : c.city + ', ';
          if (index <= 1) {
            m.towns += (index === 1) ? ((m.cities.length > 2) ? c.city + ' ...' : c.city) :
              ((m.cities.length === 1) ? c.city : c.city + ', ');
          }
          // Init for filter list by City
          this.filterList['townsF'] = _.union(this.filterList['townsF'], [c.city]);
        });
      }
    });
    // Sort filter list by Alphabet
    _.each(this.ngxFilter.filter.cols, (col: string) => {
      this.filterList[col].sort();
    });

    return ms;
  }

  updateFilter(searching: boolean) {
    // Whenever the filter changes, always go back to the first page
    if (this.table) {
      const offset = searching ? 0 : this.curPage;
      this.table.offset = offset - 1;
      this.localStorageService.set('paginationMission', searching ? 1 : this.curPage);
    }
  }
  /**
   * Show per page change
   * @param limit
   */
  onLimitChange(limit: any): void {
    this.changePageLimit(limit);
    this.table.limit = this.currentPageLimit;
    this.localStorageService.set('currentPageLimitMission', limit);
    setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        this.table.offset = Math.floor((this.table.rowCount - 1) / this.table.limit);
      }
    });
  }
  /**
   * Show perPage
   * @param limit
   */
  changePageLimit(limit: any): void {
    this.currentPageLimit = parseInt(limit, 10);
  }
  /**
   * Store curentPage to localStorage
   * @param event
   */
  updatePager(event: any) {
    this.localStorageService.set('paginationMission', event.page);
  }
  /**
   * Get tooltip message for City
   * @param row IMission
   * @return string
   */
  public getTooltipText(row: IMission): string {
    if (row.towns.includes('...')) {
      return row.townsF;
    }
    return '';
  }

  filterCallback(ms: Array<IMission>) {
    this.missions = _.clone(ms);
  }

  listCallback(data: any) {
    // Reset the list values first
    _.each(data.f.cols, item => {
      if (item !== data.f.sortBy) {
        this.filterList[item] = [];
      }
    });
    // Find the list need update the data
    const listNeedUpdate = _.difference(data.f.cols, [data.f.sortBy]);
    _.each(data.d, (ms: IMission) => {
      _.each(listNeedUpdate, col => {
        const rowVal = ms[col];
        // Check if value is merge string
        if (rowVal.includes(',')) {
          let val = ms[col].split(',') || [];
          val = val.map((str: string) => str.trim());
          _.each(val, (str: string) => {
            this.filterList[col] = _.union(this.filterList[col], [str]);
          });
        } else {
          this.filterList[col] = _.union(this.filterList[col], [ms[col]]);
        }
      });
    });
  }
  resetCallback() {
    this.updateFilter(true);
    this.onLimitChange(10);
  }
  getDeleteState(ms: IMission): boolean {
    return moment(ms.startDate).format(this.ngxFilter.dateFForSort) <= moment().format(this.ngxFilter.dateFForSort);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.fixBugColumnResize();
  }
  @HostListener('mouseenter', ['$event'])
  onMouseenter() {
    this.fixBugColumnResize();
  }

  fixBugColumnResize(forceUpdate?: boolean) {
    setTimeout(() => {
      if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
        this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
        this.table.recalculate();
        this.table.recalculateColumns();
        window.dispatchEvent(new Event('resize'));
      }
    });
    if (forceUpdate) {
      window.dispatchEvent(new Event('resize'));
    }
  }
}
