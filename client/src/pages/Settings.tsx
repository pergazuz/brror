import { useState, useEffect } from 'react';
import { LogOut, Sliders } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, profile, signOut, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    maxDistance: 50,
    ageMin: 18,
    ageMax: 99,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setPreferences({
        maxDistance: profile.max_distance || 50,
        ageMin: profile.age_min || 18,
        ageMax: profile.age_max || 99,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await mockApi.profiles.update(user.id, {
        max_distance: preferences.maxDistance,
        age_min: preferences.ageMin,
        age_max: preferences.ageMax,
      });

      if (error) throw error;

      await fetchProfile();
      toast.success('Preferences updated!');
    } catch (error: any) {
      toast.error('Failed to update preferences');
      console.error('Error updating preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Discovery Preferences */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sliders size={24} className="text-pink-500" />
            <h2 className="text-xl font-semibold">Discovery Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Distance: {preferences.maxDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={preferences.maxDistance}
                onChange={(e) =>
                  setPreferences({ ...preferences, maxDistance: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range: {preferences.ageMin} - {preferences.ageMax}
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    min="18"
                    max={preferences.ageMax}
                    value={preferences.ageMin}
                    onChange={(e) =>
                      setPreferences({ ...preferences, ageMin: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    min={preferences.ageMin}
                    max="99"
                    value={preferences.ageMax}
                    onChange={(e) =>
                      setPreferences({ ...preferences, ageMax: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

