import {
  mockUsers,
  mockProfiles,
  mockLocationShares,
  mockSwipes,
  mockMatches,
  mockMessages,
  currentUser,
  setCurrentUser,
  addSwipe,
  addMessage,
} from './mockData';
import { Profile, LocationShare, Message, Swipe } from '../types';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    signUp: async (email: string, _password: string) => {
      await delay();
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        created_at: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return { user: newUser, error: null };
    },

    signIn: async (email: string, _password: string) => {
      await delay();
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        setCurrentUser(user.id);
        return { user, error: null };
      }
      return { user: null, error: { message: 'Invalid credentials' } };
    },

    signOut: async () => {
      await delay();
      return { error: null };
    },

    getSession: async () => {
      await delay();
      return { session: { user: currentUser }, error: null };
    },
  },

  profiles: {
    get: async (userId: string) => {
      await delay();
      const profile = mockProfiles.find(p => p.user_id === userId);
      return { data: profile, error: null };
    },

    create: async (profileData: Partial<Profile>) => {
      await delay();
      const newProfile: Profile = {
        id: `profile-${Date.now()}`,
        user_id: profileData.user_id!,
        name: profileData.name!,
        bio: profileData.bio || '',
        birth_date: profileData.birth_date!,
        gender: profileData.gender!,
        interested_in: profileData.interested_in!,
        photos: profileData.photos || [],
        interests: profileData.interests || [],
        max_distance: profileData.max_distance || 50,
        age_min: profileData.age_min || 18,
        age_max: profileData.age_max || 99,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockProfiles.push(newProfile);
      return { data: newProfile, error: null };
    },

    update: async (userId: string, updates: Partial<Profile>) => {
      await delay();
      const index = mockProfiles.findIndex(p => p.user_id === userId);
      if (index !== -1) {
        mockProfiles[index] = { ...mockProfiles[index], ...updates, updated_at: new Date().toISOString() };
        return { data: mockProfiles[index], error: null };
      }
      return { data: null, error: { message: 'Profile not found' } };
    },
  },

  locationShares: {
    get: async (userId: string) => {
      await delay();
      const location = mockLocationShares.find(l => l.user_id === userId);
      return { data: location, error: location ? null : { code: 'PGRST116' } };
    },

    upsert: async (locationData: Partial<LocationShare>) => {
      await delay();
      const index = mockLocationShares.findIndex(l => l.user_id === locationData.user_id);
      const newLocation: LocationShare = {
        id: index !== -1 ? mockLocationShares[index].id : `loc-${Date.now()}`,
        user_id: locationData.user_id!,
        latitude: locationData.latitude!,
        longitude: locationData.longitude!,
        address: locationData.address!,
        enabled: locationData.enabled!,
        expires_at: locationData.expires_at!,
        created_at: index !== -1 ? mockLocationShares[index].created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (index !== -1) {
        mockLocationShares[index] = newLocation;
      } else {
        mockLocationShares.push(newLocation);
      }
      return { data: newLocation, error: null };
    },

    update: async (userId: string, updates: Partial<LocationShare>) => {
      await delay();
      const index = mockLocationShares.findIndex(l => l.user_id === userId);
      if (index !== -1) {
        mockLocationShares[index] = { ...mockLocationShares[index], ...updates, updated_at: new Date().toISOString() };
        return { data: mockLocationShares[index], error: null };
      }
      return { data: null, error: { message: 'Location not found' } };
    },
  },

  swipes: {
    create: async (swipeData: Omit<Swipe, 'id' | 'created_at'>) => {
      await delay();
      const newSwipe: Swipe = {
        id: `swipe-${Date.now()}`,
        ...swipeData,
        created_at: new Date().toISOString(),
      };
      const match = addSwipe(newSwipe);
      return { data: newSwipe, match, error: null };
    },

    checkMutual: async (swiperId: string, swipedId: string) => {
      await delay();
      const mutualSwipe = mockSwipes.find(
        s => s.swiper_id === swipedId && s.swiped_id === swiperId && (s.direction === 'right' || s.direction === 'super')
      );
      return { data: mutualSwipe, error: null };
    },
  },

  matches: {
    getAll: async (userId: string) => {
      await delay();
      const userMatches = mockMatches.filter(
        m => m.user1_id === userId || m.user2_id === userId
      );
      return { data: userMatches, error: null };
    },

    get: async (matchId: string) => {
      await delay();
      const match = mockMatches.find(m => m.id === matchId);
      return { data: match, error: null };
    },
  },

  messages: {
    getAll: async (matchId: string) => {
      await delay();
      const messages = mockMessages.filter(m => m.match_id === matchId);
      return { data: messages, error: null };
    },

    create: async (messageData: Omit<Message, 'id' | 'created_at'>) => {
      await delay();
      const newMessage = addMessage(messageData);
      return { data: newMessage, error: null };
    },

    markAsRead: async (matchId: string, userId: string) => {
      await delay();
      mockMessages.forEach(m => {
        if (m.match_id === matchId && m.sender_id !== userId) {
          m.read = true;
        }
      });
      return { error: null };
    },
  },

  discovery: {
    getPotentialMatches: async (userId: string) => {
      await delay();
      const userProfile = mockProfiles.find(p => p.user_id === userId);
      if (!userProfile) return { data: [], error: null };

      // Filter profiles based on preferences
      const potentialMatches = mockProfiles.filter(p => {
        if (p.user_id === userId) return false;

        // Check if already swiped
        const alreadySwiped = mockSwipes.some(s => s.swiper_id === userId && s.swiped_id === p.user_id);
        if (alreadySwiped) return false;

        // Check if already matched
        const alreadyMatched = mockMatches.some(
          m => (m.user1_id === userId && m.user2_id === p.user_id) || (m.user2_id === userId && m.user1_id === p.user_id)
        );
        if (alreadyMatched) return false;

        // Gender preferences
        if (userProfile.interested_in !== 'everyone' && p.gender !== userProfile.interested_in) return false;
        if (p.interested_in !== 'everyone' && userProfile.gender !== p.interested_in) return false;

        return true;
      });

      return { data: potentialMatches, error: null };
    },
  },
};

