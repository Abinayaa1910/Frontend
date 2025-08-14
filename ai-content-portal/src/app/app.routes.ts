// Routes config: maps URLs to components — includes upload flow, prompt flow, static pages (FAQ, contact), and fallback to home.
import { Routes } from '@angular/router';

import { HomeComponent }          from './pages/home/home.component';
import { PromptPage }             from './pages/prompt-page/prompt-page.component';
import { UploadPageComponent }    from './pages/upload-page/upload-page';
import { LoadingComponent }       from './pages/loading/loading';
import { ResultsComponent }       from './pages/results-page/results-page';
import { SegmentEditorComponent } from './pages/segment-editor/segment-editor';
import { UploadResultsComponent } from './pages/upload-results/upload-results';

export const routes: Routes = [
  // 1) Home 
  { path: '',               component: HomeComponent,          pathMatch: 'full' },

  // 2) Your three-step flow
  { path: 'upload/results', component: UploadResultsComponent },
  { path: 'upload',         component: UploadPageComponent,     pathMatch: 'full' },
  { path: 'segment-editor', component: SegmentEditorComponent },

  // 3) Any other explicit pages
  { path: 'loading',        component: LoadingComponent },
  { path: 'results-page',   component: ResultsComponent },
  { path: 'prompt',         component: PromptPage },



  // 4) Fallback: everything else → home
  { path: '**',             redirectTo: '',                   pathMatch: 'full' }
];
