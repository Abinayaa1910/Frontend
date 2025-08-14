import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common'; //  Needed to use *ngIf in the HTML template
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar', // Component selector used in HTML
  standalone: true, // Allows this component to be used without being declared in a module
  imports: [RouterModule, NgIf], // Required modules for routing and conditional rendering
  templateUrl: './navbar.html', // HTML structure for the navbar
  styleUrl: './navbar.css' // Styling for the navbar
})
export class NavbarComponent {
   constructor(public router: Router) {}

  isDropdownOpen = false; // Controls whether the dropdown menu is visible
  
   //Toggles the dropdown menu's visibility
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  //Scrolls smoothly to a section of the current page by its element ID 
  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Scrolls to the top of the page.
   * - If the user is not on the homepage, navigates to the homepage first and then scrolls.
   * - If already on the homepage, scrolls immediately.
   */
  scrollToTop(): void {
    if (this.router.url !== '/') {
      // Navigate to homepage first, then scroll to top
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100); // wait for navigation to complete
      });
    } else {
      // Already on homepage, just scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  //Listens for clicks anywhere on the document.
   //If a click occurs outside the dropdown, it closes the dropdown menu.
  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event): void {
    const clickedInside = (event.target as HTMLElement).closest('.dropdown');
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}
