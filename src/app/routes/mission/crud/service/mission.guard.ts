import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ScoutService } from '../../../home/home/service/scout.service';
import 'rxjs/add/operator/take';
@Injectable()
export class MissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private scoutService: ScoutService
  ) { }
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.scoutService.getMissions().map(() => {
      const currentMission = this.scoutService.getCurrentMission(+route.params.id);
      if (!currentMission) {
        // Redirect to page list of mission
        this.router.navigate(['']);
      }
      return true;
    }).take(1);
  }
}
