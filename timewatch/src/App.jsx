import React, {useContext, useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import {UserContext, UserProvider} from './context/UserContext';
import ProtectedRoute from './ProtectedRoute';
import Header from "./components/Header.jsx";
import UserProfile from "./screens/UserProfile.jsx";
import WatchLibrary from "./screens/WatchLibrary.jsx";
import CreateWatch from "./screens/CreateWatch.jsx";
import ViewWatch from "./screens/ViewWatch.jsx";
import AdminDashboard from './screens/AdminDashboard';

// Composant pour la logique de redirection
const AppContent = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (window.location.pathname === '/login' || window.location.pathname === '/')) {
      navigate('/welcome');
    }
    else if (!user && !['/login', '/register'].includes(window.location.pathname)) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#D4C4B5] via-[#C4B5A5] to-[#B5A595] fixed inset-0 overflow-auto">
      <Header />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomeScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            user ? <Navigate to="/welcome" replace /> : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />

        <Route path="/library" element={
          <ProtectedRoute>
            <WatchLibrary />
          </ProtectedRoute>
        } />

        <Route path="/view_watch/:watch_id" element={
          <ProtectedRoute>
            <ViewWatch />
          </ProtectedRoute>
        } />

        <Route path="/create_watch" element={
          <ProtectedRoute>
            <CreateWatch />
          </ProtectedRoute>
        } />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

// Composant principal
const App = () => {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
};

export default App;