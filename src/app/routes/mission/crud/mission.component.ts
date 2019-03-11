import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { MuSwalService } from '@mu/components';
import { UserClaims } from '@okta/okta-angular';
import { IMission } from '../../home/home/model/mission';
import { IKeyValue } from '../../../shared/statics/models/constant/key.value';
import { ICity } from '../../home/home/model/city';
import { IUser } from '../../home/home/model/user';
import { ScoutService } from '../../home/home/service/scout.service';
import { StaticService } from '../../../shared/statics/services/static.service';
import * as moment from 'moment';
@Component({
  selector: 'app-mu-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
@AutoUnsubscribe()
export class MissionComponent implements OnInit {
  user: UserClaims;
  fiberStatus = this.staticService.oStatic.constants.fiberStatus;
  MatAutocompleteSelectedEvent: MatAutocompleteSelectedEvent;
  pageTitle: string;
  users: Array<IUser> = [];
  apiSub: Subscription;
  paramSub: Subscription;
  hasError = false;
  numberMonthDefault = 2;
  currentDate = moment(this.staticService.currentDate).toDate();
  actions = ['ADD', 'EDIT'];
  currentAction: string;
  editMode = false;
  editable = true;
  mission: IMission;
  missionId: number;
  cityAutocompleInput: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private staticService: StaticService,
    private scoutService: ScoutService,
    private muSwalService: MuSwalService
  ) {
    this.paramSub = this.activatedRoute.params.subscribe(params => {
      this.currentAction = params['action'].toLocaleUpperCase();
      this.missionId = +params['id'];
      this.editMode = this.currentAction === 'EDIT';
      this.pageTitle = this.editMode ? 'Editer une mission' : 'Ajouter une mission';
      if (!this.actions.includes(this.currentAction)) {
        // Redirect to page list of mission
        this.router.navigate(['']);
        return;
      }
    });
    this.user = this.activatedRoute.snapshot.data['user'];
  }
  // Declare form data
  form = {
    status: [],
    userId: 0,
    startDate: {
      min: this.currentDate,
      value: this.currentDate,
      disabled: false
    },
    endDate: {
      min: this.currentDate,
      value: this.currentDate,
      disabled: false
    },
    citiesSelected: []
  };
  pageLoaded = false;

  ngOnInit() {
    if (this.editMode) {
      this.mission = this.scoutService.getCurrentMission(this.missionId);
      this.editable = moment(this.mission.startDate) > moment();
    }
    this.prepareData();
  }

  prepareData() {
    this.apiSub = this.scoutService.getUsers()
      .subscribe(users => {
        this.users = users;
        if (_.isEmpty(this.users)) {
          this.hasError = true;
          return;
        }
        // Prepare form data when Editing
        if (this.mission) {
          this.prepareEditingData();
          this.pageLoaded = true;
          return;
        }
        // Init for User select box
        this.form.userId = this.users ? this.users[0].id : 0;
        // Init for Status
        this.form.status.push(this.fiberStatus ? this.fiberStatus[0].key : '');
        // Init Date
        this.updateEndDatePicker(true);
        this.pageLoaded = true;
      }, () => {
        this.hasError = true;
      });
  }
  /**
   * Prepare data in case of Edit Mission
   */
  prepareEditingData() {
    // Saler
    this.form.userId = this.mission.salesAgent.id;
    // Date
    this.form.startDate.value = moment(this.mission.startDate).toDate();
    this.form.startDate.disabled = (moment() >= moment(this.mission.startDate));
    this.form.endDate.value = moment(this.mission.endDate).toDate();
    this.updateEndDatePicker(false);
    // Status
    this.form.status = this.mission.fiberStatuses.slice(0);
    // Cities
    this.mission.cities.forEach((c: ICity) => {
      c.cityDisplay = c.city + ' (' + (c.cityCode ? c.cityCode : c.postCode) + ')';
      c.state = 0;
      this.form.citiesSelected.push(c);
    });
  }
  /**
   * Re-caculator EndDate base on Start Date
   * @param updateValue
   */
  updateEndDatePicker(updateValue?: boolean) {
    // Min always >= startDate and Today
    const minDate = moment() > moment(this.form.startDate.value) ? moment() : moment(this.form.startDate.value);
    this.form.endDate.min = minDate.toDate();
    if (updateValue) {
      this.form.endDate.value = moment(this.form.startDate.value).add(this.numberMonthDefault, 'month').toDate();
    }
  }
  /**
   * Choose start date from datepicker
   */
  startDateChange() {
    // If Start Date > End Date -> Update End Date value
    const needUpdateEndDateValue = moment(this.form.startDate.value) > moment(this.form.endDate.value);
    this.updateEndDatePicker(needUpdateEndDateValue);
  }

  /**
   * Choose end date from datepicker
   */
  endDateChange() {
    // Calculate the housing numbers ( cities and total )
  }
  /**
   * Select city from autocomplete input
   * @param event
   */
  onSelectCity(event: MatAutocompleteSelectedEvent) {
    const city = event.option.value;
    const idx = this.form.citiesSelected.findIndex((o: ICity) => {
      return o.cityCode ? (o.cityCode === city.cityCode) : (o.postCode === city.postCode);
    });

    if (idx > -1) {
      this.muSwalService.error('Cette ville est déjà sélectionnée');
      return;
    }
    this.form.citiesSelected.push({
      cityCode: !city.aliasAfnorLabel ? city.cityCode : '',
      postCode: city.aliasAfnorLabel ? city.postCode : '',
      city: city.aliasAfnorLabel ? city.aliasAfnorLabel : city.afnorLabel,
      cityDisplay: city.aliasAfnorLabel ? city.aliasAfnorLabel + ' (' + city.postCode + ')' : city.afnorLabel + ' (' + city.cityCode + ')',
      state: 1
    });
    this.cityAutocompleInput = document.getElementsByClassName('mat-form-field-autofill-control').item(0);
    this.cityAutocompleInput.value = '';
  }
  // When remove city
  removeCity(value: ICity): void {
    this.form.citiesSelected = this.form.citiesSelected.filter((o: ICity) => {
      return o.cityCode ? (o.cityCode !== value.cityCode) : (o.postCode !== value.postCode);
    });
  }
  // Return disable of status checkbox state
  disabledStatus(item: IKeyValue): boolean {
    if (this.editMode && !this.editable) {
      return this.mission.fiberStatuses.includes(item.key);
    }
    return this.form.status.length === 1 && this.form.status.includes(item.key);
  }
  // Go to Mission list page
  gotoList(refresh: boolean) {
    if (refresh) {
      this.scoutService.missionList = null;
    }
    this.router.navigate(['']);
  }
  // When ADP Input City has error
  onError() { }
  /**
   * Update/ Create mission
   */
  onSubmit() {
    const cities: Array<ICity> = [];
    this.form.citiesSelected.forEach((c: ICity) => {
      cities.push({
        cityCode: c.cityCode,
        postCode: c.postCode,
        city: c.city
      });
    });
    const mission = {
      'action': this.editMode ? 'EDIT' : 'ADD',
      'idSalesAgent': this.form.userId,
      'startDate': moment(this.form.startDate.value).format('YYYY-MM-DD'),
      'endDate': moment(this.form.endDate.value).format('YYYY-MM-DD'),
      'cities': cities,
      'fiberStatuses': this.form.status,
      'username': this.user.email,
      'missionId': this.editMode ? this.mission.idMission : 0
    };

    this.scoutService.missionCRUD(mission)
      .subscribe(
        () => {
          // Show popup success then go to list page
          this.muSwalService.success('Enregistrement effectué', '', 5000);
          setTimeout(() => {
            this.gotoList(true);
          }, 5000);
        },
        () => {
          // Show popup error
          this.muSwalService.error('Une erreur technique est survenue, veuillez essayer ultérieurement');
        }
      );
  }
}
