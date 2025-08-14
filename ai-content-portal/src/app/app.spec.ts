// app.spec.ts

// This is the unit test file for the root App component.
// It uses Angular's testing utilities (TestBed) to verify core functionality.
// The first test ensures the App component is successfully created.
// The second test checks if the <h1> element renders the expected title text.
// These basic tests serve as sanity checks to confirm the root component is functioning.


import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ai-content-portal');
  });
});
