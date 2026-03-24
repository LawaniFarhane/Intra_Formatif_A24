import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { preferCatGuard } from './prefer-cat.guard';

describe('preferCatGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => preferCatGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
