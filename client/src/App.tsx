import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { mockApi } from './services/mockApi';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import LocationSettings from './pages/LocationSettings';

// Layout
import Layout from './components/Layout';

function App() {
  const { user, setUser, setLoading, fetchProfile } = useAuthStore();

  useEffect(() => {
    // Check active session (mock)
    mockApi.auth.getSession().then(({ session }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile();
      }
      setLoading(false);
    });
  }, [setUser, setLoading, fetchProfile]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat/:matchId" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/location" element={<LocationSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

