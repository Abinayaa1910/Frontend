import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SegmentDataService } from '../../services/segment-data.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './upload-page.html',
  styleUrls: ['./upload-page.css'],
})
export class UploadPageComponent implements OnDestroy {
  // Stores the file chosen by the user
  selectedFile: File | null = null;

  // Holds any error messages for the UI
  uploadError = '';

  // Controls the loading state (true = uploading)
  isLoading = false;

  // Stores form input values from the campaign details section
  campaignInputs = {
    objective: '',
    industry: '',
    funnelStage: '',
    pastEngagement: ''
  };

  // Index of the currently shown loading quote
  currentQuoteIndex = 0;

  // The actual quote object (text + author) being displayed
  currentQuote = { quote: '', author: '' };

  // Holds the reference to setInterval for rotating quotes
  quoteInterval: any;

  // List of quotes shown during the upload process
  loadingQuotes = [
    { quote: "“Good segmentation transforms data into action.”", author: "— AI Marketer" },
    { quote: "“Targeted messaging always wins over broad assumptions.”", author: "— Marketing Pro" },
    { quote: "“Smart campaigns start with smart clusters.”", author: "— Insight Genie" },
    { quote: "“The key to personalization is understanding your segments.”", author: "— Data Whisperer" },
    { quote: "“Clusters aren't just math, they're marketing magic.”", author: "— Anonymous" }
  ];

  constructor(
    private http: HttpClient,               // For API requests
    private router: Router,                  // For navigation
    private segmentService: SegmentDataService // For storing clusters and form data globally
  ) {}

  // Called when a file is selected
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const fileName = file.name.toLowerCase();

    //  Check file format
    if (!fileName.endsWith('.xlsx')) {
      this.uploadError = 'Invalid file format. Please upload a .xlsx file.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;

    //  Read the file headers to validate required columns
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target!.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const headers: string[] = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] as string[];

        const missing = [];
        if (!headers.some(h => /^date(_| |)joined$/i.test(h))) missing.push('Date Joined');
        if (!headers.some(h => /^location$/i.test(h))) missing.push('Location');
        if (!headers.some(h => /^loyalty(_| |)tier$/i.test(h))) missing.push('Loyalty Tier');

        if (missing.length) {
          this.uploadError = `Missing required columns: ${missing.join(', ')}`;
          this.selectedFile = null;
        } else {
          this.uploadError = '';
        }
      } catch (err) {
        this.uploadError = 'Error reading the file. Please ensure it is a valid .xlsx file.';
        this.selectedFile = null;
      }
    };
    reader.readAsBinaryString(this.selectedFile);
  }

  // Called when the user clicks the upload button
  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadError = '❗ Please choose a file before uploading.';
      return;
    }

    // Enable loading state
    this.isLoading = true;

    // Set the first quote immediately
    this.currentQuote = this.loadingQuotes[0];

    // Start rotating quotes without duplicates
    this.startQuoteRotation();

    // Clear previous error message
    this.uploadError = '';

    // Create form data object to send to backend
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('objective', this.campaignInputs.objective);
    formData.append('industry', this.campaignInputs.industry);
    formData.append('funnelStage', this.campaignInputs.funnelStage);
    formData.append('pastEngagement', this.campaignInputs.pastEngagement);

    // Send POST request to backend API
    this.http.post<any>(
      'http://localhost:5000/upload-excel',
      formData,
      { observe: 'response' }
    ).subscribe({
      next: (resp: HttpResponse<any>) => {
        console.log('✅ Upload response:', resp.status, resp.body);

        // Save clusters from backend
        this.segmentService.setClusters(resp.body.clusters || []);

        // Save campaign inputs for use in content generation
        this.segmentService.setFormData({
          objective: this.campaignInputs.objective,
          industry: this.campaignInputs.industry,
          marketing_funnel_stage: this.campaignInputs.funnelStage,
          past_engagement: this.campaignInputs.pastEngagement
        });
        console.log('📝 Saved formData:', this.segmentService.getFormData());

        // Stop loading
        this.isLoading = false;

        // Navigate to results page
        this.router.navigate(['/upload/results']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Upload error:', err);
        this.uploadError = `❌ Upload failed: ${err.status} ${err.statusText}`;
        this.isLoading = false;
      }
    });
  }

  // Disables the upload button if required inputs are missing
  get isUploadDisabled(): boolean {
    const c = this.campaignInputs;
    return !this.selectedFile
        || !c.objective.trim()
        || !c.industry.trim()
        || !c.funnelStage
        || !c.pastEngagement;
  }

  // Starts rotating quotes during upload
  startQuoteRotation(): void {
    // ✅ Clear any previous interval to prevent quote glitches
    clearInterval(this.quoteInterval);

    this.quoteInterval = setInterval(() => {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.loadingQuotes.length;
      this.currentQuote = this.loadingQuotes[this.currentQuoteIndex];
    }, 7000); // Change every 7 seconds
  }

  // Clears interval when component is destroyed
  ngOnDestroy(): void {
    clearInterval(this.quoteInterval);
  }
  
  // Capitalizes the first letter of a specific field
  autoCapitalizeField(field: keyof typeof this.campaignInputs): void {
    const val = this.campaignInputs[field];
    if (typeof val === 'string' && val.length > 0) {
      this.campaignInputs[field] = val.charAt(0).toUpperCase() + val.slice(1);
    }
  }
}
