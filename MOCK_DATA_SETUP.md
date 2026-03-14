# Brror - Mock Data Setup Complete ✅

## Overview
Brror is now running with **mock data** instead of a live Supabase connection. This allows you to test all features without needing database credentials.

## What's Been Done

### 1. Mock Data Layer Created
- **`client/src/services/mockData.ts`**: Contains all sample data
  - 5 mock users (John, Sarah, Mike, Emma, Alex)
  - Pre-configured matches between users
  - Sample messages for conversations
  - Location sharing data with 24-hour expiry logic

### 2. Mock API Service
- **`client/src/services/mockApi.ts`**: Simulates backend operations
  - Authentication (login, signup, session management)
  - Profile management (get, create, update)
  - Discovery (get potential matches)
  - Swipes (create swipes, detect matches)
  - Matches (get all matches, get specific match)
  - Messages (get, create, mark as read)
  - Location sharing (get, create, update, upsert)

### 3. All Pages Updated
All pages now use the mock API instead of Supabase:
- ✅ **Login.tsx** - Mock authentication with demo accounts
- ✅ **Register.tsx** - Mock user registration
- ✅ **Discover.tsx** - Swipe through mock profiles
- ✅ **Profile.tsx** - Edit mock profile data
- ✅ **Matches.tsx** - View mock matches
- ✅ **Chat.tsx** - Send/receive mock messages
- ✅ **Settings.tsx** - Update mock preferences
- ✅ **LocationSettings.tsx** - Enable/disable 24-hour location sharing

### 4. Auth Store Updated
- **`client/src/store/authStore.ts`** now uses `mockApi` for all operations

### 5. App.tsx Updated
- Removed Supabase auth state listener
- Uses mock session management

## How to Use

### Starting the App
```bash
cd client
npm run dev
```

The app will open at `http://localhost:5174/`

### Demo Accounts
You can log in with any of these emails (password can be anything):

1. **john@example.com** - John, 28
2. **sarah@example.com** - Sarah, 26
3. **mike@example.com** - Mike, 30
4. **emma@example.com** - Emma, 27
5. **alex@example.com** - Alex, 29

### Testing the 24-Hour Location Feature

1. Log in as any user
2. Navigate to **Settings** → **Location Sharing**
3. Click **"Enable Location Sharing"**
4. The system will:
   - Request browser geolocation (or use mock coordinates)
   - Set a 24-hour expiry timestamp
   - Show your location on a map
5. Your matches can now see your exact location for 24 hours
6. After 24 hours, the location automatically expires

### Testing Matches & Chat

1. Log in as **john@example.com**
2. Go to **Matches** - you'll see Sarah and Emma
3. Click on a match to open the chat
4. Send messages back and forth
5. If the other user has location sharing enabled, you'll see their location in the chat

### Testing Swipe/Discovery

1. Go to the **Discover** page (home)
2. Swipe right (❤️) to like
3. Swipe left (✖️) to pass
4. If both users swipe right, you get a match notification!

## Key Features Implemented

### ✅ Tinder-Style Swiping
- Card-based UI with photo carousel
- Swipe left/right gestures
- Super like functionality
- Match detection

### ✅ 24-Hour Location Sharing (Unique Feature!)
- Opt-in location sharing
- Automatic 24-hour expiry
- Map display with exact coordinates
- Only visible to matches
- Privacy-focused design

### ✅ Real-time Messaging
- Chat interface for matched users
- Message history
- Unread message counts
- (Real-time updates disabled in mock mode)

### ✅ Profile Management
- Photo uploads (simulated)
- Bio and interests
- Age and gender preferences
- Distance filters

## Next Steps

When you're ready to connect to a real database:

1. Set up Supabase project
2. Run migrations in `supabase/migrations/`
3. Replace `mockApi` imports with `supabase` client
4. Update environment variables
5. The UI logic remains the same!

## File Structure
```
client/src/
├── services/
│   ├── mockData.ts      # Sample data
│   └── mockApi.ts       # Mock backend
├── pages/
│   ├── Login.tsx        # ✅ Updated
│   ├── Register.tsx     # ✅ Updated
│   ├── Discover.tsx     # ✅ Updated
│   ├── Profile.tsx      # ✅ Updated
│   ├── Matches.tsx      # ✅ Updated
│   ├── Chat.tsx         # ✅ Updated
│   ├── Settings.tsx     # ✅ Updated
│   └── LocationSettings.tsx  # ✅ Updated
├── store/
│   └── authStore.ts     # ✅ Updated
└── App.tsx              # ✅ Updated
```

## Notes

- All data is stored in memory and resets on page refresh
- Location coordinates are simulated for demo purposes
- The 24-hour expiry logic is fully functional
- Real-time features (like live message updates) are disabled in mock mode

---

**Brror is ready to use! 🎉**

Open http://localhost:5174/ and start swiping!

