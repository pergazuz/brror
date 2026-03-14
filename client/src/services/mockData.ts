import { User, Profile, LocationShare, Match, Message, Swipe } from '../types';

// Mock Users
export const mockUsers: User[] = [
  { id: '1', email: 'john@example.com', created_at: new Date().toISOString() },
  { id: '2', email: 'sarah@example.com', created_at: new Date().toISOString() },
  { id: '3', email: 'mike@example.com', created_at: new Date().toISOString() },
  { id: '4', email: 'emma@example.com', created_at: new Date().toISOString() },
  { id: '5', email: 'alex@example.com', created_at: new Date().toISOString() },
];

// Mock Profiles
export const mockProfiles: Profile[] = [
  {
    id: '1',
    user_id: '1',
    name: 'John',
    bio: 'Love hiking and coffee ☕',
    birth_date: '1995-05-15',
    gender: 'male',
    interested_in: 'female',
    photos: ['https://i.pravatar.cc/400?img=12'],
    interests: ['Hiking', 'Coffee', 'Photography', 'Travel'],
    max_distance: 50,
    age_min: 22,
    age_max: 35,
    height: 180,
    education: "Bachelor's Degree",
    job_title: 'Product Manager',
    company: 'Tech Startup',
    school: 'University of California',
    city: 'San Francisco',
    relationship_goal: 'relationship',
    languages: ['English', 'Spanish'],
    zodiac_sign: 'Taurus',
    exercise: 'active',
    drinking: 'socially',
    smoking: 'no',
    pets: ['Dog'],
    religion: 'Agnostic',
    political_views: 'Liberal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '2',
    name: 'Sarah',
    bio: 'Yoga instructor 🧘‍♀️ Dog lover 🐕',
    birth_date: '1997-08-22',
    gender: 'female',
    interested_in: 'male',
    photos: ['https://i.pravatar.cc/400?img=5'],
    interests: ['Yoga', 'Dogs', 'Meditation', 'Cooking'],
    max_distance: 30,
    age_min: 25,
    age_max: 40,
    height: 165,
    education: 'Yoga Certification',
    job_title: 'Yoga Instructor',
    company: 'Zen Studio',
    school: 'Yoga Alliance',
    city: 'Los Angeles',
    relationship_goal: 'relationship',
    languages: ['English', 'French'],
    zodiac_sign: 'Leo',
    exercise: 'active',
    drinking: 'no',
    smoking: 'no',
    pets: ['Dog', 'Cat'],
    religion: 'Buddhist',
    political_views: 'Moderate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '3',
    name: 'Mike',
    bio: 'Software engineer by day, musician by night 🎸',
    birth_date: '1993-03-10',
    gender: 'male',
    interested_in: 'female',
    photos: ['https://i.pravatar.cc/400?img=13'],
    interests: ['Music', 'Coding', 'Gaming', 'Movies'],
    max_distance: 40,
    age_min: 23,
    age_max: 32,
    height: 175,
    education: "Master's Degree",
    job_title: 'Software Engineer',
    company: 'Google',
    school: 'MIT',
    city: 'New York',
    relationship_goal: 'casual',
    languages: ['English', 'German'],
    zodiac_sign: 'Pisces',
    exercise: 'sometimes',
    drinking: 'yes',
    smoking: 'socially',
    pets: [],
    religion: 'Atheist',
    political_views: 'Liberal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '4',
    name: 'Emma',
    bio: 'Adventure seeker 🌍 Foodie 🍕',
    birth_date: '1996-11-30',
    gender: 'female',
    interested_in: 'everyone',
    photos: ['https://i.pravatar.cc/400?img=9'],
    interests: ['Travel', 'Food', 'Adventure', 'Photography'],
    max_distance: 60,
    age_min: 24,
    age_max: 38,
    height: 170,
    education: "Bachelor's Degree",
    job_title: 'Travel Blogger',
    company: 'Self-employed',
    school: 'NYU',
    city: 'Brooklyn',
    relationship_goal: 'not_sure',
    languages: ['English', 'Italian', 'Portuguese'],
    zodiac_sign: 'Sagittarius',
    exercise: 'active',
    drinking: 'socially',
    smoking: 'no',
    pets: ['Cat'],
    religion: 'Christian',
    political_views: 'Moderate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    user_id: '5',
    name: 'Alex',
    bio: 'Fitness enthusiast 💪 Love the outdoors',
    birth_date: '1994-07-18',
    gender: 'other',
    interested_in: 'everyone',
    photos: ['https://i.pravatar.cc/400?img=8'],
    interests: ['Fitness', 'Running', 'Nature', 'Health'],
    max_distance: 45,
    age_min: 22,
    age_max: 35,
    height: 178,
    education: "Bachelor's Degree",
    job_title: 'Personal Trainer',
    company: 'FitLife Gym',
    school: 'State University',
    city: 'Austin',
    relationship_goal: 'friendship',
    languages: ['English'],
    zodiac_sign: 'Cancer',
    exercise: 'active',
    drinking: 'no',
    smoking: 'no',
    pets: ['Dog'],
    religion: 'Spiritual',
    political_views: 'Progressive',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Location Shares
export const mockLocationShares: LocationShare[] = [
  {
    id: '1',
    user_id: '2',
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'New York, NY 10001, USA',
    enabled: true,
    expires_at: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 hours from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '4',
    latitude: 40.7589,
    longitude: -73.9851,
    address: 'Times Square, New York, NY 10036, USA',
    enabled: true,
    expires_at: new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString(), // 15 hours from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Swipes
export let mockSwipes: Swipe[] = [];

// Mock Matches
export let mockMatches: Match[] = [
  {
    id: '1',
    user1_id: '1',
    user2_id: '2',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// Mock Messages
export let mockMessages: Message[] = [
  {
    id: '1',
    match_id: '1',
    sender_id: '2',
    content: 'Hey! How are you?',
    read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    match_id: '1',
    sender_id: '1',
    content: 'Hi! I\'m great, thanks! How about you?',
    read: true,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    match_id: '1',
    sender_id: '2',
    content: 'Doing well! I saw you like hiking. Have you been to any good trails lately?',
    read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Current logged in user (default)
export let currentUser: User = mockUsers[0];
export let currentProfile: Profile = mockProfiles[0];

// Helper functions
export const setCurrentUser = (userId: string) => {
  const user = mockUsers.find(u => u.id === userId);
  const profile = mockProfiles.find(p => p.user_id === userId);
  if (user && profile) {
    currentUser = user;
    currentProfile = profile;
  }
};

export const addSwipe = (swipe: Swipe) => {
  mockSwipes.push(swipe);
  
  // Check for mutual match
  const mutualSwipe = mockSwipes.find(
    s => s.swiper_id === swipe.swiped_id && 
        s.swiped_id === swipe.swiper_id && 
        (s.direction === 'right' || s.direction === 'super')
  );
  
  if (mutualSwipe && (swipe.direction === 'right' || swipe.direction === 'super')) {
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      user1_id: swipe.swiper_id < swipe.swiped_id ? swipe.swiper_id : swipe.swiped_id,
      user2_id: swipe.swiper_id < swipe.swiped_id ? swipe.swiped_id : swipe.swiper_id,
      created_at: new Date().toISOString(),
    };
    mockMatches.push(newMatch);
    return newMatch;
  }
  return null;
};

export const addMessage = (message: Omit<Message, 'id' | 'created_at'>) => {
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  mockMessages.push(newMessage);
  return newMessage;
};

