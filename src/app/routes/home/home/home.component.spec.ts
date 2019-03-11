/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { LocalStorageService } from '../../../shared/LocalStorage/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { userData } from '../../../../../tests/mock/user';
import { NgxDatatablesFilterService } from '../../../shared/ngx-datatable-filter/service/ngx-datatable-filter.service';
import { Observable } from 'rxjs/Observable';
import { ScoutService } from './service/scout.service';
import { SharedModule } from '../../../shared/shared.module';


const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['data']);
const data$ = of({ user: { username: 'nordnet' } });
activatedRouteSpy.data.and.returnValue(data$);

class ActivatedRouteMock {
  data = data$;
}
class ScoutServiceMock {
  public getMissions() {
    return Observable.create(observer => {
      observer.next([]);
      observer.complete();
    });
  }
}

describe('Component: Home', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ModalModule.forRoot()],
      declarations: [HomeComponent],
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
        { provide: Router },
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
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
