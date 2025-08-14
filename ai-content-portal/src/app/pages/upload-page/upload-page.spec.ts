import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPageComponent } from './upload-page';

describe('UploadPage', () => {
  // Component instance for testing
  let component: UploadPageComponent;

  // Fixture is a wrapper that allows access to both the component instance and the rendered DOM
  let fixture: ComponentFixture<UploadPageComponent>;

  beforeEach(async () => {
    // Configure the testing module and import the standalone component
    await TestBed.configureTestingModule({
      imports: [UploadPageComponent]
    })
    .compileComponents(); // Compile the component's template and CSS

    // Create the component test fixture
    fixture = TestBed.createComponent(UploadPageComponent);

    // Get the instance of the component from the fixture
    component = fixture.componentInstance;

    // Trigger initial change detection so bindings and lifecycle hooks run
    fixture.detectChanges();
  });

  // Basic test to verify the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
