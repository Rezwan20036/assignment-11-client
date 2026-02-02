# InfraReport Client 🏢

The frontend of the InfraReport Ticketing System. Built with React, Vite, and Premium UI Aesthetics.

## 🚀 Features
- **Public Reporting**: Report infrastructure issues with image uploads.
- **Community Upvoting**: Prioritize issues through collective citizen votes.
- **Premium Subscription**: Unlock faster responses and highlighted reports.
- **Management Dashboards**: Dedicated views for Citizens, Staff, and Administrators.
- **Real-time Updates**: Live issue tracking and timeline status updates.

## 🛠️ Tech Stack
-   **Core**: React 19 + Vite
-   **Routing**: React Router 7
-   **State Management**: TanStack Query (React Query)
-   **Styling**: Tailwind CSS 4 + Lucide Icons
-   **Forms**: React Hook Form
-   **Authentication**: Firebase
-   **Feedback**: SweetAlert2

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id
VITE_IMGBB_API_KEY=your_imgbb_key_for_uploads
VITE_API_URL=http://localhost:5000
```

### 3. Run Locally
```bash
npm run dev
```

## 🏗️ Structure
-   `src/pages`: Main view components (Dashboard, Home, All Issues, etc.)
-   `src/components`: Reusable UI elements.
-   `src/hooks`: Custom React hooks (axios instances, auth access).
-   `src/providers`: Context providers (Auth, Theme).
-   `src/utils`: Helper functions (image uploads).
