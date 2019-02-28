import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IMission } from '../model/mission';
import { environment } from '../../../../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/of';

const API_URL = environment.direct_scout_api;
@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  missionList: Array<IMission>;

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

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
