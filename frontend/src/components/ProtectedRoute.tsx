import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Lấy token từ Zustand Store (nơi chúng ta đã lưu lúc Login thành công)
  const token = useAuthStore((state) => state.token);

  // Nếu không có token (chưa đăng nhập), ép chuyển hướng về trang /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã có token, cho phép render Component bên trong
  return <>{children}</>;
}