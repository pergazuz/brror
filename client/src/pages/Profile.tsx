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
    height: undefined as number | undefined,
    education: '',
    job_title: '',
    company: '',
    school: '',
    city: '',
    relationship_goal: undefined as 'casual' | 'relationship' | 'friendship' | 'not_sure' | undefined,
    languages: [] as string[],
    zodiac_sign: '',
    exercise: undefined as 'active' | 'sometimes' | 'never' | undefined,
    drinking: undefined as 'yes' | 'socially' | 'no' | undefined,
    smoking: undefined as 'yes' | 'socially' | 'no' | undefined,
    pets: [] as string[],
    religion: '',
    political_views: '',
  });
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newPet, setNewPet] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
        height: profile.height,
        education: profile.education || '',
        job_title: profile.job_title || '',
        company: profile.company || '',
        school: profile.school || '',
        city: profile.city || '',
        relationship_goal: profile.relationship_goal,
        languages: profile.languages || [],
        zodiac_sign: profile.zodiac_sign || '',
        exercise: profile.exercise,
        drinking: profile.drinking,
        smoking: profile.smoking,
        pets: profile.pets || [],
        religion: profile.religion || '',
        political_views: profile.political_views || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await mockApi.profiles.update(user.id, formData);

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

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()],
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l !== language),
    });
  };

  const addPet = () => {
    if (newPet.trim() && !formData.pets.includes(newPet.trim())) {
      setFormData({
        ...formData,
        pets: [...formData.pets, newPet.trim()],
      });
      setNewPet('');
    }
  };

  const removePet = (pet: string) => {
    setFormData({
      ...formData,
      pets: formData.pets.filter((p) => p !== pet),
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
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
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

        {/* Basic Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">Basic Info</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              {editing ? (
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., 175"
                />
              ) : (
                <p className="text-gray-700">{formData.height ? `${formData.height} cm` : 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., New York"
                />
              ) : (
                <p className="text-gray-700">{formData.city || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zodiac Sign</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.zodiac_sign}
                  onChange={(e) => setFormData({ ...formData, zodiac_sign: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Aries"
                />
              ) : (
                <p className="text-gray-700">{formData.zodiac_sign || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work & Education */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">Work & Education</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer"
                />
              ) : (
                <p className="text-gray-700">{formData.job_title || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Tech Corp"
                />
              ) : (
                <p className="text-gray-700">{formData.company || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Bachelor's Degree"
                />
              ) : (
                <p className="text-gray-700">{formData.education || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., University of California"
                />
              ) : (
                <p className="text-gray-700">{formData.school || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">Lifestyle</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Goal</label>
              {editing ? (
                <select
                  value={formData.relationship_goal || ''}
                  onChange={(e) => setFormData({ ...formData, relationship_goal: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="relationship">Long-term relationship</option>
                  <option value="casual">Casual dating</option>
                  <option value="friendship">Friendship</option>
                  <option value="not_sure">Not sure yet</option>
                </select>
              ) : (
                <p className="text-gray-700 capitalize">{formData.relationship_goal?.replace('_', ' ') || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
              {editing ? (
                <select
                  value={formData.exercise || ''}
                  onChange={(e) => setFormData({ ...formData, exercise: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="active">Active</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="never">Never</option>
                </select>
              ) : (
                <p className="text-gray-700 capitalize">{formData.exercise || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drinking</label>
              {editing ? (
                <select
                  value={formData.drinking || ''}
                  onChange={(e) => setFormData({ ...formData, drinking: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="socially">Socially</option>
                  <option value="no">No</option>
                </select>
              ) : (
                <p className="text-gray-700 capitalize">{formData.drinking || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
              {editing ? (
                <select
                  value={formData.smoking || ''}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="socially">Socially</option>
                  <option value="no">No</option>
                </select>
              ) : (
                <p className="text-gray-700 capitalize">{formData.smoking || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Christian, Muslim, Atheist"
                />
              ) : (
                <p className="text-gray-700">{formData.religion || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Political Views</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.political_views}
                  onChange={(e) => setFormData({ ...formData, political_views: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Liberal, Conservative, Moderate"
                />
              ) : (
                <p className="text-gray-700">{formData.political_views || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.languages.map((language, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {language}
                {editing && (
                  <button onClick={() => removeLanguage(language)}>
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
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Add a language..."
              />
              <button
                onClick={addLanguage}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          )}
        </div>

        {/* Pets */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Pets</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.pets.map((pet, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {pet}
                {editing && (
                  <button onClick={() => removePet(pet)}>
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
                value={newPet}
                onChange={(e) => setNewPet(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPet()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Add a pet..."
              />
              <button
                onClick={addPet}
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

