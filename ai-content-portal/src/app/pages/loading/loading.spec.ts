import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading';

describe('Loading', () => {
  // Component instance we are testing
  let component: LoadingComponent;

  // Test fixture: wrapper that allows interaction with the component in a test environment
  let fixture: ComponentFixture<LoadingComponent>;

  // Runs before each test case
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since LoadingComponent is standalone, we import it directly here
      imports: [LoadingComponent]
    })
    .compileComponents(); // Compiles component template and CSS for testing

    // Create a new fixture and instance of the component for each test
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;

    // Trigger Angular's change detection so bindings and lifecycle hooks run
    fixture.detectChanges();
  });

  // Basic creation test: checks that the component instance exists
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
