import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';

import SignIn from './pages/SignIn';
import Register from './pages/Register';
// import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './shared/router/ProtectedRoute';

import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Dictionary from './pages/Dictionary';
import Library from './pages/Library';
import WordDetail from './pages/WordDetail';
import DeckDetail from './pages/DeckDetail';
import Review from './pages/Review';
// import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
// import NotFound from './pages/NotFound';

import ComingSoon from './pages/CommingSoon';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        // Cập nhật sau (1)
        <Route path="/forgot-password" element={<ComingSoon />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/library" element={<Library />} />
          <Route path="/word/:id" element={<WordDetail/>} />
          <Route path="/deck/:deckId" element={<DeckDetail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/review/:deckId" element={<Review />} />
          // Cập nhật sau (2)
          <Route path="/progress" element={<ComingSoon />} />
          <Route path="/courses" element={<ComingSoon />} />
          <Route path="/translate" element={<ComingSoon />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;