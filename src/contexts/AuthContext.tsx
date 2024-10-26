import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyToken } from '../lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token)
        .then((decoded) => {
          setIsAuthenticated(true);
          setUserRole(decoded.role);
          setUserId(decoded.userId);
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = verifyToken(token);
    setIsAuthenticated(true);
    setUserRole(decoded.role);
    setUserId(decoded.userId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}