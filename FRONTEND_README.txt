AI CONTENT PORTAL FRONTEND - README

1. SYSTEM OVERVIEW
This repository contains the Angular frontend for the AI Content Portal. It connects to a separate Python Flask backend that handles AI content generation, clustering, and persona creation.

The application has two main workflows starting from the home page:

Workflow 1: Smart Form Flow
1) Home page  entry point of the application, links to prompt input form
2) Prompt page  user completes form with campaign inputs
3) Loading page  modal showing progress while backend generates content
4) Results page  displays generated content with editing and refinement tools

Workflow 2: Upload Dataset Flow
1) Home page  entry point of the application, links to dataset upload
2) Upload page  user uploads Excel dataset for clustering
3) Upload results page  displays list of clusters or segments with generated content
4) Segment editor  allows editing and personalization for a specific segment

The backend must be running before starting the frontend.
Backend repository link  insert backend repo link here


2. TECH STACK
• Angular 20 with standalone components
• TypeScript
• RxJS and Angular HttpClient
• Material Symbols or custom icon set
• Optional AOS for scroll animations
• XLSX for Excel handling


3. ROOT REPOSITORY LAYOUT
• src/                         Angular application source
• public/                      Static assets
• api/                         optional Node Express helper server for local proxy or mock
• node_modules/                installed dependencies
• angular.json                 Angular workspace configuration
• tsconfig.json                base TypeScript config
• tsconfig.app.json            app TypeScript config
• tsconfig.spec.json           test TypeScript config
• package.json                 scripts and dependencies
• package-lock.json            NPM lockfile
• styles.css                   global styles
• .editorconfig                editor defaults
• .gitignore                   git ignore rules
• FRONTEND_README.  documentation files
• packages.txt                 list of packages


4. FRONTEND PROJECT STRUCTURE  DETAILED

src/
  index.html                  root HTML template for Angular app
  main.ts                     Angular bootstrap file
  styles.css                  global styles

  app/
    app.config.ts             application level configuration and providers
    app.routes.ts             Angular route definitions
    app.html                  root shell template
    app.css                   optional top level styles
    app.spec.ts               optional test for app root
    custom-reuse-strategy.ts  custom routing reuse strategy
    aos.d.ts                  type declarations for AOS animations
    custom-typings/           folder for custom type declarations
    assets/                   images and static assets

    components/
      navbar/
        navbar.component.ts   logic for top navigation bar
        navbar.component.html HTML layout for navbar
        navbar.component.css  styles for navbar

    pages/
      home/
        home.component.ts     logic for main entry page
        home.component.html   layout for main navigation options
        home.component.css    styles for home page

      prompt-page/
        prompt-page.component.ts   logic for Workflow 1 first step  Smart Form
        prompt-page.component.html layout for campaign input form
        prompt-page.component.css  styles for prompt form

      loading/
        loading.component.ts       logic for loading modal
        loading.component.html     layout for spinner or progress bar
        loading.component.css      styles for loading modal
        used in both workflows to show API call progress

      results-page/
        results-page.component.ts  logic for Workflow 1 final page  editable content
        results-page.component.html layout showing
                                     Left   snapshot of Smart Form inputs
                                     Right  generated image or other content, editable text content
        results-page.component.css styles for results page

      upload-page/
        upload-page.component.ts   logic for Workflow 2 first step  dataset upload
        upload-page.component.html layout for Excel file upload and validation
        upload-page.component.css  styles for upload form

      upload-results/
        upload-results.component.ts  logic for Workflow 2 results page
                                      displays list of segments and generated content per segment
        upload-results.component.html layout showing
                                       Left   segment list and filters
                                       Right  utilities or actions and selected segment content
        upload-results.component.css styles for upload results page

      segment-editor/
        segment-editor.component.ts   logic for refining or personalizing content for a selected segment
        segment-editor.component.html layout for editing text or image for the selected segment
        segment-editor.component.css  styles for segment editor page

    services/
      genai.services.ts           service used for backend API calls
                                   note  since there is no environment.ts, the base URL is usually defined here
                                   update the base URL or use relative paths that point to Flask app.py
      segment-data.service.ts     service for managing segment editor state
      shared-data.service.ts      service for sharing data between pages
      shared-data.spec.ts         unit test for shared data service


5. PREREQUISITES
• Node.js 18 or newer
• Angular CLI installed globally
  npm install -g @angular/cli


6. INSTALLATION

Method 1  install from ZIP of the original repo
1) Download the ZIP of the original frontend repo.
2) Extract it to a folder, for example C:\Projects\ai-content-portal.
3) Open a terminal in the extracted folder.
4) Decide whether to cd into ai-content-portal:
   - If you see a folder named ai-content-portal, run:
       cd ai-content-portal
   - If you already see package.json and angular.json in the current folder, stay here.
   - Quick check:
       dir package.json angular.json
     Both files should be listed.
5) Install dependencies:
   npm install
6) Start the app:
   npm run dev    OR    npm start    OR    ng serve --open

Method 2  install from the duplicated Git repo used for testing
1) Clone the test repo:
   git clone https://github.com/Abinayaa1910/Frontend.git 
2) Go into the project folder:
   cd frontend
3) Decide whether to cd into ai-content-portal:
   - If you see a folder named ai-content-portal, run:
       cd ai-content-portal
   - If package.json and angular.json are already in the current folder, do not cd further.
   - Quick check:
       dir package.json angular.json
4) Install dependencies:
   npm ci    OR    npm install
   - If npm ci complains about the lockfile, run npm install once to refresh it.
5) Start the app:
   npm run dev    OR    npm start    OR    ng serve --open

Default app URL
http://localhost:4200


7. RUN
Pick one:
• npm run dev            does install then serves, if you added a dev script
• npm ci && ng serve     clean install then serve
• npm start              same as ng serve
• ng serve --open
App runs at http://localhost:4200


8. BACKEND CONNECTION
Backend should run at http://localhost:5000
Frontend calls:
• POST /generate-promo or POST /generate-post
• POST /upload-excel
If you use an absolute base URL, set it inside genai.services.ts. If you use relative paths, ensure the dev proxy or hosting points to Flask.


9. BUILD
Development
ng build

Production
ng build --configuration production

Output is in dist. Configure your host to fallback to index.html for deep links.


10. NPM SCRIPTS
Add to package.json if missing
{
  "scripts": {
    "start": "ng serve",
    "dev": "npm ci && ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "lint": "ng lint",
    "test": "ng test"
  }
}


11. COMMON ISSUES  QUICK FIXES
• Module not found  xlsx
  npm install xlsx
  npm install -D @types/xlsx
  Restart the dev server.

• Failed to resolve import  aos
  npm install aos
  Add to src/styles.css
    @import "aos/dist/aos.css";
  In a component use dynamic import
    const AOS = (await import('aos')).default; AOS.init();
  Delete the .angular folder if cache persists, then restart ng serve.

• npm run dev not found
  Add "dev": "npm ci && ng serve" under scripts in package.json.

• npm ci EUSAGE  lockfile out of sync
  Run npm install once to refresh package-lock.json
  Commit package.json and package-lock.json, then npm run dev works.

• Port already in use
  Close other dev servers or run
  npx kill-port 4200
  Then start again.

• Angular CLI not found
  npm install -g @angular/cli
  Or use npx ng serve

• CORS error
  Allow http://localhost:4200 in Flask CORS settings.
  Example Flask
    from flask_cors import CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

• ngModel or NG8002 errors
  Import FormsModule in the component
    imports  [CommonModule, FormsModule, RouterModule]
  Ensure inputs using [(ngModel)] have a name attribute.

• Node modules accidentally committed or stray parent node_modules
  Add to .gitignore
    node_modules/
  Remove from Git tracking
    git rm -r --cached node_modules
  Delete stray parent node_modules folders and run npm install in the app folder only.

• Mixed folders
  Ensure you run npm install and ng serve inside the same ai-content-portal folder you are editing.

• AOS CSS imported twice
  Import its CSS in exactly one place  src/styles.css. Do not add it again in angular.json unless you remove the styles.css import.
