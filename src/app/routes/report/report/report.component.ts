import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UserClaims } from '@okta/okta-angular';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription, forkJoin } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../shared/LocalStorage/local-storage.service';
import { NgxDatatablesFilterService } from '../../../shared/ngx-datatable-filter/service/ngx-datatable-filter.service';
import { ScoutService } from '../../home/home/service/scout.service';
import { ISalesAgent } from '../../home/home/model/salesAgent';
import { IMeeting, Meeting } from '../../home/home/model/meeting';
import { IEncounter } from '../../home/home/model/encounter';
import { Mission, IMission } from '../../home/home/model/mission';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
@AutoUnsubscribe()
export class ReportComponent implements OnInit {
  apiSub: Subscription;
  loadingIndicator = true;
  user: UserClaims;

  saleAgent: ISalesAgent;
  missions: Array<Mission> = [];
  messages = { emptyMessage: `<div class='text-center'><span>Aucune meeting trouvée</span></div>` };

  totalHousingNumber = 0;
  totalMetting = 0;

  listMissionIds = [];
  meetings: Array<IMeeting>;
  meetingsOrigin: Array<IMeeting>;

  pageLimitOptions = [{ value: 5 }, { value: 10 }, { value: 25 }, { value: 100 }];
  currentPageLimit = 10;
  curPage = 0;

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
    this.ngxFilter.filter.cols = ['idBuilding', 'city', 'type', 'interest'];
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
    this.getDatas();
  }

  getDatas() {
    const missionsObservable = this.scoutService.getSelectedMissions();
    const userObservable = this.scoutService.getSelectedUser();

    forkJoin([userObservable, missionsObservable]).subscribe(results => {
      this.saleAgent = this.prepareSalePerson(results[0] as ISalesAgent);
      this.missions = this.prepareMission(results[1] as Mission[]);
      this.getMeetingByMissisonIDs();
    }, () => {
      this.hasError = true;
    });
  }

  prepareSalePerson(salesAgent: ISalesAgent) {
    return Object.assign(salesAgent, {'ambassador': salesAgent.firstName + ' ' + salesAgent.lastName.toUpperCase()});
  }

  prepareMission(missions: Array<IMission>): Array<Mission>  {
    missions.forEach((mission: IMission, i) => {
      mission = Object.assign( new Mission(), mission);
      missions[i] = mission;
      this.totalHousingNumber += mission.totalHousingNumber;
      this.listMissionIds.push(mission.id);
    });
    return missions as Array<Mission>;
  }

  getMeetingByMissisonIDs() {
    this.scoutService.getMeetingByMissisonIDs(this.listMissionIds).subscribe(results => {
      this.meetings = this.prepareMettings(results) as Array<Meeting>;
      // cache our list
      this.meetingsOrigin = [...this.meetings];
      this.filterFromLocalStorage();
      this.fixBugColumnResize(true);
      this.loadingIndicator = false;
    }, () => {
      this.hasError = true;
    });
  }

  prepareMettings(meetings: Array<IMeeting>): Array<IMeeting>  {
    meetings.forEach((meeting: IMeeting, i) => {
      const meetingObj = Object.assign( new Meeting(), meeting) as Meeting;

      this.filterList['idBuilding'] = _.union(this.filterList['idBuilding'], [meetingObj.idBuilding]);
      this.filterList['city'] = _.union(this.filterList['city'], [meetingObj.city]);
      this.filterList['type'] = _.union(this.filterList['type'], [meetingObj.type]);
      this.filterList['interest'] = _.union(this.filterList['interest'], [meetingObj.interest]);
      this.filterList['qualification'] = _.union(this.filterList['qualification'], [meetingObj.qualification]);

      meetings[i] = meetingObj;
      this.totalMetting += 1;
    });
    return meetings as Array<Meeting>;
  }

  filterFromLocalStorage() {
    // Get search box value
    if (this.localStorageService.isAvailable()) {
      this.curPage = this.localStorageService.get('paginationMeeting') ? this.localStorageService.get('paginationMeeting') : 0;
      this.currentPageLimit = this.localStorageService.get('currentPageLimitMeeting') ?
        this.localStorageService.get('currentPageLimitMeeting') : 10;
      setTimeout(() => {
        this.updateFilter(false);
      });
    }
  }

  updateFilter(searching: boolean) {
    // Whenever the filter changes, always go back to the first page
    if (this.table) {
      const offset = searching ? 0 : this.curPage;
      this.table.offset = offset - 1;
      this.localStorageService.set('paginationMeeting', searching ? 1 : this.curPage);
    }
  }


  /**
   * Show per page change
   * @param limit
   */
  onLimitChange(limit: any): void {
    this.changePageLimit(limit);
    this.table.limit = this.currentPageLimit;
    this.localStorageService.set('currentPageLimitMeeting', limit);
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
    this.localStorageService.set('paginationMeeting', event.page);
  }

  filterCallback(meeting: Array<Meeting>) {
    this.meetings = _.clone(meeting);
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
    _.each(data.d, (meeting: Meeting) => {
      _.each(listNeedUpdate, col => {
        const rowVal = meeting[col];
        // Check if value is merge string
        if (typeof rowVal === 'string' && rowVal.includes(',')) {
          let val = meeting[col].split(',') || [];
          val = val.map((str: string) => str.trim());
          _.each(val, (str: string) => {
            this.filterList[col] = _.union(this.filterList[col], [str]);
          });
        } else {
          this.filterList[col] = _.union(this.filterList[col], [meeting[col]]);
        }
      });
    });
  }
  resetCallback() {
    this.updateFilter(true);
    this.onLimitChange(10);
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
