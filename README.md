# InfraReport 🏢

**InfraReport** is a comprehensive Infrastructure Issue Tracking and Management System. It allows citizens to report local infrastructure problems, tracks their resolution process, and provides a backend for staff and administrators to manage community needs efficiently.

---

### 🌐 Live Site
- **Client (Live):** [https://infra-report.netlify.app](https://infra-report.netlify.app)

### 🔑 Admin Credentials
For testing the administrative features, use the following credentials:
- **Email:** `admin@gmail.com`
- **Password:** `Admin123!`

---

## 🚀 Key Features

1.  **Public Reporting System**: Seamlessly report infrastructure issues with detailed descriptions and categorizations.
2.  **Image Upload Integration**: Powered by ImgBB API for reliable storage of issue-related evidence images.
3.  **Role-Based Access Control**: Tailored experiences for **Citizens**, **Staff**, and **Admin** users.
4.  **Admin User Management**: Complete control over user roles, allowing admins to promote users to Staff or Administrator status.
5.  **Staff Resolution Workflow**: Dedicated dashboard for staff members to manage assigned issues and update their status (e.g., Pending, In Progress, Resolved).
6.  **Interactive User Dashboard**: Citizens can track their reported issues, view status updates, and manage their personal profile.
7.  **Real-time Authentication**: Secure Login and Registration system integrated with **Firebase** (supporting Email/Password and Google Social Login).
8.  **Responsive UI/UX**: Fully optimized for Desktop, Tablet, and Mobile devices with a premium feel.
9.  **Dark/Light Mode Support**: Dynamic theme switching using a custom `ThemeProvider` for better accessibility.
10. **Advanced Filtering & Search**: Explore all reported issues with dynamic search functionality and status-based filters.
11. **PDF Document Generation**: Generate and download official documents or invoices for reported issues.
12. **Community Feedback**: Integrated with `SweetAlert2` for smooth, non-intrusive user notifications and confirmations.

---

## 🛠️ Tech Stack

-   **Frontend**: React 19 + Vite
-   **Routing**: React Router 7
-   **State Management**: TanStack Query (React Query)
-   **Authentication**: Firebase
-   **Styling**: Tailwind CSS 4 + Lucide Icons
-   **Forms**: React Hook Form
-   **Feedback**: SweetAlert2
-   **PDF Generation**: `@react-pdf/renderer`

---

## 📦 Local Setup Instructions

### 1. Installation
```bash
git clone https://github.com/Rezwan20036/assignment-11-client.git
cd assignment-11-client
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id
VITE_IMGBB_API_KEY=your_imgbb_key_for_uploads
VITE_API_URL=https://your-backend-api.com
```

### 3. Run Locally
```bash
npm run dev
```

---

## 🏗️ Project Structure
-   `src/pages`: Main view components (Dashboard, Home, All Issues, etc.)
-   `src/components`: Reusable UI elements and functional modules.
-   `src/hooks`: Custom React hooks for data fetching and authentication.
-   `src/providers`: Application context providers (Auth & Theme).
-   `src/routes`: Navigation configuration and private/protected route logic.
