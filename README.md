# QT Holidays Travel Management System

A comprehensive travel service management application built for QT Holidays. This application allows tracking of various travel services, managing financial data, and generating reports.

## Features

- User authentication
- Dashboard with service navigation
- Management of multiple travel services:
  - Flight Bookings
  - Hotel Reservations
  - Car Rentals
  - Visa Services
  - Foreign Exchange
  - Tour Packages
  - Train Bookings
  - Vajabhat (Miscellaneous Payments)
- Financial summary and reporting
- Data export to Excel

## Technology Stack

- React
- TypeScript
- Firebase (Authentication & Firestore)
- Tailwind CSS
- Vite

## Deployment Instructions

### Prerequisites

1. Node.js and npm installed
2. Git installed
3. GitHub account

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., "qt-holidays-app")
4. Make it public or private as needed
5. Click "Create repository"

### Step 2: Push Your Code to GitHub

```bash
# Initialize git in your project folder
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit"

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/qt-holidays-app.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to GitHub Pages

1. Install gh-pages package (already included in package.json)
2. Make sure your package.json has the homepage field and deploy scripts:

```json
"homepage": "https://YOUR_USERNAME.github.io/qt-holidays-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy your app:

```bash
npm run deploy
```

4. Go to your GitHub repository settings > Pages
5. Make sure the source is set to "gh-pages" branch

Your app should now be accessible at `https://YOUR_USERNAME.github.io/qt-holidays-app`

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```