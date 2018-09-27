import { TestBed, async, inject } from '@angular/core/testing';

import { UserResolver } from './user.resolver';
import { of } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';

const authSpy = jasmine.createSpyObj('AuthenticationService', ['loadUserProfile']);

authSpy.getUser.and.returnValue(of({ email: 'test@nordnet.com' }));


describe('UserResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        {
          provide: OktaAuthService, useValue: authSpy
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
      expect(authSpy.getUser.calls.count()).toBe(1, 'getUser was called once');
      expect(user.username).toBe('test@nordnet.com');
    });
  }));
});
