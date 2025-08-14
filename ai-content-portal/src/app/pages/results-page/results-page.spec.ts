import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsComponent } from './results-page';

describe('ResultsPage', () => {
  let component: ResultsComponent;                 // Component instance for testing
  let fixture: ComponentFixture<ResultsComponent>; // Test fixture to access component & DOM

  beforeEach(async () => {
    // Configure the test environment for this component
    await TestBed.configureTestingModule({
      // Since ResultsComponent is standalone, it can be directly imported into the test module
      imports: [ResultsComponent]
    })
    .compileComponents(); // Compile the component and its template/styles

    // Create an instance of the component in the test environment
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;

    // Trigger initial data binding and lifecycle hooks
    fixture.detectChanges();
  });

  // Basic sanity test to check that the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
