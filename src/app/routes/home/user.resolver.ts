import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { OktaAuthService, UserClaims } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<UserClaims> {
  constructor(private authService: OktaAuthService) { }
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<UserClaims> {
    return this.authService.getUser();
  }
}
