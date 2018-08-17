import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from 'mu-sso-auth';

const authSpy = jasmine.createSpyObj('AuthenticationService', ['login', 'isAuthenticated']);
authSpy.login.and.returnValue(Promise.resolve(true));
authSpy.isAuthenticated.and.returnValue(true);

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthenticationService, useValue: authSpy
        }]
    });
  });

  it('should create guard', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should authenticate user', async(() => {
    const guard = TestBed.get(AuthGuard);
    guard.canActivate().then(auth => {
      expect(auth).toBe(true);
    });
  }));
});
