import { TestBed, async, inject } from '@angular/core/testing';

import { UserResolver } from './user.resolver';
import { OktaAuthService } from '@okta/okta-angular';

class OktaMock {
  getUser() {
    return new Promise(resolve => {
      return resolve({
        sub: '00uhc1w2vdNkctgzc0h7',
        email: 'ndotrong@pentalog.com',
        email_verified: true,
        firstname: 'ndotrong',
        lastname: 'KEVIN_BLACK',
        roles: ['role-netcommunication-admin', 'Role2'],
        groups: ['Everyone', 'MultiUnivers', 'role-netcommunication-admin']
      });
    });
  }
}
describe('UserResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        {
          provide: OktaAuthService, useClass: OktaMock
        },
      ]
    });
  });

  it('should create user resolver', inject([UserResolver], (guard: UserResolver) => {
    expect(guard).toBeTruthy();
  }));
});
