import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { mockProfiles, mockMessages } from '../services/mockData';
import { useAuthStore } from '../store/authStore';
import { Match, Profile } from '../types';

interface MatchWithProfile extends Match {
  otherProfile: Profile;
  lastMessage?: string;
  unreadCount?: number;
}

export default function Matches() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;

    try {
      const { data: matchesData, error } = await mockApi.matches.getAll(user.id);

      if (error) throw error;

      // Fetch profiles for each match
      const matchesWithProfiles = (matchesData || []).map((match) => {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;

        const profileData = mockProfiles.find(p => p.user_id === otherUserId);

        // Get last message
        const matchMessages = mockMessages
          .filter(m => m.match_id === match.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Count unread messages
        const unreadCount = mockMessages.filter(
          m => m.match_id === match.id && !m.read && m.sender_id !== user.id
        ).length;

        return {
          ...match,
          otherProfile: profileData!,
          lastMessage: matchMessages[0]?.content,
          unreadCount,
        };
      });

      setMatches(matchesWithProfiles);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Matches</h1>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-2xl font-bold mb-2">No matches yet</h2>
            <p className="text-gray-600">Start swiping to find your perfect match!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const age = calculateAge(match.otherProfile.birth_date);
              
              return (
                <div
                  key={match.id}
                  onClick={() => navigate(`/chat/${match.id}`)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {match.otherProfile.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg">
                          {match.otherProfile.name}, {age}
                        </h3>
                        {match.unreadCount! > 0 && (
                          <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            {match.unreadCount}
                          </span>
                        )}
                      </div>

                      {match.lastMessage ? (
                        <p className="text-gray-600 text-sm truncate">{match.lastMessage}</p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">Start a conversation!</p>
                      )}
                    </div>

                    <MessageCircle className="text-gray-400 flex-shrink-0" size={24} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

