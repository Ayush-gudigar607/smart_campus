# CampusConnect Mobile App (Frontend)

Production-ready mobile frontend for **CampusConnect**, built with **Expo (SDK 54)**, **Expo Router**, and **JavaScript**, directly mapped from the Stitch MCP design tokens and screens.

---

## Technical Stack & Architecture

- **Framework**: Expo SDK 54 with Expo Router (file-based navigation)
- **Language**: JavaScript (ES Modules, JSX)
- **Styling**: React Native `StyleSheet.create()` (strictly raw numbers for dimensions/typography, no web CSS or Tailwind)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Design System**: Stitch MCP "Smart Campus Mobility" (Indigo `#4F46E5`, Teal `#14B8A6`, Slate palette `#F8FAFC`/`#0F172A`)

---

## Directory Structure

```
frontend/
├── app/                        # Expo Router file-based pages
│   ├── _layout.js              # Root Stack layout & Safe Area Provider
│   ├── (tabs)/
│   │   ├── _layout.js          # Bottom Tab Bar (Home, Requests, Mobility, Profile)
│   │   ├── index.js            # Home Dashboard & Quick Actions
│   │   ├── requests.js         # Service Requests List with Filters & Search
│   │   ├── mobility.js         # Campus Shuttle GPS Tracker & Facilities
│   │   └── profile.js          # Student Profile & Settings
│   ├── new-request.js          # Create / Report Campus Issue Modal
│   ├── request/
│   │   └── [code].js           # Ticket Detail & Live Stepper Timeline
│   └── notifications.js        # Notification Feed & System Alerts
│
├── src/
│   ├── api/
│   │   └── client.js           # REST API client connecting to backend (:5000) with offline fallbacks
│   ├── components/
│   │   ├── Button.js           # 48px touch-target buttons (Primary, Secondary, Outline, Destructive)
│   │   ├── HeaderBar.js        # Mobile header with navigation & notification bell
│   │   ├── PriorityDot.js      # Stitch priority dot indicator (Low, Medium, High, Urgent)
│   │   ├── StatCard.js         # Metric overview card (In Progress, Assigned, Pending)
│   │   ├── StatusBadge.js      # Full pill status badge (Pending, Assigned, In Progress, Completed)
│   │   └── TicketCard.js       # Stitch card specification (#SR-code, service, description, footer)
│   ├── data/
│   │   └── mockData.js         # Decoupled mock tickets, shuttle routes, facilities, and services
│   ├── hooks/
│   │   ├── useAuth.js          # Session state & authentication hook
│   │   ├── useNotifications.js # Notifications list & read state hook
│   │   └── useRequests.js      # Ticket fetching, filtering, creation, & cancellation
│   └── theme.js                # Design system tokens (colors, typography, spacing, radii, shadows)
│
├── app.json                    # Expo project configuration
├── babel.config.js             # Babel preset configuration
├── metro.config.js             # Metro bundler configuration
└── package.json                # Dependencies (Expo 54, React 19, React Native 0.81)
```

---

## Running Locally

1. **Install dependencies** (if not already installed):
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run start
   ```

   If Expo Go displays **"Something went wrong"** after scanning the QR code,
   use the tunnel instead. This avoids Windows firewall, guest Wi-Fi, and LAN
   isolation issues that prevent the phone from reaching Metro:
   ```bash
   npm run start:tunnel
   ```

3. **Run on platform**:
   - Web: Press `w` in terminal, or run `npm run web`
   - Android: Press `a` in terminal (or scan QR in Expo Go)
   - iOS: Press `i` in terminal (or scan QR in Expo Go)

---

## Backend Connectivity

The frontend connects to the backend REST API running at `http://localhost:5000` (or `EXPO_PUBLIC_API_URL`):

- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Current User**: `GET /api/auth/me`
- **Requests List**: `GET /api/requests/mine`
- **Summary Metrics**: `GET /api/requests/mine/summary`
- **Submit Request**: `POST /api/requests`
- **Cancel Request**: `PATCH /api/requests/:code/cancel`
- **Notifications**: `GET /api/notifications`

> **Offline / Preview Resilience**: If the backend is not yet started, the app seamlessly provides intelligent local mock fallbacks so you can test all screens, submission flows, and interactions offline.
