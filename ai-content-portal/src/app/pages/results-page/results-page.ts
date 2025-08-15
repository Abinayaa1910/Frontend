import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SharedData } from '../../services/shared-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';

// Interface for each variant of generated content
interface Variant {
  text?: string;                      // Optional text content
  image?: string;                     // Optional image content
  selectedTab?: 'text' | 'image';      // Currently active tab for this variant
}

@Component({
  standalone: true,                   // Standalone Angular component
  selector: 'app-results',            // Component selector
  templateUrl: './results-page.html', // HTML template
  styleUrls: ['./results-page.css'],  // CSS styles
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent] // Imported modules/components
})
export class ResultsComponent implements OnInit {
  // ====== State Variables ======
  isLoading: boolean = true;          // Whether loading screen is visible
  formData: any = {};                  // User input data retrieved from shared service
  generatedResult: any;                // Full generated result from backend
  generatedImages: string[] = [];      // Stores generated images only
  generatedTexts: string[] = [];       // Stores generated texts only
  combinedVariants: Variant[] = [];    // Unified list of variants (text, image, or both)
  formKeys: string[] = [];             // Keys from the formData object
  postType: string = '';               // 'Text', 'Image', or 'Both'

  // Month and year dropdowns for membership info
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];

  // Loading screen quotes displayed during processing
  loadingQuotes = [
    { quote: "“Without data, you're just another person with an opinion.”", author: "— W. Edwards Deming" },
    { quote: "“AI is not a replacement, but a tool to amplify human creativity.”", author: "— Anonymous" },
    { quote: "“Marketing without data is like driving with your eyes closed.”", author: "— Dan Zarrella" },
    { quote: "“The goal is to turn data into information, and information into insight.”", author: "— Carly Fiorina" }
  ];
  currentQuoteIndex = 0;                // Current quote index
  currentQuote = this.loadingQuotes[0]; // Quote currently displayed
  quoteInterval: any;                   // Interval timer reference for rotating quotes

  constructor(private sharedData: SharedData, private router: Router) {}

  ngOnInit(): void {
    // Populate the 'years' dropdown with the last 10 years
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    // Get stored form data and generated results from the shared data service
    this.formData = this.sharedData.getFormData();
    const fullResponse = this.sharedData.getGeneratedResult();

    // If no form data or results exist, redirect user back to prompt page
    if (!this.formData || !fullResponse) {
      console.warn("❌ Missing data in ResultsComponent");
      this.router.navigate(['/prompt']);
      return;
    }

    // Extract post type and generated results
    this.postType = this.formData?.post_type || '';
    this.generatedResult = fullResponse.generated_result || [];
    this.formKeys = Object.keys(this.formData || {});

    // Format backend response into a unified combinedVariants list
    if (this.postType.toLowerCase() === 'text') {
      // Text-only: wrap each text string in a variant object
      this.combinedVariants = this.generatedResult.map((text: string) => ({
        text,
        selectedTab: 'text'
      }));
    } else if (this.postType.toLowerCase() === 'image') {
      // Image-only: wrap each image URL in a variant object
      this.combinedVariants = this.generatedResult.map((image: string) => ({
        image,
        selectedTab: 'image'
      }));
    } else {
      // Both text and image: keep structure and decide initial selected tab
      this.combinedVariants = this.generatedResult.map((variant: any) => {
        let selectedTab: 'text' | 'image' = 'text';
        if (!variant.text && variant.image) selectedTab = 'image';
        return { ...variant, selectedTab };
      });
    }

    // Start rotating loading screen quotes
    this.startQuoteRotation();

    // Hide loading screen after short delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);

    console.log('✅ Result Data:', this.generatedResult);
    console.log('📝 Post Type:', this.postType);
  }

  // Rotates through the loading quotes every 10 seconds
  startQuoteRotation(): void {
    this.quoteInterval = setInterval(() => {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.loadingQuotes.length;
      this.currentQuote = this.loadingQuotes[this.currentQuoteIndex];
    }, 10000);
  }

  // Stop rotating quotes when component is destroyed
  ngOnDestroy(): void {
    clearInterval(this.quoteInterval);
  }

  // Called when user clicks "Regenerate" button
  onResubmit() {
    this.isLoading = true; // Show loading screen

    // Store updated form data
    this.sharedData.setFormData(this.formData);

    const payload = {
      ...this.formData // Send all current form fields to backend
    };

    this.postType = this.formData?.post_type || '';

    // Call backend API to regenerate content
    fetch('http://localhost:5000/generate-promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        this.generatedResult = data.generated_result || [];

        // Format the new results just like in ngOnInit()
        if (this.postType.toLowerCase() === 'text') {
          this.combinedVariants = this.generatedResult.map((text: string) => ({
            text,
            selectedTab: 'text'
          }));
        } else if (this.postType.toLowerCase() === 'image') {
          this.combinedVariants = this.generatedResult.map((image: string) => ({
            image,
            selectedTab: 'image'
          }));
        } else {
          this.combinedVariants = this.generatedResult.map((variant: any) => {
            let selectedTab: 'text' | 'image' = 'text';
            if (!variant.text && variant.image) selectedTab = 'image';
            return { ...variant, selectedTab };
          });
        }

        this.isLoading = false; // Hide loading screen
      })
      .catch(error => {
        console.error('❌ Error during regeneration:', error);
        alert('Failed to regenerate content.');
        this.isLoading = false;
      });
  }

  // Downloads image from backend via proxy endpoint
  downloadImage(url: string, filename: string) {
    fetch(`http://localhost:5000/api/proxy-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, name: filename })
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.blob();
      })
      .then(blob => {
        // Create a temporary link to trigger download
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl); // Free memory
      })
      .catch(err => alert('Download failed: ' + err));
  }
  downloadedIndex: number | null = null;

  async handleDownload(imageUrl: string, filename: string, index: number) {
    if (!imageUrl) return;

    try {
      const res = await fetch('http://localhost:5000/api/proxy-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, name: filename })
      });

      if (!res.ok) throw new Error(res.statusText);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // flash green after saving
      this.downloadedIndex = index;
      setTimeout(() => {
        this.downloadedIndex = null;
      }, 2000);
    } catch (err) {
      console.error('Download failed', err);
    }
  }

  copiedIndex: number | null = null; // Stores index of variant whose text was just copied

  // Copies given text to clipboard and shows "Copied!" state
  copyText(text: string | undefined, index: number) {
    if (!text) return; // Do nothing if no text provided
    navigator.clipboard.writeText(text).then(() => {
      this.copiedIndex = index;
      // Reset "Copied!" state after 2 seconds
      setTimeout(() => (this.copiedIndex = null), 2000);
    }).catch(err => {
      console.error('Copy failed', err);
      alert('Could not copy text');
    });
  }

  // Auto-capitalizes first letter of a specific field
  autoCapitalizeField(field: 'location' | 'objective' | 'industry') {
    const val = this.formData[field];
    if (val && typeof val === 'string') {
      this.formData[field] = val.charAt(0).toUpperCase() + val.slice(1);
    }
  }
}
