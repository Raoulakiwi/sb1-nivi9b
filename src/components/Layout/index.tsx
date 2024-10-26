import { ReactNode } from 'react';
import Navbar from './Navbar';
import { AuthProvider } from '../../contexts/AuthContext';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-pulse-darker">
        <Navbar />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}