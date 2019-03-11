/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/LocalStorage/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { userData } from '../../../../../tests/mock/user';
import { NgxDatatablesFilterService } from '../../../shared/ngx-datatable-filter/service/ngx-datatable-filter.service';
import { Observable } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { MissionComponent } from './mission.component';
import { ScoutService } from '../../home/home/service/scout.service';
import { StaticService } from '../../../shared/statics/services/static.service';

class ScoutServiceMock {
  public getMissions() {
    return Observable.create(observer => {
      observer.next([]);
      observer.complete();
    });
  }
  public getUsers() {
    return Observable.create((observer: any) => {
      observer.next([]);
      observer.complete();
    });
  }
}
// Mock static service
class MockStaticService {
  oStatic = {
    constants: {
      fiberStatus: ['A']
    }
  };
  currentDate = new Date();
}

describe('Component: Home', () => {

  let fixture: ComponentFixture<MissionComponent>;
  let component: MissionComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [MissionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                user: userData,
                isAdmin: true
              },
              params: {
                action: 'test'
              }
            },
            params: Observable.of({ action: 'test' })
          }
        },
        { provide: Router },
        {
          provide: Router, useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        },
        { provide: LocalStorageService, useClass: LocalStorageService },
        { provide: HttpTestingController },
        { provide: HttpClient },
        { provide: ScoutService, useClass: ScoutServiceMock },
        { provide: StaticService, useClass: MockStaticService },
        NgxDatatablesFilterService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
