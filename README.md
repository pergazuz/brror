# Brror 🔥

A modern dating app clone with a unique 24-hour location sharing feature.

## Features

- 🔐 **Secure Authentication** - Email/password and social login
- 👤 **Rich Profiles** - Photos, bio, interests, and preferences
- 💫 **Smart Matching** - Swipe-based matching with distance filtering
- 📍 **24-Hour Location Sharing** - Optional exact location sharing that expires after 24 hours
- 💬 **Real-time Chat** - Instant messaging with matched users
- 🗺️ **Interactive Maps** - View exact locations of users who opted in
- 🔔 **Notifications** - Match and message notifications

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router
- Leaflet (Maps)
- Supabase Client

### Backend
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Row Level Security (RLS) for data protection

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd brror
```

2. Install dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
# Copy example env files
cp client/.env.example client/.env
cp server/.env.example server/.env
```

4. Configure Supabase
- Create a new Supabase project
- Update the `.env` files with your Supabase credentials
- Run the database migrations (see `/supabase/migrations`)

5. Start development servers
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Project Structure

```
brror/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   └── package.json
├── server/              # Express backend (optional)
│   └── package.json
├── supabase/            # Database schema and migrations
│   ├── migrations/
│   └── seed.sql
└── package.json
```

## Key Features Explained

### 24-Hour Location Sharing

Users can opt-in to share their exact location on a map. This feature:
- Requires explicit user consent
- Automatically expires after 24 hours
- Shows exact address/coordinates on an interactive map
- Can be toggled on/off at any time
- Only visible to matched users

## License

MIT

