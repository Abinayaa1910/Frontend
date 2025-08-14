import { Injectable } from '@angular/core';

/*
  SegmentDataService
  -------------------
  This service manages state between pages that involve segment-level operations,
  such as:
  - UploadResultsComponent (where all clusters are displayed)
  - SegmentEditorComponent (where individual cluster content is edited)

  It stores:
  - segment: the currently selected cluster segment
  - originalPost: the unedited version of the generated content
  - formData: campaign input form details
  - clusters: list of all generated clusters (shared across routes)
  - returnToResults: flag used for navigating back to the upload results page after editing
*/
@Injectable({ providedIn: 'root' })
export class SegmentDataService {
  private segment: any = null;             // Currently selected segment
  private originalPost: string = '';       // Original generated post before edits
  private formData: any = null;            // Campaign form input from user
  private clusters: any[] = [];            // List of clusters (stored in memory + localStorage)
  private returnToResults = false;         // Navigation flag to control back-routing

  // Allows routing logic to remember if user came from results page
  setReturnToResults(value: boolean): void {
    this.returnToResults = value; // <-- store in memory
    localStorage.setItem('returnToResults', value ? 'true' : 'false');
  }

  getReturnToResults(): boolean {
    // Read from memory first; fallback to localStorage
    const stored = localStorage.getItem('returnToResults');
    return stored === 'true' || this.returnToResults;
  }

  // Segment-level data (e.g., cluster persona and traits)
  setSegment(segment: any) {
    this.segment = segment;
  }

  getSegment() {
    return this.segment;
  }

  // Store the unedited version of the generated content
  setOriginalPost(post: string) {
    this.originalPost = post;
  }

  getOriginalPost() {
    return this.originalPost;
  }

  // Save and retrieve the full campaign form input
  setFormData(data: any) {
    this.formData = data;
  }

  getFormData() {
    return this.formData;
  }

  // Clear all temporary memory-based values
  clear() {
    this.segment = null;
    this.originalPost = '';
    this.formData = null;
  }

    // ✅ Clusters (all clusters)
  setClusters(clusters: any[]): void {
    this.clusters = clusters;
    localStorage.setItem('clusters', JSON.stringify(clusters));
  }

  getClusters(): any[] {
    if (this.clusters.length === 0) {
      const stored = localStorage.getItem('clusters');
      if (stored) {
        this.clusters = JSON.parse(stored);
      }
    }
    return this.clusters;
  }

}
