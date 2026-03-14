# Brror Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- Git

## Step 1: Supabase Setup

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details and wait for it to initialize

2. **Enable PostGIS extension**
   - In your Supabase dashboard, go to "Database" → "Extensions"
   - Search for "postgis" and enable it

3. **Run database migrations**
   - Go to "SQL Editor" in your Supabase dashboard
   - Copy and paste the contents of each migration file in order:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_rls_policies.sql`
     - `supabase/migrations/003_functions.sql`
   - Run each one by clicking "Run"

4. **Get your API credentials**
   - Go to "Settings" → "API"
   - Copy your "Project URL" and "anon public" key

## Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## Step 3: Configure Environment Variables

1. **Create client environment file**
   ```bash
   cp client/.env.example client/.env
   ```

2. **Edit `client/.env`** and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Step 4: Run the Application

```bash
# Start the development server
npm run dev
```

The app will be available at http://localhost:5173

## Step 5: Create Your First Account

1. Open http://localhost:5173 in your browser
2. Click "Sign Up"
3. Fill in your details (must be 18+)
4. Complete your profile
5. Enable location sharing (optional)
6. Start swiping!

## Testing the 24-Hour Location Feature

To test the unique location sharing feature:

1. Create two accounts (use different browsers or incognito mode)
2. On both accounts, go to the "Location" tab
3. Click "Enable for 24 Hours" on both accounts
4. Swipe right on each other to create a match
5. Go to "Matches" and open the chat
6. You should see the other user's exact location on a map!

## Key Features to Test

### 1. Profile Management
- Upload photos (placeholder for now)
- Edit bio and interests
- Set preferences (age range, distance)

### 2. Discovery/Swiping
- Swipe left to pass
- Swipe right to like
- Star for super like
- See distance if both users share location

### 3. 24-Hour Location Sharing
- Enable/disable location sharing
- Automatic 24-hour expiry
- Only visible to matched users
- Shows exact address and map

### 4. Matching
- Mutual right swipes create matches
- Get notified when you match
- View all matches in Matches tab

### 5. Real-time Chat
- Send messages to matched users
- Real-time message updates
- See location map in chat if shared
- Message read status

### 6. Settings
- Adjust discovery preferences
- Change max distance
- Set age range
- Sign out

## Database Functions

The app uses several PostgreSQL functions:

- `get_potential_matches()` - Returns profiles based on preferences and filters
- `create_match_on_mutual_swipe()` - Automatically creates matches
- `cleanup_expired_locations()` - Disables expired location shares

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only see locations of matched users
- Location sharing requires explicit opt-in
- Automatic 24-hour expiry on location shares
- JWT-based authentication

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you created `client/.env` with correct values

### Location not working
- Enable location permissions in your browser
- Make sure you're using HTTPS (or localhost)

### No potential matches showing
- Create multiple test accounts
- Adjust age and distance preferences
- Make sure profiles are complete

### Database errors
- Verify all migrations ran successfully
- Check Supabase logs in the dashboard
- Ensure PostGIS extension is enabled

## Production Deployment

For production deployment:

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Deploy to Vercel, Netlify, or any static hosting
3. Update environment variables in your hosting platform
4. Configure Supabase production settings
5. Set up custom domain (optional)

## Next Steps

- Add photo upload functionality using Supabase Storage
- Implement push notifications
- Add video chat feature
- Create admin dashboard
- Add reporting/blocking features
- Implement premium features

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the code comments
- Check browser console for errors

