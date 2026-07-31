import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';

import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Dictionary from './pages/Dictionary';
import Library from './pages/Library';
import WordDetail from './pages/WordDetail';
import DeckDetail from './pages/DeckDetail';
import Review from './pages/Review';
// import Progress from './pages/Progress';
// import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

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
          {/* <Route path="/progress" element={<Progress />} /> */}
        </Route>
        
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;