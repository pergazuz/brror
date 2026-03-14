import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MapPin } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { mockProfiles, mockLocationShares } from '../services/mockData';
import { useAuthStore } from '../store/authStore';
import { Message, Profile, LocationShare } from '../types';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import LocationMap from '../components/LocationMap';
import { generateAIResponse } from '../services/mistralService';

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [otherLocation, setOtherLocation] = useState<LocationShare | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchId) {
      fetchMatchData();
      fetchMessages();
      // Real-time updates disabled for mock data
      // In production, this would use Supabase Realtime
    }
  }, [matchId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMatchData = async () => {
    if (!user || !matchId) return;

    try {
      const { data: matchData, error: matchError } = await mockApi.matches.get(matchId);

      if (matchError) throw matchError;

      const otherUserId = matchData!.user1_id === user.id ? matchData!.user2_id : matchData!.user1_id;

      const profileData = mockProfiles.find(p => p.user_id === otherUserId);

      if (!profileData) throw new Error('Profile not found');

      setOtherProfile(profileData);

      // Fetch location if available
      const locationData = mockLocationShares.find(
        l => l.user_id === otherUserId &&
             l.enabled &&
             new Date(l.expires_at) > new Date()
      );

      if (locationData) {
        setOtherLocation(locationData);
      }
    } catch (error: any) {
      console.error('Error fetching match data:', error);
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!matchId) return;

    try {
      const { data, error } = await mockApi.messages.getAll(matchId);

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      await mockApi.messages.markAsRead(matchId, user?.id || '');
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !matchId || !otherProfile) return;

    const userMessageContent = newMessage.trim();
    setSending(true);
    
    try {
      // Send user's message
      const { data, error } = await mockApi.messages.create({
        match_id: matchId,
        sender_id: user.id,
        content: userMessageContent,
        read: false,
      });

      if (error) throw error;

      // Add user message to local state immediately
      if (data) {
        setMessages(prev => [...prev, data]);
      }

      setNewMessage('');

      // Generate AI response from the matched profile
      setTimeout(async () => {
        try {
          const aiResponse = await generateAIResponse(userMessageContent, otherProfile);
          
          // Send AI response as the other user
          const { data: aiMessageData, error: aiError } = await mockApi.messages.create({
            match_id: matchId,
            sender_id: otherProfile.user_id,
            content: aiResponse,
            read: false,
          });

          if (!aiError && aiMessageData) {
            setMessages(prev => [...prev, aiMessageData]);
          }
        } catch (aiError) {
          console.error('Error generating AI response:', aiError);
        }
      }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds for realism

    } catch (error: any) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/matches')} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold">{otherProfile?.name}</h2>
          {otherLocation && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <MapPin size={12} />
              Location shared
            </p>
          )}
        </div>
      </div>

      {/* Location Banner */}
      {otherLocation && (
        <div className="bg-blue-50 border-b border-blue-200 p-3">
          <p className="text-sm text-blue-800 mb-2">
            <strong>{otherProfile?.name}</strong> is sharing their location
          </p>
          <LocationMap
            latitude={otherLocation.latitude}
            longitude={otherLocation.longitude}
            height="150px"
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === user?.id;
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isOwn
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-pink-100' : 'text-gray-500'}`}>
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="bg-white border-t p-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-3 rounded-full hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

