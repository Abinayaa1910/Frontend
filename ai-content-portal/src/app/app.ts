// app.component.ts

// This is the root component of the Angular application.
// It serves as the entry point and container for all routed views using <router-outlet>.
// The title property defines the project name and can be used for dynamic titles or headers.
// This component does not contain business logic and acts primarily as a shell for routing.

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ai-content-portal';
}
