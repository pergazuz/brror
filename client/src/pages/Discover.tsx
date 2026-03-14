import { useState, useEffect } from 'react';
import { X, Heart, Star } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { mockLocationShares } from '../services/mockData';
import { useAuthStore } from '../store/authStore';
import { Profile, LocationShare } from '../types';
import toast from 'react-hot-toast';
import SwipeCard from '../components/SwipeCard';

interface PotentialMatch {
  profile: Profile;
  location?: LocationShare;
  distance?: number;
}

export default function Discover() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<PotentialMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPotentialMatches();
  }, [user]);

  const fetchPotentialMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get potential matches from mock API
      const { data, error } = await mockApi.discovery.getPotentialMatches(user.id);

      if (error) throw error;

      // Add location data for users who have it enabled
      const profilesWithLocation = (data || []).map((profile: Profile) => {
        const locationData = mockLocationShares.find(
          l => l.user_id === profile.user_id &&
               l.enabled &&
               new Date(l.expires_at) > new Date()
        );

        return {
          profile,
          location: locationData || undefined,
          distance: locationData ? Math.floor(Math.random() * 30) + 1 : undefined, // Random distance for demo
        };
      });

      setMatches(profilesWithLocation);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load potential matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'super') => {
    const currentMatch = matches[currentIndex];
    if (!currentMatch || !user) return;

    try {
      // Record the swipe (mock)
      const { match, error } = await mockApi.swipes.create({
        swiper_id: user.id,
        swiped_id: currentMatch.profile.user_id,
        direction,
      });

      if (error) throw error;

      // Check if it's a match
      if (match) {
        toast.success(`It's a match with ${currentMatch.profile.name}! 🎉`, {
          duration: 4000,
          icon: '💕',
        });
      }

      // Move to next card
      setCurrentIndex(currentIndex + 1);

      // Load more if running low
      if (currentIndex >= matches.length - 3) {
        fetchPotentialMatches();
      }
    } catch (error: any) {
      console.error('Error swiping:', error);
      toast.error('Failed to record swipe');
    }
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding matches...</p>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];

  if (!currentMatch) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
          <p className="text-gray-600 mb-4">Check back later for new matches!</p>
          <button
            onClick={fetchPotentialMatches}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex-1 flex items-center justify-center">
        <SwipeCard
          match={currentMatch}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pb-6">
        <button
          onClick={() => handleSwipe('left')}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        >
          <X className="text-red-500" size={32} />
        </button>

        <button
          onClick={() => handleSwipe('super')}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        >
          <Star className="text-blue-500" size={32} />
        </button>

        <button
          onClick={() => handleSwipe('right')}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        >
          <Heart className="text-green-500" size={32} />
        </button>
      </div>
    </div>
  );
}

