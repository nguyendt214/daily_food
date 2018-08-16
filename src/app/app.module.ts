import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { SSOAuthModule } from 'mu-sso-auth';
import { environment } from '../environments/environment';

const packageInfo: any = require('../../package.json');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule, // required for ng2-tag-input
    CoreModule,
    SharedModule.forRoot(),
    RoutesModule,
    SSOAuthModule.forRoot({
      sso_url: environment.sso_url,
      sso_realm: environment.sso_realm,
      client_id: packageInfo.name,
      load_mode: 'login-required'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
