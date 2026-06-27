# 🌿 GreenByte: E-Waste Locator & Gamified Recycling Platform

[![Laravel Version](https://img.shields.shields.shields.shields.shields.shields.io/badge/Laravel-11.0-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React Version](https://img.shields.shields.shields.shields.shields.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite Version](https://img.shields.shields.shields.shields.shields.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)](https://vite.dev)
[![License](https://img.shields.shields.shields.shields.shields.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**GreenByte** is a comprehensive, gamified electronic waste (e-waste) management platform designed to encourage responsible hardware disposal. Standard users can consult our local AI assistant, locate closest certified facilities using real-time geocoding, book doorstep pickups, calculate carbon savings, earn badges, and rise through levels on a global leaderboard. Administrators are equipped with points adjustment panels, review moderation boards, doorstep fleet trackers, and exportable system analytics.

---

## ✨ Core Feature Highlights

- **🧠 Local PHP NLP Parser**: Advanced natural language parser translating inputs (e.g. *"I have a broken Dell laptop"*) into categorizations, brand metrics, and condition multipliers.
- **🗺️ Geolocation & Proximity Routing**: High-precision distance calculations utilizing the Haversine equation to route users to the closest certified facilities accepting their specific hardware category.
- **📊 Interactive SVG Charting Engine**: Native, responsive React SVG charts (Bar charts, Donut charts, Cumulative Area graphs) rendering real-time personal vs. community environmental metrics without external heavy NPM libraries.
- **🎮 Badges & Levels gamification**: Auto-award milestone system calculating Eco Levels based on points, transaction histories, and user rankings.

---

## 🚀 Implemented Modules

<details open>
<summary><b>Click to expand Module Details</b></summary>

### 🔑 1. Authentication & Profile Management
- Separate secure portals for standard users and administrative panels.
- Custom avatar picture uploads, email verification middleware, and strict password complexity rules.

### 📍 2. Certified Facility Locator
- Proximity search queries allowing guests and users to filter centers by state, city, pincode, or accepted devices.
- Side-panel drawer loading center details, review histories, ratings, operating times, and interactive write-review forms.

### 📚 3. E-Waste Education Catalog
- Detailed educational database outlining device category details (*Mobile, Laptop, Battery, TV, Printer*).
- Modal summaries focusing on toxic materials, health risks, environmental damages, and recycling benefits.

### 🧮 4. Reward Calculator & Moderation
- Visual calculator widget estimating eco-points, recovered metals, and carbon offset values based on item condition.
- Admin dashboard review moderation panel protecting center ratings from spam reviews.

### 🏆 5. Gamification System
- Automatic milestone badges (*Eco Beginner, Green Warrior, Earth Saver*) awarded dynamically based on point achievements.
- Real-time global leaderboard ranking community members by contributions and unlocked achievements.

### 📦 6. Doorstep Pickup Scheduling Wizard
- Multi-step scheduler supporting device select grids, future date filters, and preferred time slots.
- User management panel to cancel pending collections, and admin panel to edit fleet logs, add driver notes, and change statuses.

### ⚙️ 7. Admin Control Panel
- **User Management**: Role toggling (user/admin), profile deletions, and manual adjustment of user points balances (which triggers dynamic badge re-evaluations).
- **Education Manager**: Administrative interface to create, edit, or delete device hazard listings.
- **CSV Data Exporter**: Streams instant CSV report downloads for certified facilities, pickups, and user rosters.

### 🤖 8. AI Recommendation Assistant
- Intelligent search prompt with quick-template triggers.
- Parses device type, brand, and condition states dynamically to suggest nearest centers, compute points, and format safety guidelines.

### 📉 9. Environmental Impact Dashboard
- **Impact Cards**: Side-by-side statistics comparing personal contributions to community totals (CO₂ saved, landfill waste diverted in kg, and metal masses).
- **Custom Charts**: Responsive SVG bar charts (monthly items), donut charts (e-waste categories), and area charts (carbon offsets).
- **Admin Analytics**: Global overview graphs displaying pickup success rates, facility densities by city, and top recyclers.

### 🌟 Extra Advanced Features
- **🌙 Global Dark Mode**: Instant light/dark theme switcher stored in `localStorage` to preserve theme preference across sessions.
- **🌐 Multilingual Translation Engine**: Dynamic translation dropdown supporting **English (EN)**, **Hindi (HI)**, and **Spanish (ES)** for layout elements and navigation menus.
- **✉️ Automated Email Notifications**: Custom mailables (`PickupConfirmed`, `RewardCredited`) dispatched on doorstep pickup confirmation and eco-points allocation.
- **🔔 Live In-App Notification Drawer**: Real-time header bell drawer with unread count badge, mark-as-read, and deletion actions.
- **📜 Verified Print-Ready Certificates**: Renders a premium certificate dynamically, complete with verification QR codes and browser-based printing.
- **💬 Interactive AI Chatbot**: Slide-out chat console connected to a local keyword NLP matching engine for batteries, mobiles, laptops, and printer recycling guides.

</details>

---

## 🛠️ Quick Local Setup

### 1. Database & Backend Configuration
```bash
# Install PHP Composer dependencies
composer install

# Create environment configuration and generate application key
cp .env.example .env
php artisan key:generate

# Configure your DB connections in .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

# Build tables and seed default values
php artisan migrate:fresh --seed

# Enable storage symlink for profile uploads
php artisan storage:link

# Boot the Laravel local server
php artisan serve
```
*(Server runs on: `http://127.0.0.1:8000`)*

### 2. Frontend Assets Compilation
```bash
# Install JS dependencies
npm install

# Compile production bundles
npm run build

# Start the Vite development hot-reload server (optional, for active editing)
npm run dev
```

---

## 🔑 Default Seed Credentials
Once you run the database seeders, you can access the platform using these pre-configured accounts:
- **Standard Recycler**: `user@ewaste.com` / `password`
- **System Administrator**: `admin@ewaste.com` / `password`

---

## 🔗 Complete Application URLs / Routes

| URL Path | Access Level | Applicable Module | Features / Pages to Verify |
| :--- | :--- | :--- | :--- |
| **`/`** | Public | Modules 1 & 6 | **Landing Page**: Dashboard selector for Log In, Register, or guest locator lookup. |
| **`/login`** | Public | Module 1 | **Standard Login**: Recycler credentials form. |
| **`/register`** | Public | Module 1 | **Standard Sign Up**: User registration. |
| **`/admin/login`** | Public | Module 1 | **Admin Login**: Secure administrative entry form. |
| **`/locator`** | Public / Auth | Module 2 | **Interactive Locator**: Proximity map, facility details, and user reviews panel. |
| **`/dashboard`** | User (`role:user`) | Module 1 | **User Dashboard**: Welcome panel and education modules grid. |
| **`/calculator`** | User (`role:user`) | Module 4 | **Carbon Calculator**: Interactive device specs input estimating rewards. |
| **`/leaderboard`** | User (`role:user`) | Module 5 | **Global Standings**: Live user leaderboard ranks and unlocked badges grid. |
| **`/pickups`** | User (`role:user`) | Module 6 | **Pickup Scheduler**: Book doorstep pickups, track orders, or cancel pending requests. |
| **`/recommendations`** | User (`role:user`) | Module 8 | **AI Assistant**: Natural language parsing console and safety instruction cards. |
| **`/impact`** | User (`role:user`) | Module 9 | **Impact Dashboard**: Responsive SVG charts tracking personal and community metrics. |
| **`/profile`** | User (`role:user`) | Module 1 | **Account Manager**: Edit credentials, update passwords, and upload profile pictures. |
| **`/admin/dashboard`** | Admin (`role:admin`) | Modules 1 & 4 | **Admin Console**: Unified high-level platform KPI summaries cards. |
| **`/admin/facilities`** | Admin (`role:admin`) | Module 2 | **Facility CRUD**: Manager to create, update, or delete recycling centers. |
| **`/admin/reviews`** | Admin (`role:admin`) | Module 4 | **Review Moderation**: Approve or delete pending reviews before going public. |
| **`/admin/pickups`** | Admin (`role:admin`) | Module 6 | **Pickups Console**: Manage fleet collections, add driver notes, and complete orders. |
| **`/admin/users`** | Admin (`role:admin`) | Module 7 | **User Administration**: Toggle admin roles, delete profiles, or adjust user points. |
| **`/admin/education`** | Admin (`role:admin`) | Module 7 | **Education CRUD**: Portal to create, edit, or delete device profiles. |
| **`/admin/reports`** | Admin (`role:admin`) | Module 7 | **System Reports**: Overview statistics summaries and CSV data downloads. |
| **`/admin/analytics`** | Admin (`role:admin`) | Module 9 | **Platform Analytics**: Performance chart dashboards tracking city densities and metrics. |

---

## ⚡ API Endpoints (Laravel API Routes)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/facilities/nearby` | Resolves centers closest to coordinates (`lat`, `lng`). |
| `GET` | `/api/facilities/search` | Text matches over center locations (city, state, pincode, devices). |
| `GET` | `/api/facilities/{id}` | Fetches individual center details and approved reviews list. |
| `POST` | `/api/facilities/{id}/review` | Saves a new rating and comment (auth required). |
| `GET` | `/api/devices` | Returns educational details, hazardous materials, and health hazards list. |
| `POST` | `/recommendations/suggest` | NLP query input; returns matched specs, nearest center, and safety guidelines. |
| `GET` | `/admin/reports/download/{type}` | Downloads CSV reports for `users`, `facilities`, or `pickups` (admin auth required). |