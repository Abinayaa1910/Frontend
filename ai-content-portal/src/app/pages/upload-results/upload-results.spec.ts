import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadResultsComponent } from './upload-results';

describe('UploadResultsComponent', () => {
  let component: UploadResultsComponent; // Component instance for testing
  let fixture: ComponentFixture<UploadResultsComponent>; // Fixture to access component & DOM

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since UploadResultsComponent is standalone, it can be imported directly here
      imports: [UploadResultsComponent]
    }).compileComponents(); // Compiles template & CSS

    // Create the component instance and associated fixture
    fixture = TestBed.createComponent(UploadResultsComponent);
    component = fixture.componentInstance;

    // Trigger Angular change detection so bindings/templates are updated
    fixture.detectChanges();
  });

  // Basic sanity test to ensure the component instance is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
