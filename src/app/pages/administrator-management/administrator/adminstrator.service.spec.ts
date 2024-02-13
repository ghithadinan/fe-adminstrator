import {TestBed} from '@angular/core/testing';

import {AdministratorService} from '../../../core/services/administrator.service';

describe('administratorService', () => {
  let service: AdministratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
