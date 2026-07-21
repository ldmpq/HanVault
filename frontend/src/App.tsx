import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 text-2xl font-bold text-gray-800">
    🎉 Chào mừng bạn đến với Dashboard! (Khu vực VIP)
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          } 
        />
        
        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;