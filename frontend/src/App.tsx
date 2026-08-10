import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSettings } from './pages/Settings/hooks/useSettings';

import Landing from './pages/Landing/Landing';

import SignIn from './pages/Auth/SignIn';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ProtectedRoute from './shared/router/ProtectedRoute';

import DashboardLayout from './shared/components/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Dictionary from './pages/Dictionary/Dictionary';
// import Translate from './pages/Translate/Translate';
import Library from './pages/Library/Library';
//import Course from './pages/Course/Course
import WordDetail from './pages/WordDetail/WordDetail';
import DeckDetail from './pages/DeckDetail/DeckDetail';
import Review from './pages/Review/Review';
import Quiz from './pages/Quiz/Quiz';
import Progress from './pages/Progress/Progress';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/NotFound';

import ComingSoon from './pages/ComingSoon';

function App() {
  useSettings();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        {/* Sẽ cập nhật sau (1) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/translate" element={<ComingSoon />} />
          <Route path="/library" element={<Library />} />
          <Route path="/word/:id" element={<WordDetail/>} />
          <Route path="/deck/:deckId" element={<DeckDetail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/review/:deckId" element={<Review />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/courses" element={<ComingSoon />} />
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