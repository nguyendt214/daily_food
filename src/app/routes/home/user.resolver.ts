import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {
  constructor() { }
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<any> {
    return Promise.resolve(true);
  }
}
