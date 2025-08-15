import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SegmentDataService } from '../../services/segment-data.service';
import { HttpClient } from '@angular/common/http';

// ---------------- Interface Definitions ----------------
// Structure for a generated variant (text, image, or both)
interface Variant {
  text?: string;
  image?: string;
  selectedTab?: 'text' | 'image';
}

@Component({
  standalone: true,
  selector: 'app-segment-editor',
  templateUrl: './segment-editor.html',
  styleUrls: ['./segment-editor.css'],
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule]
})
export class SegmentEditorComponent implements OnInit {

  // ---------------- Data & State ----------------
  segment: any = {};                            // Holds the current segment data
  originalGeneratedPost: string = '';           // Stores the default/original post text
  combinedVariants: Variant[] = [];             // Holds all generated variants from backend or mock
  showOriginalMessage = true;                   // Flag to toggle between original post and variants
  isLoading = false;                            // Flag for showing the loading spinner
  copiedIndex: number | null = null;            // Tracks which variant was last copied (for UI feedback)

  // Loading quotes for the spinner screen
  loadingQuotes: { quote: string; author: string }[] = [];
  currentQuoteIndex: number = 0;                // Index of the current displayed quote
  currentQuote: { quote: string; author: string } = { quote: '', author: '' };
  quoteInterval: any;                           // Reference to the interval timer for quotes

  // Form data (persisted from previous page via SegmentDataService)
  formData = {
    platform: '',
    post_type: 'Text',
    tone: '',
    num_variants: 1,
    objective: '',
    industry: '',
    marketing_funnel_stage: '',
    past_engagement: ''
  };

  // NEW: display-only snapshot so dropdown changes don't affect existing results
  viewPostType: 'Text' | 'Image' | 'Both' = 'Text';

  // ---------------- Constructor ----------------
  constructor(
    private http: HttpClient,                   // For backend API calls
    private route: ActivatedRoute,              // To access route parameters if needed
    private router: Router,                     // For navigation
    private segmentService: SegmentDataService  // Service to persist & retrieve data
  ) {}
  
  // ---------------- Lifecycle: OnInit ----------------
  ngOnInit(): void {
    // Retrieve segment and form data from service
    this.segment = this.segmentService.getSegment();
    this.formData = this.segmentService.getFormData() || this.formData;
    this.viewPostType = this.formData.post_type as any; // snapshot for display

    // If no segment data is found, prompt user to return
    if (!this.segment || !this.segment.default_post) {
      alert('Missing segment data. Please go back to upload page.');
      return;
    }

    // Store the original generated post for initial display
    this.originalGeneratedPost = this.segment.default_post;

    // Initially, no variants are displayed
    this.combinedVariants = [];
    this.showOriginalMessage = true;
    
    // Set up inspirational quotes shown during loading
    this.loadingQuotes = [
      { quote: "“Without data, you're just another person with an opinion.”", author: "— W. Edwards Deming" },
      { quote: "“In God we trust. All others must bring data.”", author: "— W. Edwards Deming" },
      { quote: "“AI is not a replacement, but a tool to amplify human creativity.”", author: "" },
      { quote: "“Data is a precious thing and will last longer than the systems themselves.”", author: "— Tim Berners-Lee" },
      { quote: "“Marketing without data is like driving with your eyes closed.”", author: "— Dan Zarrella" },
      { quote: "“The goal is to turn data into information, and information into insight.”", author: "— Carly Fiorina" },
      { quote: "“AI won’t replace marketers, but marketers using AI will.”", author: "" },
      { quote: "“Creativity is thinking up new things. Innovation is doing new things.”", author: "— Theodore Levitt" }
    ];

    // Show first quote and start rotation
    this.currentQuote = this.loadingQuotes[0];
    this.startQuoteRotation();
  }

  // ---------------- Lifecycle: OnDestroy ----------------
  ngOnDestroy(): void {
    clearInterval(this.quoteInterval); // Stop rotating quotes when leaving page
  }

  // ---------------- Quote Rotation ----------------
  startQuoteRotation(): void {
    this.quoteInterval = setInterval(() => {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.loadingQuotes.length;
      this.currentQuote = this.loadingQuotes[this.currentQuoteIndex];
    }, 10000); // Every 10 seconds
  }

  // ---------------- Navigation ----------------
  goBackToResults() {
    this.router.navigateByUrl('/upload/results'); // Navigate back to results page
  }

  // ---------------- Content Regeneration (Backend Call) ----------------
  regenerateContent(): void {
    this.isLoading = true; // Show loading spinner

    const segment = this.segmentService.getSegment();
    const form = this.segmentService.getFormData();

    // Abort if required data is missing
    if (!segment || !form) {
      alert('⚠️ Missing segment or form data.');
      this.isLoading = false;
      return;
    }

    // Build payload for backend API
    const payload = {
      persona_summary: segment.persona_summary,
      persona: segment.persona,
      platform: form.platform,
      post_type: form.post_type,
      tone: form.tone,
      num_variants: form.num_variants,
      objective: form.objective,
      industry: form.industry,
      marketing_funnel_stage: form.marketing_funnel_stage,
      past_engagement: form.past_engagement
    };

    // Send request to Flask backend
    this.http.post<any>('http://localhost:5000/generate-editor-post', payload).subscribe({
      next: (res) => {
        // Map response to variant format depending on post_type
        if (form.post_type === 'Text') {
          this.combinedVariants = res.variants.map((text: string) => ({
            text,
            selectedTab: 'text'
          }));
        } else if (form.post_type === 'Image') {
          this.combinedVariants = res.images.map((image: string) => ({
            image,
            selectedTab: 'image'
          }));
        } else if (form.post_type === 'Both') {
          this.combinedVariants = res.variants.map((text: string, i: number) => ({
            text,
            image: res.images[i],
            selectedTab: 'text'
          }));
        }

        // Update snapshot for display
        this.viewPostType = form.post_type as any;

        // Show variants instead of the original post
        this.showOriginalMessage = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Regeneration error:', err);
        alert('⚠️ Could not regenerate content.');
        this.isLoading = false;
      }
    });
  }

  // ---------------- Mock Variant Generation (No Backend) ----------------
  generateVariants(): void {
    const variants: Variant[] = [];
    for (let i = 0; i < this.formData.num_variants; i++) {
      variants.push({
        text: `Here’s your refined content for variant ${i + 1}, tailored for ${this.formData.platform} using a ${this.formData.tone.toLowerCase()} tone.`,
        image: this.formData.post_type !== 'Text' ? `https://source.unsplash.com/featured/?marketing,variant${i}` : undefined,
        selectedTab: this.formData.post_type === 'Both' ? 'text' : this.formData.post_type.toLowerCase() as 'text' | 'image'
      });
    }
    this.combinedVariants = variants;
    this.viewPostType = this.formData.post_type as any; // snapshot for mock results
    this.showOriginalMessage = false;
  }

  // ---------------- Download Handling ----------------
  downloadImage(url: string, filename: string) {
    // Use backend proxy route to download image
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
      // Create a download link dynamically
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl); // Clean up memory
    })
    .catch(err => {
      alert('Download failed: ' + err.message);
    });
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

      // show green flash
      this.downloadedIndex = index;
      setTimeout(() => {
        this.downloadedIndex = null;
      }, 2000);
    } catch (err) {
      console.error('Download failed', err);
    }
  }

  // ---------------- Clipboard Handling ----------------
  copyText(text: string, index: number) {
    navigator.clipboard.writeText(text).then(() => {
      // Store index for UI highlight
      this.copiedIndex = index;
      setTimeout(() => {
        this.copiedIndex = null;
      }, 2000);
    }).catch(err => {
      console.error('Copy failed', err);
      alert('Could not copy text');
    });
  }
}
