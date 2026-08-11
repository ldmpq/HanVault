import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSettings } from './pages/Settings/hooks/useSettings';

import ProtectedRoute from './shared/router/ProtectedRoute';
import DashboardLayout from './shared/components/DashboardLayout';

import Landing from './pages/Landing/Landing';

import SignIn from './pages/Auth/SignIn';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Onboarding from './pages/Onboarding/Onboarding';

import Dashboard from './pages/Dashboard/Dashboard';

import Library from './pages/Library/Library';
import DeckDetail from './pages/DeckDetail/DeckDetail';
//import Course from './pages/Course/Course

import Review from './pages/Review/Review';
import Quiz from './pages/Quiz/Quiz';

import Dictionary from './pages/Dictionary/Dictionary';
import WordDetail from './pages/WordDetail/WordDetail';
// import Translate from './pages/Translate/Translate';

import Progress from './pages/Progress/Progress';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';

function App() {
  useSettings();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Cập nhật sau (/forgot-password) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Cập nhật sau (/courses) */}
          <Route path="/library" element={<Library />} />
          <Route path="/deck/:deckId" element={<DeckDetail />} />
          <Route path="/courses" element={<ComingSoon />} />
          {/* Cập nhật sau (/quiz) */}
          <Route path="/review" element={<Review />} />
          <Route path="/review/:deckId" element={<Review />} />
          <Route path="/quiz" element={<Quiz />} />
          {/* Cập nhật sau (/translate) */}
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/word/:id" element={<WordDetail/>} />
          <Route path="/translate" element={<ComingSoon />} />
          {/* Cập nhật sau (/progress) & (/settings) */}
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;