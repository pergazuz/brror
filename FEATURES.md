# Brror Features Documentation

## 🔥 Core Features

### 1. User Authentication
- **Email/Password Registration**
  - Age verification (18+ required)
  - Secure password handling
  - Email confirmation (via Supabase)
  
- **Login System**
  - JWT-based authentication
  - Persistent sessions
  - Secure logout

### 2. Profile Management
- **Profile Creation**
  - Name, bio, birth date
  - Gender selection (male, female, other)
  - Interested in preferences (male, female, everyone)
  - Photo upload support (placeholder ready)
  - Custom interests/tags
  
- **Profile Editing**
  - Update bio and interests
  - Add/remove interest tags
  - Profile photo management

### 3. 24-Hour Location Sharing ⭐ (Unique Feature)

This is what makes Brror different from Tinder!

**How it works:**
- Users can opt-in to share their exact location
- Location is visible ONLY to matched users
- Automatically expires after exactly 24 hours
- Can be disabled at any time
- Shows exact address and interactive map

**Privacy & Security:**
- Requires explicit user consent
- Only matched users can see location
- Automatic expiry prevents forgotten shares
- Real-time location updates
- Address reverse geocoding

**Technical Implementation:**
- Uses browser Geolocation API
- PostGIS for geographic queries
- Leaflet/OpenStreetMap for maps
- Row Level Security (RLS) for privacy
- Automatic cleanup of expired shares

**User Experience:**
- One-click enable/disable
- Visual countdown to expiry
- Location preview on own profile
- Map display in chat with matched users
- Distance calculation between users

### 4. Discovery & Matching

**Smart Matching Algorithm:**
- Gender preference filtering
- Age range filtering (customizable)
- Distance-based filtering (up to 100km)
- Excludes already swiped profiles
- Excludes existing matches

**Swipe Actions:**
- **Left Swipe (X)** - Pass/Not interested
- **Right Swipe (Heart)** - Like
- **Super Like (Star)** - Show extra interest

**Match Creation:**
- Automatic match on mutual right swipes
- Instant match notification
- Match stored in database
- Triggers enabled for real-time matching

### 5. Real-time Messaging

**Chat Features:**
- One-on-one messaging with matches
- Real-time message delivery (Supabase Realtime)
- Message read status
- Timestamp on all messages
- Message history

**Location in Chat:**
- If matched user shares location, see it in chat
- Interactive map display
- Address information
- Updates when location changes

**Chat UI:**
- Modern bubble-style messages
- Different colors for sent/received
- Smooth scrolling
- Auto-scroll to latest message
- Send button with loading state

### 6. Matches List

**Features:**
- View all your matches
- See last message preview
- Unread message count badges
- Click to open chat
- Sorted by most recent

### 7. Settings & Preferences

**Discovery Preferences:**
- Maximum distance slider (1-100 km)
- Age range selector (min/max)
- Real-time preference updates

**Account Settings:**
- View email
- Sign out functionality

## 🎨 UI/UX Features

### Design System
- **Color Scheme:** Pink to Red gradient (dating app aesthetic)
- **Mobile-First:** Optimized for mobile devices
- **Responsive:** Works on all screen sizes
- **Modern UI:** Card-based design with shadows

### Navigation
- Bottom tab bar navigation
- 5 main sections:
  1. Discover (Flame icon)
  2. Matches (Message icon)
  3. Location (Map Pin icon)
  4. Profile (User icon)
  5. Settings (Settings icon)

### Animations & Interactions
- Smooth transitions
- Hover effects on buttons
- Loading states
- Toast notifications for feedback
- Card swipe animations (ready for implementation)

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only view their own data
- Location only visible to matched users
- Messages only accessible to match participants
- Profile updates restricted to owner

### Data Privacy
- Passwords hashed by Supabase Auth
- JWT tokens for authentication
- HTTPS required for location access
- No location data stored without consent

### Location Privacy
- Opt-in only (disabled by default)
- 24-hour automatic expiry
- Manual disable option
- Only matched users can see
- Expired shares automatically cleaned up

## 📊 Database Schema

### Tables
1. **profiles** - User profile information
2. **location_shares** - 24-hour location data
3. **swipes** - User swipe history
4. **matches** - Mutual matches
5. **messages** - Chat messages

### Key Features
- PostGIS for geographic queries
- Automatic timestamp updates
- Foreign key constraints
- Unique constraints for data integrity
- Indexes for performance

## 🚀 Technical Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Leaflet** - Maps
- **date-fns** - Date formatting
- **react-hot-toast** - Notifications

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security
  - Storage (ready for photos)

### APIs & Services
- **Geolocation API** - Browser location
- **OpenStreetMap** - Map tiles
- **Nominatim** - Reverse geocoding

## 🎯 Future Enhancements

### Planned Features
1. Photo upload to Supabase Storage
2. Push notifications
3. Video chat integration
4. Story/Status feature
5. Advanced filters (height, education, etc.)
6. Verification badges
7. Report/Block users
8. Premium subscription features
9. Social media integration
10. AI-powered match suggestions

### Technical Improvements
1. Progressive Web App (PWA)
2. Offline support
3. Image optimization
4. Lazy loading
5. Performance monitoring
6. Analytics integration
7. A/B testing framework
8. Automated testing suite

## 📱 User Flow

1. **Registration** → Create account with basic info
2. **Profile Setup** → Add bio, interests, photos
3. **Enable Location** (Optional) → Share location for 24 hours
4. **Discovery** → Swipe through potential matches
5. **Match** → Mutual right swipe creates match
6. **Chat** → Message with matches
7. **View Location** → See matched user's location (if shared)
8. **Adjust Settings** → Update preferences anytime

## 🌟 What Makes Brror Unique

Unlike Tinder, which only shows approximate distance, Brror allows users to:
- Share their **exact location** with matches
- See matched users on an **interactive map**
- View the **exact address** of matches
- Control sharing with **24-hour auto-expiry**
- Maintain privacy with **opt-in system**

This creates more authentic connections by allowing matched users to:
- Plan meetups more easily
- Verify proximity
- Build trust through transparency
- Meet in person faster

