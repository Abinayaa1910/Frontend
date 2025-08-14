// ==========================
// Spec File: navbar.component.spec.ts
// Purpose: Unit test for NavbarComponent
// Notes: Uses Angular TestBed for standalone component testing
// ==========================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  // Component instance and test fixture
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  // ==========================
  // Setup before each test case
  // ==========================
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since NavbarComponent is standalone, we import it directly
      imports: [NavbarComponent]
    })
    .compileComponents(); // Compile the component template & CSS

    // Create a test fixture (wrapper) for the component
    fixture = TestBed.createComponent(NavbarComponent);

    // Extract the actual component instance
    component = fixture.componentInstance;

    // Trigger Angular's change detection to render template
    fixture.detectChanges();
  });

  // ==========================
  // Test Cases
  // ==========================

  // ✅ Checks if the NavbarComponent is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
