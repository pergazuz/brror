export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  interested_in: 'male' | 'female' | 'everyone';
  photos: string[];
  interests: string[];
  max_distance: number;
  age_min: number;
  age_max: number;
  created_at: string;
  updated_at: string;
}

export interface LocationShare {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address: string;
  enabled: boolean;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  user1_profile?: Profile;
  user2_profile?: Profile;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  direction: 'left' | 'right' | 'super';
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface SwipeCard {
  profile: Profile;
  location?: LocationShare;
  distance?: number;
}

