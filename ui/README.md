# FinTracker Mobile Web App

A premium, mobile-first financial tracking application built with **Vue 3**, **Vite**, **TailwindCSS**, and the **TailAdmin** template. Designed to provide a seamless, app-like experience for managing personal finances on the go.

## 🚀 Key Features

### 📱 Mobile-First Design

- **Optimized UI**: Tailored for mobile interaction with a permanent bottom navigation bar.
- **Floating Action Button (FAB)**: Quick-access button in the center to log transactions instantly from any screen.
- **Fluid Drawers**: Bottom-aligned drawers for transaction details, category management, and user profiles.

### 💰 Transaction Management

- **Transaction History**: View all your spending and earnings with a clean, card-based interface.
- **Monthly Filters**: Easily switch between months and years using a polished, custom filter system.
- **Full CRUD**: Add, update, and delete transactions with real-time balance updates.
- **Interactive Details**: Detailed view for every transaction to track categories and descriptions.

### 📊 Dashboard & Insights

- **Summary Cards**: At-a-glance view of your current Balance, Total Income, and Total Expenses.
- **Visual Analytics**: Interactive charts powered by **Chart.js** to visualize category breakdowns and spending trends.

### 🛠️ Admin Portal

- **Category Management**: Create, edit, and delete financial categories to keep your data organized.
- **User Management**: (Admin Only) Manage the entire user base, update user details, and control access roles (USER/ADMIN).

### 🔐 Security & Core Infrastructure

- **Authentication**: Secure Login and Registration system with JWT-based token handling.
- **Route Guards**: Role-based access control protecting admin screens.
- **Dark Mode**: Full native support for dark mode with a toggle in the profile menu.
- **API Integration**: Robust Axios setup with interceptors for token refresh logic.

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Built Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Lucide Vue Next
- **Charts**: Chart.js & Vue-ChartJS

## 🚦 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/suissetiawan/vuejs-fincthub-ui.git
   ```
2. Navigate to the project directory:
   ```bash
   cd fintracker-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

## 📄 License

Check the project repository for license details.

---

_Built with ❤️ by [suissetiawan](https://github.com/suissetiawan)_
