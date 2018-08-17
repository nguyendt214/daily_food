import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'mu-sso-auth';
import { KeycloakProfile } from 'keycloak-js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: KeycloakProfile;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.loadUserProfile().subscribe(profile => {
      this.user = profile;
    });
  }

}
