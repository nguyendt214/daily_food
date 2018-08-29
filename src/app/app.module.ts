import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { AuthenticationModule } from '@mu/authentication';
import { LoggerModule } from '@mu/logger';
import { environment } from '../environments/environment';

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
    AuthenticationModule.forRoot({
      sso_url: environment.sso_url,
      sso_realm: environment.sso_realm,
      client_id: environment.app_name,
      load_mode: environment.standalone ? 'login-required' : 'check-sso'
    }),
    LoggerModule.forRoot({
      appName: environment.app_name,
      apiURL: environment.mu_api,
      apiKey: environment.mu_api_key,
      appVersion: environment.version,
      reportHttp: true,
      reportRouting: true,
      writeToConsole: !environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
