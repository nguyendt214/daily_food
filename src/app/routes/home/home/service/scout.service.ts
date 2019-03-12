import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { MeetingByMissisonID } from '../../../../../../tests/mock/MeetingByMissisonID.mock';
import { IMeeting } from '../model/meeting';
import { environment } from '../../../../../environments/environment';
import { IUser } from '../model/user';
import { IMission, Mission } from '../model/mission';

const API_URL = environment.direct_scout_api;
@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  missionList: Array<IMission>;
  selectedUser: IUser;
  selectedMissions: Array<Mission> = [];
  userList: Array<IUser>;
  currentMission: IMission;
  selectedMeeting: IMeeting;

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

  getSelectedUser(): Observable<IUser> {
    if (this.selectedUser) {
      return Observable.of(this.selectedUser);
    }
    return Observable.of(null);
  }

  getSelectedMissions(): Observable<Array<Mission>> {
    if (this.selectedMissions) {
      return Observable.of(this.selectedMissions);
    }
    return null;
  }

  getMeetingByMissisonIDs(ids: Array<number> ): Observable<Array<IMeeting>> {
    return Observable.of(MeetingByMissisonID['meetings']);
  }
  getCurrentMission(id: number) {
    return this.currentMission ? this.currentMission : this.missionList.find((ms: IMission) => {
      return ms.idMission === id;
    });
  }
  /**
   * Update/ Create Mission
   * @param data
   */
  missionCRUD(data: any) {
    let url = API_URL + '/users/' + data.username + '/missions';
    let request: any;
    if (data.action === 'ADD') {
      request = this.httpClient.post(url, data);
    } else {
      url += '/' + data.missionId;
      request = this.httpClient.put(url, data);
    }
    return request.pipe(
      tap(
        () => { },
        () => catchError(this.handleError)
      )
    );
  }
  /**
   * Get all Saler
   */
  getUsers(): Observable<Array<IUser>> {
    if (this.userList) {
      return Observable.of(this.userList);
    }
    const url = API_URL + '/users';
    return this.httpClient
      .get<Array<IUser>>(url)
      .pipe(
        tap(
          list => {
            this.userList = list['SalesPersons'];
            return this.userList;
          },
          () => catchError(this.handleError)
        ),
        map(() => this.userList)
      );
  }

  setSelectedMeeting(meeting: IMeeting): void {
    this.selectedMeeting = meeting;
  }

  getSelectedMeeting(): Observable<IUser> {
    if (this.selectedMeeting) {
      return Observable.of(this.selectedMeeting);
    }
    return null;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
