import { TestBed } from '@angular/core/testing';

import { ExistingClientService } from './existing-client.service';

describe('ExistingClientService', () => {
  let service: ExistingClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExistingClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


