import { TestBed, async, inject } from '@angular/core/testing';

import { UserResolver } from './user.resolver';
import { AuthenticationService } from '@mu/authentication';
import { of } from 'rxjs';

const authSpy = jasmine.createSpyObj('AuthenticationService', ['loadUserProfile']);

authSpy.loadUserProfile.and.returnValue(of({ username: 'nordnet' }));


describe('UserResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        {
          provide: AuthenticationService, useValue: authSpy
        },
      ]
    });
  });

  it('should create user resolver', inject([UserResolver], (guard: UserResolver) => {
    expect(guard).toBeTruthy();
  }));

  it('should load user', async(() => {
    const userResolver = TestBed.get(UserResolver);
    userResolver.resolve().subscribe(user => {
      expect(authSpy.loadUserProfile.calls.count()).toBe(1, 'loadUserProfile was called once');
      expect(user.username).toBe('nordnet');
    });
  }));
});
