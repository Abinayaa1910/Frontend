import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GenAIService } from '../../services/genai.services';
import { SharedData } from '../../services/shared-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  standalone: true, // This is a standalone component (no need for NgModule declarations)
  selector: 'app-loading', // Component selector for use in HTML
  templateUrl: './loading.html', // HTML template for the loading screen
  styleUrls: ['./loading.css'], // CSS styles for this component
  imports: [NavbarComponent] // Navbar is displayed at the top of the loading page
})
export class LoadingComponent implements OnInit, OnDestroy {

  // Tracks the currently displayed quote index
  currentQuoteIndex = 0;

  // The quote currently displayed to the user
  currentQuote: { quote: string; author: string } = { quote: '', author: '' };

  // Reference to the setInterval so it can be cleared later
  quoteInterval: any;

  // Array of motivational/loading quotes
  loadingQuotes = [
    { quote: "“Good marketing makes the company look smart. Great marketing makes the customer feel smart.”", author: "— Joe Chernov" },
    { quote: "“The best content doesn’t just inform, it inspires action.”", author: "— Ann Handley" },
    { quote: "“AI is not here to replace marketers, it’s here to empower them.”", author: "— Paul Roetzer" },
    { quote: "“Your most unhappy customers are your greatest source of learning.”", author: "— Bill Gates" },
    { quote: "“Data beats opinion every single time.”", author: "— Jeff Weiner" },
    { quote: "“Creativity without data is just art. Data without creativity is just numbers.”", author: "— Unknown" }
  ];

  constructor(
    private router: Router, // For navigation between routes
    private genaiService: GenAIService, // Service that calls backend AI API
    private sharedDataService: SharedData // Service for passing data between components
  ) {}

  /**
   * Lifecycle hook - runs when the component initializes
   * 1. Starts rotating motivational quotes
   * 2. Retrieves form data from SharedData
   * 3. If missing data, redirect to prompt page
   * 4. Calls backend to generate content, then redirects to results page
   */
  ngOnInit() {
    // Set initial quote and start rotation
    this.currentQuote = this.loadingQuotes[0];
    this.startQuoteRotation();

    // Retrieve form data from shared service
    const formData = this.sharedDataService.getFormData();

    if (!formData) {
      alert('Missing form data');
      this.router.navigate(['/prompt-page']);
      return;
    }

    // Call backend API to generate promotional content
    this.genaiService.generatePromo(formData).subscribe({
      next: (res) => {
        // Store generated result for use in results page
        this.sharedDataService.setGeneratedResult(res);
        // Navigate to results page
        this.router.navigate(['/results-page']);
      },
      error: (err) => {
        console.error('Error generating promo:', err);
        alert('Something went wrong. Please try again.');
        // Navigate back to prompt page
        this.router.navigate(['/prompt-page']);
      }
    });
  }

  /**
   * Starts rotating through quotes every 10 seconds
   */
  startQuoteRotation(): void {
    this.quoteInterval = setInterval(() => {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.loadingQuotes.length;
      this.currentQuote = this.loadingQuotes[this.currentQuoteIndex];
    }, 10000);
  }

  /**
   * Lifecycle hook - runs when the component is destroyed
   * Clears the quote rotation interval to prevent memory leaks
   */
  ngOnDestroy(): void {
    clearInterval(this.quoteInterval);
  }  
}
