import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { missionsMock } from '../../../../../../tests/mock/missions.mock';
import { IMission } from '../model/mission';

@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  constructor(private http: HttpClient) { }

  getMissions(): Observable<IMission> {
    return Observable.create(observer => {
      observer.next(missionsMock);
      observer.complete();
    });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
