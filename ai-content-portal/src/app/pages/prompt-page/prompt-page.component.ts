import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { GenAIService } from '../../services/genai.services';
import { SharedData } from '../../services/shared-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  standalone: true, // Standalone component so it can be imported directly
  selector: 'app-prompt-page', // HTML tag for this component
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent], // Modules and child components used in this view
  templateUrl: './prompt-page.html', // Template file
  styleUrls: ['./prompt-page.css'] // Styles specific to this page
})
export class PromptPage implements OnInit {
  // Single source of truth for all form inputs bound via ngModel
  formData: any = {
    gender: '',
    location: '',
    loyalty_tier: '',
    join_year: '',
    join_month: '',
    objective: '',
    industry: '',
    marketing_funnel_stage: '',
    past_engagement: '',
    platform: '',
    post_type: '',
    tone: '',
    num_variants: 1
  };

  // Month list for the join month select
  months: string[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  // Year options are filled on init from current year down to 2010
  years: number[] = [];

  // UI flags and result holders used later in the flow
  isLoading: boolean = false;
  generatedPost: string[] = [];
  generatedTexts: string[] = [];
  generatedImages: string[] = [];
  combinedVariants: { text: string, image: string }[] = [];
  postType: string = '';
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // JS months are 0-based

  constructor(
    private genaiService: GenAIService, // Backend service to generate content
    private router: Router, // Router for page navigation
    private sharedDataService: SharedData // Shared store for passing data across routes
  ) {}

  // Populate year dropdown on component init
  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2010; y--) {
      this.years.push(y);
    }
  }

  // Form submit handler
  onSubmit(formRef: NgForm) {
    // If invalid, mark all controls as touched so errors show up
    if (formRef.invalid) {
      Object.values(formRef.controls).forEach(control => {
        control.markAsTouched();
      });
      return; // Stop if form is not valid
    }

    // Ensure numeric fields are numbers before storing
    this.formData.join_year = Number(this.formData.join_year);
    this.formData.num_variants = Number(this.formData.num_variants);
    this.postType = this.formData.post_type;

    // Persist form data for the loading page to pick up
    this.sharedDataService.setFormData(this.formData);

    // Navigate to the loading screen where the API call is performed
    this.router.navigate(['/loading']);

    // Reset any previous run state
    this.generatedPost = [];
    this.generatedTexts = [];
    this.generatedImages = [];
    this.combinedVariants = [];

    // Helpful debug log for the final payload
    console.log("📤 Final Form Payload:", JSON.stringify(this.formData, null, 2));
  }

  // Type guard helpers for rendering results
  isImageUrl(post: any): boolean {
    return typeof post === 'string' && post.startsWith('http');
  }

  isTextString(post: any): boolean {
    return typeof post === 'string' && !post.startsWith('http');
  }

  isImageTextObject(post: any): boolean {
    return typeof post === 'object' && post !== null && 'text' in post && 'image' in post;
  }

  // Client side image download helper
  downloadImage(url: string, filename: string) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
      })
      .catch(err => {
        console.error('❌ Download failed:', err);
        alert('Failed to download image.');
      });
  }

  // Small UX helper to capitalize the first letter of certain fields
  autoCapitalizeField(field: keyof typeof this.formData): void {
    const val = this.formData[field];
    if (typeof val === 'string' && val.length > 0) {
      this.formData[field] = val.charAt(0).toUpperCase() + val.slice(1);
    }
  }
}
