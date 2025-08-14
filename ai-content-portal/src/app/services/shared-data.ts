import { Injectable } from '@angular/core';
/*
  SharedData Service
  -------------------
  This service is used in the main prompt generation flow to temporarily store
  data across components such as PromptPage, LoadingComponent, and ResultsComponent.

  It stores:
  - formData: user campaign input (e.g. objective, industry, funnel stage, engagement)
  - generatedResult: the AI-generated content (text, image, or both) returned by the backend
*/

@Injectable({
  providedIn: 'root'
})
export class SharedData {
  private formData: any;
  private generatedResult: any;

  constructor() {}

  setFormData(data: any) {
    this.formData = data;
  }

  getFormData(): any {
    return this.formData;
  }

  setGeneratedResult(result: any) {
    this.generatedResult = result;
  }

  getGeneratedResult(): any {
    return this.generatedResult;
  }
}
