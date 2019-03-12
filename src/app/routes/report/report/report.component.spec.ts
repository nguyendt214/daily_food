/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap';
import { userData } from '../../../../../tests/mock/user';
import { LocalStorageService } from '../../../shared/LocalStorage/local-storage.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ScoutService } from '../../home/home/service/scout.service';
import { NgxDatatablesFilterService } from '../../../shared/ngx-datatable-filter/service/ngx-datatable-filter.service';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';


const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['data']);
const data$ = of({ user: { username: 'nordnet' } });
activatedRouteSpy.data.and.returnValue(data$);

class ActivatedRouteMock {
  data = data$;
}

class ScoutServiceMock {
  public getSelectedUser() {
    return Observable.create(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  public getSelectedMissions() {
    return Observable.create(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  public getMeetingByMissisonIDs() {
    return Observable.create(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  public setSelectedMeeting(meeting): void {
  }
}

class MockRouter {
  navigateByUrl(url: string) { return url; }
}

describe('Component: Report', () => {

  let fixture: ComponentFixture<ReportComponent>;
  let component: ReportComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        ModalModule.forRoot()],
      declarations: [ReportComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                user: userData,
                isAdmin: true
              }
            }
          }
        },
        { provide: ActivatedRoute, useClass: ActivatedRouteMock },
        { provide: LocalStorageService, useClass: LocalStorageService },
        { provide: HttpTestingController },
        { provide: HttpClient },
        { provide: ScoutService, useClass: ScoutServiceMock },
        NgxDatatablesFilterService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
  });

});
