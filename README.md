# ⚡ FastQ — Don't wait in line, spend your time.

FastQ is a front-end prototype for a smart appointment & queue management platform. It connects **clients** (people booking appointments) with **hosts** (businesses managing bookings) across multiple sectors — clinics, gyms, banks, and more — so no one has to wait in a crowded lobby.

This is a **static, client-side demo**: a marketing landing page plus a single-page app (SPA) that simulates the full booking flow using mock data and vanilla JavaScript, with no backend or database required to run it.

## ✨ Features

### 👤 For Clients
- **Provider Discovery** — browse businesses by category (Clinic, Gym, Bank, etc.)
- **Smart Slots** — pick exact dates and times from a business's available slots
- **Live Journey** — a real-time countdown timer tied to your upcoming booking
- **Transit Options** — choose drive or walk mode with a personal arrival buffer
- **One-Tap Late** — instantly notify the host if you're running behind, or check in on arrival

### 🏢 For Hosts (Businesses)
- **Business Setup** — publish a business with its sector, location, services, and exact appointment slots
- **Booking Queue** — view and manage every booking live, start/finish sessions, or remove bookings
- **Delay Broadcast** — push a delay notification to every client in the queue at once
- **Feature Control** — toggle what clients see when booking (reminders, online payment, provider choice, arrival tracking, duration estimates, email reminders)
- **Early Arrival Blast** — notify in-transit clients to fill last-minute cancellations

### 🎨 UI
- Responsive landing page with smooth-scrolling sections (Home, Features, About)
- Dark mode toggle, synced across tabs via `localStorage`
- Tabbed Login / Sign Up form with simple client-side validation

## 🧰 Tech Stack

Pure front-end, no frameworks or build tools:

- **HTML5**
- **CSS3** (custom properties, media queries, no CSS framework)
- **Vanilla JavaScript** (ES5/ES6, DOM APIs — no React/Vue/jQuery)
- **Google Fonts** (Outfit)

All application data (businesses, services, slots, bookings) lives in an in-memory JavaScript `state` object defined in `Client Dashboard/DataRender.js` — there is no backend or database, so data resets on page refresh. The only thing persisted is the dark/light theme preference, stored in `localStorage`.

## 📂 Project Structure

```
.
├── index.html                       # Marketing landing page (hero, features, about)
├── auth.html                        # The app itself — login/signup + client & host dashboards (SPA)
│
├── Core Landing Page/
│   ├── BaseStyles.css                 # Global layout, typography, hero, dark mode variables
│   ├── Navbar.css                     # Navbar styling
│   └── DarkModeToggle.js              # Dark mode toggle + cross-tab theme sync
│
├── Landing Content/
│   ├── FeaturesAbout.css              # Styles for the Features and About sections
│   ├── MediaQueries.css               # Responsive breakpoints
│   └── ThemeSync.js                   # Applies saved theme on landing page load
│
├── Authentication UI/
│   ├── FormStyles.css                 # Login/signup form styling
│   ├── LoginSignupToggle.js           # View navigation (SPA routing) + login/signup tab switching
│   └── ValidationLogic.js             # Client-side form validation & auth simulation
│
├── Client Dashboard/
│   ├── DataRender.js                  # Mock data store + rendering logic for both client & host views
│   ├── DashboardCardStyles.css        # Styling for dashboards, cards, and the booking modal
│   └── BookingConfirmation.js         # Booking modal: service/slot selection and confirming a booking
│
└── Manager Dashboard/
    ├── TimeCalculation.js             # Date/time formatting helpers
    ├── CountdownInterval.js           # Live countdown timer for the "Live Journey" view
    └── QueueTimerStyles.css           # Styling for the host queue and countdown views
```

## 🚀 Getting Started

No installation or build step is required.

1. Clone the repository
   ```bash
   git clone https://github.com/juliej0hn/Fast-Q.git
   cd Fast-Q
   ```

2. Open `index.html` directly in your browser, **or** serve the folder with a simple local server (recommended, so relative paths and fonts load correctly):
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```

3. From the landing page, click **Login / Sign Up** to open `auth.html` and try the full flow:
   - Pick a role (Client or Host) on the gateway screen
   - Sign up or log in with any email/password (this is a front-end simulation — no real auth)
   - As a **client**: browse a category, pick a business, choose a service and time slot, and confirm a booking to see the live countdown
   - As a **host**: publish a business with slots and features, then manage the live booking queue, broadcast delays, or fill cancellations

## 🗺️ Roadmap Ideas

Since this is currently a UI/UX prototype, natural next steps would include:
- A real backend (e.g. Node/Express + a database) to persist businesses, users, and bookings
- Real authentication instead of the simulated login/signup
- Actual notifications (email/SMS/push) for delay broadcasts and late check-ins

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.
