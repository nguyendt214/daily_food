/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthenticationService } from 'mu-sso-auth';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


const authSpy = jasmine.createSpyObj('AuthenticationService', ['loadUserProfile']);

authSpy.loadUserProfile.and.returnValue(of({ username: 'nordnet' }));

describe('Component: Home', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        {
          provide: AuthenticationService, useValue: authSpy
        }
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

  it('should load user', async(() => {
    expect(component.user).toBeUndefined();
    component.ngOnInit();
    expect(component.user).toBeDefined();
    expect(authSpy.loadUserProfile.calls.count()).toBe(1, 'loadUserProfile was called once');
    expect(component.user.username).toBe('nordnet');
  }));

  it('should display user', async(() => {
    component.ngOnInit();
    fixture.detectChanges();
    const homeEl: DebugElement = fixture.debugElement;
    expect(homeEl.query(By.css('span')).nativeElement.textContent).toBe('Bonjour nordnet :)');
  }));

});
