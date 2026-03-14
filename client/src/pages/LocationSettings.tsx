import { useState, useEffect } from 'react';
import { MapPin, Clock, AlertCircle, Check } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import LocationMap from '../components/LocationMap';

interface LocationShare {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  enabled: boolean;
  expires_at: string;
  created_at: string;
}

export default function LocationSettings() {
  const { user } = useAuthStore();
  const [locationShare, setLocationShare] = useState<LocationShare | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState(false);

  useEffect(() => {
    fetchLocationShare();
  }, [user]);

  const fetchLocationShare = async () => {
    if (!user) return;

    try {
      const { data, error } = await mockApi.locationShares.get(user.id);

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        // Check if expired
        if (new Date(data.expires_at) < new Date()) {
          setLocationShare({ ...data, enabled: false });
        } else {
          setLocationShare(data);
        }
      }
    } catch (error: any) {
      console.error('Error fetching location:', error);
    } finally {
      setLoading(false);
    }
  };

  const enableLocationSharing = async () => {
    if (!user) return;

    setEnabling(true);

    try {
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address
      const address = await reverseGeocode(latitude, longitude);

      // Set expiry to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Upsert location share (mock)
      const { data, error } = await mockApi.locationShares.upsert({
        user_id: user.id,
        latitude,
        longitude,
        address,
        enabled: true,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      setLocationShare(data!);
      toast.success('Location sharing enabled for 24 hours!');
    } catch (error: any) {
      if (error.code === 1) {
        toast.error('Please enable location permissions');
      } else {
        toast.error('Failed to enable location sharing');
      }
      console.error('Error enabling location:', error);
    } finally {
      setEnabling(false);
    }
  };

  const disableLocationSharing = async () => {
    if (!user || !locationShare) return;

    try {
      const { error } = await mockApi.locationShares.update(user.id, { enabled: false });

      if (error) throw error;

      setLocationShare({ ...locationShare, enabled: false });
      toast.success('Location sharing disabled');
    } catch (error: any) {
      toast.error('Failed to disable location sharing');
      console.error('Error disabling location:', error);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const isActive = locationShare?.enabled && new Date(locationShare.expires_at) > new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">24-Hour Location Sharing</h1>
      <p className="text-gray-600 mb-6">
        Share your exact location with matched users for 24 hours
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Privacy Notice</p>
          <p>
            Your exact location will only be visible to users you've matched with. Location sharing
            automatically expires after 24 hours and can be disabled at any time.
          </p>
        </div>
      </div>

      {isActive ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 rounded-full p-2">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Location Sharing Active</h3>
                <p className="text-sm text-green-700">
                  Expires {formatDistanceToNow(new Date(locationShare.expires_at), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Location:</p>
              <p className="text-sm font-medium">{locationShare.address}</p>
            </div>

            {locationShare && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <LocationMap
                  latitude={locationShare.latitude}
                  longitude={locationShare.longitude}
                  height="300px"
                />
              </div>
            )}

            <button
              onClick={disableLocationSharing}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Disable Location Sharing
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-gray-400" size={32} />
            <div>
              <h3 className="font-semibold text-gray-900">Location Sharing Disabled</h3>
              <p className="text-sm text-gray-600">Enable to share your location with matches</p>
            </div>
          </div>

          <button
            onClick={enableLocationSharing}
            disabled={enabling}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {enabling ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enabling...
              </>
            ) : (
              <>
                <Clock size={20} />
                Enable for 24 Hours
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

