import { useState, useEffect } from 'react';
import { Camera, Plus, X } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, profile, fetchProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    interests: [] as string[],
  });
  const [newInterest, setNewInterest] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await mockApi.profiles.update(user.id, {
        name: formData.name,
        bio: formData.bio,
        interests: formData.interests,
      });

      if (error) throw error;

      await fetchProfile();
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const age = calculateAge(profile.birth_date);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Profile Photo */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-4xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
                <Camera size={20} className="text-gray-600" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.name}, {age}</h2>
              <p className="text-gray-600 capitalize">{profile.gender}</p>
              <p className="text-sm text-gray-500">Interested in: {profile.interested_in}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="font-semibold mb-3">About Me</h3>
          {editing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={4}
              placeholder="Tell others about yourself..."
            />
          ) : (
            <p className="text-gray-700">{profile.bio || 'No bio yet'}</p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {interest}
                {editing && (
                  <button onClick={() => removeInterest(interest)}>
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Add an interest..."
              />
              <button
                onClick={addInterest}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

