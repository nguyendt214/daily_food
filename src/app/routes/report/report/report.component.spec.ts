/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';


const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['data']);
const data$ = of({ user: { username: 'nordnet' } });
activatedRouteSpy.data.and.returnValue(data$);

class ActivatedRouteMock {
  data = data$;
}

describe('Component: Report', () => {

  let fixture: ComponentFixture<ReportComponent>;
  let component: ReportComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }
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


  it('should display user', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const reportEl: DebugElement = fixture.debugElement;
      expect(reportEl.query(By.css('span')).nativeElement.textContent).toBe('Hi nordnet :)');
    });
  }));

});
