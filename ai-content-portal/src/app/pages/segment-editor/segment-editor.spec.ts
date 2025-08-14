import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegmentEditorComponent } from './segment-editor'; // ✅ Correct import for the standalone component

// ---------------- Test Suite ----------------
describe('SegmentEditorComponent', () => {

  // ---------------- Variables ----------------
  let component: SegmentEditorComponent;              // Component instance for testing
  let fixture: ComponentFixture<SegmentEditorComponent>; // Test fixture for handling component lifecycle

  // ---------------- Setup ----------------
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importing the standalone component directly (no declarations needed)
      imports: [SegmentEditorComponent]
    }).compileComponents();

    // Create the component fixture and instance
    fixture = TestBed.createComponent(SegmentEditorComponent);
    component = fixture.componentInstance;

    // Trigger initial change detection for the component
    fixture.detectChanges();
  });

  // ---------------- Tests ----------------
  it('should create', () => {
    // Check if the component instance is created successfully
    expect(component).toBeTruthy();
  });
});
