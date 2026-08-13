# Civix - Digital Civic Engagement Platform

    Angular 18 frontend for the Civix civic engagement platform.

    ## Prerequisites
    - Node.js 18+
    - Angular CLI 18: `npm install -g @angular/cli@18`

    ## Setup & Run
    ```bash
    npm install
    ng serve
    ```
    Open [http://localhost:4200](http://localhost:4200).

    ## Backend Integration
    Connects to a Spring Boot backend at `http://localhost:8080`.
    All API URLs are in `src/environments/environment.ts`.

    ## Build for Production
    ```bash
    ng build --configuration production
    ```

    ## Project Structure
    ```
    src/app/
    models/         TypeScript interfaces for all entities
    services/       HTTP services (auth, petition, poll, official, report, loading, toast)
    guards/         auth.guard — protects authenticated routes
    interceptors/   auth.interceptor (JWT), loading.interceptor
    shared/         navbar, sidebar, layout, loading-spinner, toast
    pages/          auth/, dashboard/, petitions/, polls/, officials/, reports/, settings/, not-found/
    ```
    