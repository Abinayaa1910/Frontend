import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SegmentDataService } from '../../services/segment-data.service';

/**
 * UploadResultsComponent
 * Displays clusters detected from the uploaded dataset and sends a selected cluster
 * plus the prepared form inputs to the Segment Editor screen.
 */
@Component({
  selector:   'app-upload-results',
  standalone: true, // Enables this component to be used without declaring it in an NgModule
  imports:    [CommonModule, RouterModule, NavbarComponent,FormsModule,], // Modules and components used in the template
  templateUrl:'./upload-results.html', // HTML template for the results view
  styleUrls:  ['../upload-page/upload-page.css','./upload-results.css'], // Reuse upload styles + page-specific styles
})
export class UploadResultsComponent implements OnInit {
  // List of clusters retrieved from the shared service after upload + processing
  clusters: any[] = [];

  // Optional storage for generated posts keyed by cluster id or name
  generatedPosts: { [key: string]: string } = {};

  constructor(
    private segmentService: SegmentDataService, // Shared data service for passing state across pages
    private router: Router // Used to navigate to the segment editor
  ) {}

  // Lifecycle hook: load clusters from the shared service when the page initializes
  ngOnInit(): void {
    this.clusters = this.segmentService.getClusters() || [];
  }

  /**
   * Triggered when the user chooses a cluster to work on.
   * Prepares a minimal form object using previously saved campaign inputs,
   * stores the current cluster and form into the shared service,
   * then navigates to the Segment Editor page.
   */
  generatePost(cluster: any): void {
    // Pull campaign-wide inputs that were captured during the upload flow
    const baseForm = this.segmentService.getFormData() || {};
    // baseForm is expected to include: objective, industry, marketing_funnel_stage, past_engagement

    // Build the full form shape expected by the editor
    const form = {
      platform: '',                 // Will be chosen in the editor
      post_type: 'Text',           // Default to Text output for now
      tone: '',                    // Let the editor set or refine tone
      num_variants: 1,             // Default to one variant
      past_engagement: baseForm.past_engagement,
      marketing_funnel_stage: baseForm.marketing_funnel_stage,
      industry: baseForm.industry,
      objective: baseForm.objective
    };

    // Persist the chosen cluster and related inputs so the editor can load them
    this.segmentService.setSegment(cluster);                 // Current target segment
    this.segmentService.setOriginalPost(cluster.default_post); // Optional seed content if present
    this.segmentService.setFormData(form);                   // Overwrite service formData with the full form
    this.segmentService.setClusters(this.clusters);          // Keep the full cluster list available

    // Navigate to the dedicated segment editor screen
    this.router.navigate(['/segment-editor']);
  }
}
