/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IdentityServiceService } from './IdentityService.service';

describe('Service: IdentityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdentityServiceService]
    });
  });

  it('should ...', inject([IdentityServiceService], (service: IdentityServiceService) => {
    expect(service).toBeTruthy();
  }));
});
