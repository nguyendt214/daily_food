import { IUser } from './../home/home/model/user';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UserClaims } from '@okta/okta-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { LocalStorageService } from '../../shared/LocalStorage/local-storage.service';
import { ScoutService } from '../home/home/service/scout.service';
import { ISalesAgent } from '../home/home/model/salesAgent';
import { Mission, IMission } from '../home/home/model/mission';
@Component({
  selector: 'app-report',
  templateUrl: './report.main.component.html',
  styleUrls: ['./report.main.component.scss']
})
@AutoUnsubscribe()
export class MainReportComponent implements OnInit {
  apiSub: Subscription;
  loadingIndicator: boolean;
  user: UserClaims;

  saleAgent: ISalesAgent;
  missions: Array<Mission> = [];
  messages = { emptyMessage: `<div class='text-center'><span>Aucune mission n'est disponible pour cet ambassadeur</span></div>` };

  pageLimitOptions = [{ value: 5 }, { value: 10 }, { value: 25 }, { value: 100 }];
  currentPageLimit = 10;
  curPage = 0;
  currentComponentWidth: number;
  hasError = false;
  filterList = new Object();
  users: Array<IUser> = [];
  selectedUser: IUser;
  pageTitle = 'Afficher le rapport';
  missionSelected: Array<Mission> = [];
  @ViewChild(DatatableComponent) public table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private scoutService: ScoutService
  ) {
    this.activatedRoute.data.subscribe(data => {
      this.user = data.user;
    });
  }

  ngOnInit() {
    this.loadingIndicator = true;
    this.prepareData();
  }

  prepareData() {
    this.apiSub = this.scoutService.getUsers()
      .subscribe(users => {
        this.users = users;
        // Init for User select box
        this.selectedUser = this.users ? this.users[0] : null;
        this.updateMissionList();
        this.loadingIndicator = false;
      }, () => {
        this.hasError = true;
      });

  }
  updateMissionList() {
    this.selectedUser = this.users.find((u: IUser) => {
      return u.id === this.selectedUser.id;
    });
    if (this.selectedUser) {
      this.missions = this.prepareMission(this.selectedUser.missions as Mission[]);
    }
  }

  prepareMission(missions: Array<IMission>): Array<Mission> {
    missions.forEach((mission: IMission, i) => {
      mission = Object.assign(new Mission(), mission);
      missions[i] = mission;
    });
    return missions as Array<Mission>;
  }

  /**
   * Select checkbox
   * @param param
   */
  onSelect({ selected }) {
    this.missionSelected.splice(0, this.missionSelected.length);
    this.missionSelected.push(...selected);
  }

  filterFromLocalStorage() {
    // Get search box value
    if (this.localStorageService.isAvailable()) {
      this.curPage = this.localStorageService.get('paginationReportMission') ? this.localStorageService.get('paginationReportMission') : 0;
      this.currentPageLimit = this.localStorageService.get('currentPageLimitReportMission') ?
        this.localStorageService.get('currentPageLimitReportMission') : 10;
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
      this.localStorageService.set('paginationReportMission', searching ? 1 : this.curPage);
    }
  }


  /**
   * Show per page change
   * @param limit
   */
  onLimitChange(limit: any): void {
    this.changePageLimit(limit);
    this.table.limit = this.currentPageLimit;
    this.localStorageService.set('currentPageLimitReportMission', limit);
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
    this.localStorageService.set('paginationReportMission', event.page);
  }
  /**
   * Press submit button
   */
  onSubmit() {
    // Store info to scoutService
    this.scoutService.selectedMissions = this.missionSelected.slice(0);
    this.scoutService.selectedUser = this.selectedUser;
    // Redirect to next step
    this.router.navigate(['/report/show-list']);
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
