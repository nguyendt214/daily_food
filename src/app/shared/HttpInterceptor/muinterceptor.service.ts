import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpinnerService } from '../spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class MUInterceptorService implements HttpInterceptor {
  constructor(
    private spinnerService: SpinnerService
  ) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerService.show();
    return next.handle(req).pipe(
      tap(
        () => { },
        () =>
          this.spinnerService.hide(),
        () => this.spinnerService.hide()
      )
    );
  }
}
