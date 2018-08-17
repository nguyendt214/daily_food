import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakProfile } from 'keycloak-js';
import { AuthenticationService } from 'mu-sso-auth';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<KeycloakProfile> {
  constructor(private authService: AuthenticationService) { }
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<KeycloakProfile> {
    return this.authService.loadUserProfile();
  }
}
