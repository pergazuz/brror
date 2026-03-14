import { useState } from 'react';
import { MapPin, Calendar, Info } from 'lucide-react';
import { Profile, LocationShare } from '../types';
import LocationMap from './LocationMap';

interface SwipeCardProps {
  match: {
    profile: Profile;
    location?: LocationShare;
    distance?: number;
  };
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
}

export default function SwipeCard({ match }: SwipeCardProps) {
  const { profile, location, distance } = match;
  const [showDetails, setShowDetails] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  const age = calculateAge(profile.birth_date);
  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : ['https://via.placeholder.com/400x600?text=No+Photo'];

  return (
    <div className="relative w-full max-w-sm h-[600px] card-shadow rounded-2xl overflow-hidden bg-white">
      {/* Photo Carousel */}
      <div className="relative h-full">
        <img
          src={photos[currentPhotoIndex]}
          alt={profile.name}
          className="w-full h-full object-cover"
        />

        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
            {photos.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation areas */}
        {photos.length > 1 && (
          <>
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={() => setCurrentPhotoIndex(Math.min(photos.length - 1, currentPhotoIndex + 1))}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold">
                {profile.name}, {age}
              </h2>
              {distance && (
                <div className="flex items-center gap-1 text-sm mt-1">
                  <MapPin size={16} />
                  <span>{Math.round(distance)} km away</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <Info size={24} />
            </button>
          </div>

          {profile.bio && (
            <p className="text-sm mb-3 line-clamp-2">{profile.bio}</p>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="absolute inset-0 bg-white overflow-y-auto">
          <div className="p-6">
            <button
              onClick={() => setShowDetails(false)}
              className="mb-4 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {profile.name}, {age}
            </h2>

            {profile.bio && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {location && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin size={20} className="text-pink-500" />
                  Location (24h share)
                </h3>
                <p className="text-sm text-gray-600 mb-3">{location.address}</p>
                <LocationMap
                  latitude={location.latitude}
                  longitude={location.longitude}
                  height="250px"
                />
              </div>
            )}

            <div className="text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Age: {age}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

