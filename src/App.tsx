import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from './config/wagmi';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import CreateBusiness from './pages/CreateBusiness';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="BUSINESS_OWNER">
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-business"
                element={
                  <ProtectedRoute requiredRole="BUSINESS_OWNER">
                    <CreateBusiness />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}