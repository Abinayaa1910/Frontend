# Frontend README

An Angular application that provides three primary flows:
1) Prompt input page to generate content from campaign inputs.
2) Upload page to send an Excel file, view detected clusters, and preview generated content.
3) Results page that displays inputs on the left, text output in the center, and image or other content on the right. A reusable loading component is used as a modal during generation.

---

## 1. Tech Stack
- Angular 17 or newer with standalone components
- TypeScript
- RxJS and Angular HttpClient
- Material Symbols or custom icon set
- AOS for scroll animations where applicable

---

## 2. Project Structure
```
frontend/
  src/
    app/
      components/
        navbar/
          navbar.component.ts
          navbar.component.html
          navbar.component.css
      pages/
        prompt-page/
          prompt-page.component.ts
          prompt-page.component.html
          prompt-page.component.css
        upload-page/
          upload-page.component.ts
          upload-page.component.html
          upload-page.component.css
        loading/
          loading.component.ts
          loading.component.html
          loading.component.css
        results-page/
          upload-results.ts
          upload-results.html
          upload-results.css
        segment-editor/
          segment-editor.component.ts
          segment-editor.component.html
          segment-editor.component.css
      services/
        shared-data.service.ts
        segment-data.service.ts
      app.routes.ts
    environments/
      environment.ts       # apiBaseUrl points at backend, e.g. http://localhost:5000
  package.json
  README.md
```

---

## 3. Prerequisites
- Node.js 18 or newer
- Angular CLI installed globally: npm i -g @angular/cli

---

## 4. Installation
```bash
cd frontend
npm install
```

---

## 5. Environment
Set the backend API base URL in src/environments/environment.ts:
```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000'
};
```
For production, create environment.prod.ts and configure the correct URL.

---

## 6. Running the App
```bash
npm start
# or
ng serve --open
```
The app usually runs at http://localhost:4200.

---

## 7. Key Routes and Flow
- /prompt collects campaign inputs and calls POST /generate-post or /generate-promo on the backend.
- /upload-page accepts Excel files, shows validation feedback, and sends them to POST /upload-excel.
- A modal-based loading component is invoked during backend calls, then the app navigates to /results-page.
- /results-page layout:
  - Left: form inputs snapshot
  - Center: editable text output
  - Right: image or other content

Back button story
Originally everything lived in the upload page. We split the results view into its own page for clarity and to preserve state via SegmentDataService. The shared service plus router navigation made the back button behave predictably and restored previous inputs when returning to the form.

---

## 8. Connecting to the Backend
Use environment.apiBaseUrl and Angular HttpClient to call the Flask endpoints. Example service method:
```ts
uploadExcel(file: File) {
  const form = new FormData();
  form.append('file', file);
  return this.http.post(`${environment.apiBaseUrl}/upload-excel`, form, {
    observe: 'response'
  });
}
```

---

## 9. Forms and Two-way Binding
Import FormsModule in any standalone component that uses [(ngModel)]:
```ts
imports: [CommonModule, FormsModule, RouterModule]
```
If you see NG8002: Can't bind to 'ngModelOptions' or similar, it usually means FormsModule is not imported in that component.

---

## 10. Build
```bash
# Development build
ng build

# Production build
ng build --configuration production
```

The generated files will be in dist/. Serve them with any static host or behind an Nginx reverse proxy. If you deploy as a single page app, configure a fallback to index.html for deep links.

---

## 11. Styling and UX
- Consistent card layout with clean spacing.
- Reusable loading component shows progress during API calls.
- Results page uses a three-part layout so users can compare inputs and outputs easily.
- Optional AOS animations for a modern feel, but keep motion subtle.

---

## 12. Common Issues
- CORS errors: ensure backend ALLOW_ORIGINS includes the frontend URL.
- File upload rejected: confirm file type and that required columns match backend expectations.
- [(ngModel)] not updating: verify name attribute on inputs and FormsModule import.
- Environment mismatches: check environment.ts vs production environment at build time.

---

## 13. Scripts
Add these to package.json if missing:
```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "lint": "ng lint",
    "test": "ng test"
  }
}
```

---

## 14. Deployment Notes
- Set apiBaseUrl to your production backend domain.
- Turn on production mode in Angular builds.
- Use HTTPS in production and align CORS settings on the backend.
- Consider a CDN for static assets.