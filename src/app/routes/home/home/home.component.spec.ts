/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
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

describe('Component: Home', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
  });


  it('should display user', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const homeEl: DebugElement = fixture.debugElement;
      expect(homeEl.query(By.css('span')).nativeElement.textContent).toBe('Hi nordnet :)');
    });
  }));

});
