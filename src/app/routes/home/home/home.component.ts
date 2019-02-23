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
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
@AutoUnsubscribe()
export class HomeComponent implements OnInit {
  user: UserClaims;
  missions: Array<IMission> = [];
  temp: Array<IMission> = [];
  apiSub: Subscription;
  loadingIndicator = true;
  pageLimitOptions = [{ value: 5 }, { value: 10 }, { value: 25 }, { value: 100 }];
  currentPageLimit = 5;
  curPage = 0;
  messages = { emptyMessage: `<div class="text-center"><span>Aucune mission trouvée</span></div>` };
  currentComponentWidth: number;
  hasError = false;
  @ViewChild(DatatableComponent) public table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private scoutService: ScoutService
  ) {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
  }

  ngOnInit() {
    this.loadingIndicator = true;
    this.apiSub = this.scoutService.getMissions().subscribe(
      (ms: Array<IMission>) => {
        ms = this.prepareData(ms);
        this.missions = ms;
        // cache our list
        this.temp = [...ms];
        this.filterFromLocalStorage();
        this.fixBugColumnResize();
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
        this.localStorageService.get('currentPageLimitMission') : 5;
      setTimeout(() => {
        this.updateFilter(false);
      });
    }
  }

  prepareData(ms: Array<IMission>) {
    // Add new property `id` to each Mission, for display with SlickGrid
    const removeIds = [];
    ms.forEach((m: IMission, idx) => {
      m.id = m.idMission;
      m.ambassador = m.salesAgent.firstName + ' ' + m.salesAgent.lastName.toUpperCase();
      m.startDateF = moment(m.startDate).format('DD/MM/YYYY');
      m.endDateF = moment(m.endDate).format('DD/MM/YYYY');
      // Towns
      m.towns = '';
      m.townsF = '';
      if (m.cities) {
        m.cities.forEach((city: ICity, idx) => {
          m.townsF += (m.cities.length === idx + 1) ? city.label : city.label + ', ';
          if (idx <= 1) {
            m.towns += (idx === 1) ? ((m.cities.length > 2) ? city.label + ' ...' : city.label) : city.label + ', ';
          }
        });
      }
      // Status
      m.status = m.fiberStatuses.join(', ');
      // Check if endDate greater than Today
      const now = moment().format('DD/MM/YYYY');
      if (m.endDateF > now) {
        removeIds.push(idx);
      }
    });

    if (removeIds.length) {
      _.pullAt(ms, removeIds);
    }

    return ms;
  }

  updateFilter(searching: boolean) {
    const val = '';
    // filter our data
    const temp = this.temp.filter((d) => {
      return !val;
    });
    // update the Missions
    this.missions = temp;
    // Whenever the filter changes, always go back to the first page
    if (this.table) {
      const offset = searching ? 0 : this.curPage;
      this.table.offset = offset - 1;
      this.localStorageService.set('paginationMission', searching ? 1 : this.curPage);
    }
    this.fixBugColumnResize();
  }
  /**
   * Show per page change
   * @param limit
   */
  onLimitChange(limit: any): void {
    this.changePageLimit(limit);
    this.table.limit = this.currentPageLimit;
    this.localStorageService.set('currentPageLimitMission', limit);
    this.fixBugColumnResize();
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

  filterCallback(ms: Array<IMission>) {
    this.missions = _.clone(ms);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.fixBugColumnResize();
  }
  @HostListener('mouseenter', ['$event'])
  onMouseenter() {
    this.fixBugColumnResize();
  }

  fixBugColumnResize() {
    setTimeout(() => {
      if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
        this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
        this.table.recalculate();
        this.table.recalculateColumns();
        window.dispatchEvent(new Event('resize'));
      }
    });
  }
}
