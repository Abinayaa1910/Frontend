import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromptPage } from './prompt-page.component';

describe('PromptPage', () => {
  // Holds the component instance for testing
  let component: PromptPage;

  // Wrapper that allows interacting with the component in tests
  let fixture: ComponentFixture<PromptPage>;

  // Runs before each test in this suite
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since PromptPage is a standalone component, it can be imported directly
      imports: [PromptPage]
    })
    .compileComponents(); // Compiles HTML and CSS for the component

    // Create the component test fixture and instance
    fixture = TestBed.createComponent(PromptPage);
    component = fixture.componentInstance;

    // Trigger Angular’s change detection to update bindings and run lifecycle hooks
    fixture.detectChanges();
  });

  // Basic unit test to confirm the component was created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
