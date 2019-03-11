import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IStatic } from '../models/static';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import { Response, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpResponse } from 'selenium-webdriver/http';
import { resolve } from 'dns';
const API_URL = environment.direct_scout_api;
@Injectable({
  providedIn: 'root'
})
export class StaticService {
  oStatic: IStatic;
  currentDate: any;
  constructor(
    private httpClient: HttpClient
  ) { }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  init() {
    if (this.oStatic) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise<IStatic>(resolve => {
        resolve(this.oStatic);
      });
    }
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise<IStatic>((resolve, reject) => {
      const url = API_URL + '/_statics';
      this.httpClient
        .get<IStatic>(url, { observe: 'response' })
        .map((res) => {
          this.setCurrentDate(res.headers.get('date'));
          return res.body;
        })
        .toPromise()
        .then(
          (o: IStatic) => {
            this.oStatic = o;
            resolve(this.oStatic);
          }
        ).catch(error => {
          this.handleError(error);
          reject();
        });
    });
  }

  setCurrentDate(responseDate: string) {
    const date = moment(new Date(responseDate));
    this.currentDate = date.isValid() ? date : moment();
  }
}
