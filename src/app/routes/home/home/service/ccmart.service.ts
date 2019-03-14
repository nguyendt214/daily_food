import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { environment } from '../../../../../environments/environment';
import { IUser } from '../model/user';
import { productData } from '../../../../../../tests/mock/products';
import { IProduct } from '../model/product';

const API_URL = environment.mu_api;
@Injectable({
  providedIn: 'root'
})
export class CcmartService {
  users: Array<IUser>;

  constructor(private httpClient: HttpClient) { }

  getInfo(): Observable<Array<any>> {
    const url = API_URL + 'getInfo';
    return this.httpClient
      .get<Array<any>>(url)
      .pipe(
        tap(
          list => {
            return list;
          }
        )
      );
  }
  getProducts(): Observable<Array<IProduct>> {
    return Observable.of(productData);
  }
}
