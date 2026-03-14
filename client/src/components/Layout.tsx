import { Outlet, NavLink } from 'react-router-dom';
import { Flame, MessageCircle, User, Settings, MapPin } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl flex flex-col">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <Flame size={24} />
            <span className="text-xs mt-1">Discover</span>
          </NavLink>

          <NavLink
            to="/matches"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1">Matches</span>
          </NavLink>

          <NavLink
            to="/location"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <MapPin size={24} />
            <span className="text-xs mt-1">Location</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

