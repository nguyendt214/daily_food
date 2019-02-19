import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerState } from './spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new Subject<SpinnerState>();
  public spinnerState = this.spinnerSubject.asObservable();
  constructor() { }
  public show() {
    this.spinnerSubject.next(<SpinnerState> { show : true });
  }
  public hide() {
    this.spinnerSubject.next(<SpinnerState> { show : false });
  }
}
