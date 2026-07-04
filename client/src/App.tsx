import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#141422',
              color: '#f0f0f5',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: {
                primary: '#6366f1',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* ── Public Routes ─────────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />

          {/* ── Auth Routes (redirect if already logged in) ────────────────── */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Protected Routes ──────────────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* ── 404 ───────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
