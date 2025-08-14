import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('Home', () => {
  let component: HomeComponent; // The component instance being tested
  let fixture: ComponentFixture<HomeComponent>; // Test wrapper for the component

  // Runs before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent] // Standalone component is imported directly
    })
    .compileComponents(); // Compiles the component's template and CSS

    // Create an instance of the component for testing
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // Trigger initial data binding and lifecycle hooks
    fixture.detectChanges();
  });

  // Simple creation test
  it('should create', () => {
    expect(component).toBeTruthy(); // Verifies the component is successfully created
  });
});
