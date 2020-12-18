import { TestBed } from '@angular/core/testing';

import { BetappService } from './betapp.service';

describe('BetappService', () => {
  let service: BetappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
