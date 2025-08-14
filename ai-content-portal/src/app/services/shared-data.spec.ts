import { TestBed } from '@angular/core/testing';
import { SharedData } from './shared-data';

/*
  Unit test for SharedData service
  --------------------------------
  This test ensures that the SharedData service can be successfully created
  and injected via Angular's dependency injection system.
*/

describe('SharedData', () => {
  let service: SharedData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // ✅ Basic creation test
  });
});
