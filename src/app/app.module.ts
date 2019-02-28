import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { LoggerModule } from '@mu/logger';
import { environment } from '../environments/environment';
import { OktaAuthModule } from '@okta/okta-angular';
import { MuHttpExtraModule } from '@mu/common';
import { MUInterceptorService } from './shared/HttpInterceptor/muinterceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule, // required for ng2-tag-input
    CoreModule,
    SharedModule.forRoot(),
    RoutesModule,
    OktaAuthModule.initAuth({
      issuer: environment.sso_url,
      clientId: environment.sso_client_id,
      redirectUri: environment.sso_redirect_uri,
    }),
    LoggerModule.forRoot({
      appName: environment.app_name,
      apiURL: environment.mu_api,
      apiKey: environment.mu_api_key,
      appVersion: environment.version,
      reportHttp: true,
      reportRouting: true,
      writeToConsole: !environment.production,
    }),
    MuHttpExtraModule.forRoot(environment.mu_api_key)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MUInterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
