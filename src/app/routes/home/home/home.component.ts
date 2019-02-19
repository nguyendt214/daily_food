import { Component, OnInit } from '@angular/core';
import { UserClaims } from '@okta/okta-angular';
import { ActivatedRoute } from '@angular/router';
import { ScoutService } from './service/scout.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
@AutoUnsubscribe()
export class HomeComponent implements OnInit {

  user: UserClaims;
  private apiSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private scoutService: ScoutService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
    this.apiSub = this.scoutService.getMissions().subscribe(
      missions => {
        console.log(missions);

      }, error => {
        console.log(error);

      }
    );
  }

}
