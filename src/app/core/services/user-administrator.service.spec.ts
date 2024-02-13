import {TestBed} from '@angular/core/testing';

import {UserAdministratorService} from './user-administrator.service';

describe('UserAdministratorService', () => {
  let service: UserAdministratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAdministratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
