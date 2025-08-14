import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
  This service is used to communicate with the Flask backend to generate promotional content.
  It sends a POST request to the /generate-promo endpoint with the user input data.
*/

@Injectable({
  providedIn: 'root' // This makes the service available throughout the app without needing to add it to a module's providers
})
export class GenAIService {
  private apiUrl = 'http://localhost:5000/generate-promo'; // Flask backend endpoint for promo generation

  constructor(private http: HttpClient) {}

  // Sends the user input to the backend and returns the generated content as an Observable
  generatePromo(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
