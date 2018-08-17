import { Component, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: KeycloakProfile;

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.data);
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
  }

}
