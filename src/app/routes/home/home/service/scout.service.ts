import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IMission } from '../model/mission';
import { environment } from '../../../../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { MeetingByMissisonID } from '../../../../../../tests/mock/MeetingByMissisonID.mock';
import { IMeeting } from '../model/meeting';
import { salePerson } from '../../../../../../tests/mock/salePerson.mock';
import { missionsReport } from '../../../../../../tests/mock/missionsReport.mock';
import { ISalesAgent } from '../model/salesAgent';

const API_URL = environment.direct_scout_api;
@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  missionList: Array<IMission>;
  selectedUser: ISalesAgent;
  selectedMissions: Array<IMission>;

  constructor(private httpClient: HttpClient) { }

  getMissions(): Observable<Array<IMission>> {
    if (this.missionList) {
      return Observable.of(this.missionList);
    }
    const url = API_URL + '/missions';
    return this.httpClient
      .get<Array<IMission>>(url)
      .pipe(
        tap(
          list => {
            this.missionList = list['missions'];
            return this.missionList;
          },
          () => catchError(this.handleError)
        ),
        map(() => this.missionList)
      );
  }

  getSelectedUser(): Observable<ISalesAgent> {
    if (this.selectedUser) {
      return Observable.of(this.selectedUser);
    }
    return Observable.of(salePerson);
  }

  getSelectedMissions(): Observable<Array<IMission>> {
    if (this.selectedMissions) {
      return Observable.of(this.selectedMissions);
    }
    return Observable.of(missionsReport['missions']);
  }

  getMeetingByMissisonIDs(ids: Array<number> ): Observable<Array<IMeeting>> {
    return Observable.of(MeetingByMissisonID['meetings']);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
