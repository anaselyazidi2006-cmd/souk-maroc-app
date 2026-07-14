import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { COLORS, RADIUS } from './theme';
import { AppProvider } from './context/AppContext';
import TabBar from './components/TabBar';

const PHONE_W = 430;

// ── Lazy screen imports ────────────────────────────────────────────────────────
const WelcomeScreen      = React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.WelcomeScreen })));
const LoginScreen        = React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.LoginScreen })));
const RegisterScreen     = React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.RegisterScreen })));
const ResetPasswordScreen = React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.ResetPasswordScreen })));
const HomeScreen         = React.lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const ProductScreen      = React.lazy(() => import('./screens/ProductScreen').then(m => ({ default: m.ProductScreen })));
const ListingScreen      = React.lazy(() => import('./screens/ListingScreen').then(m => ({ default: m.ListingScreen })));
const SearchScreen       = React.lazy(() => import('./screens/SearchScreen').then(m => ({ default: m.SearchScreen })));
const CartScreen         = React.lazy(() => import('./screens/CartScreen').then(m => ({ default: m.CartScreen })));
const WishlistScreen     = React.lazy(() => import('./screens/WishlistScreen').then(m => ({ default: m.WishlistScreen })));
const ProfileScreen      = React.lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const AboutScreen        = React.lazy(() => import('./screens/AboutScreen').then(m => ({ default: m.AboutScreen })));
const PostAdScreen       = React.lazy(() => import('./screens/PostAdScreen').then(m => ({ default: m.PostAdScreen })));
const NotificationsScreen = React.lazy(() => import('./screens/NotificationsScreen').then(m => ({ default: m.NotificationsScreen })));
const OrdersScreen       = React.lazy(() => import('./screens/OrdersScreen').then(m => ({ default: m.OrdersScreen })));

// ── Loading spinner ────────────────────────────────────────────────────────────
function ScreenLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flex: 1 }}>
      <div style={{
        width: 32,
        height: 32,
        border: `3px solid ${COLORS.primary}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

// ── Password recovery handler ──────────────────────────────────────────────────
function PasswordRecoveryHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      navigate('/reset-password' + hash);
    }
  }, [navigate]);

  return null;
}

// ── Tab bar visibility ─────────────────────────────────────────────────────────
const NO_TAB_PATHS = new Set([
  '/welcome', '/login', '/register', '/reset-password',
  '/about', '/post_ad', '/notifications', '/orders',
]);

function needsTab(pathname: string): boolean {
  if (NO_TAB_PATHS.has(pathname)) return false;
  if (pathname.startsWith('/product/')) return false;
  if (pathname.startsWith('/listing/')) return false;
  return true;
}

// ── App shell ─────────────────────────────────────────────────────────────────
function AppShell() {
  const location = useLocation();
  const showTab = needsTab(location.pathname);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: PHONE_W,
        minHeight: '100dvh',
        margin: '0 auto',
        background: COLORS.background,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <PasswordRecoveryHandler />
      <Suspense fallback={<ScreenLoader />}>
        <Routes>
          <Route path="/welcome"        element={<WelcomeScreen />} />
          <Route path="/login"          element={<LoginScreen />} />
          <Route path="/register"       element={<RegisterScreen />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          <Route path="/"              element={<HomeScreen />} />
          <Route path="/product/:id"   element={<ProductScreen />} />
          <Route path="/listing/:id"   element={<ListingScreen />} />
          <Route path="/search"        element={<SearchScreen />} />
          <Route path="/cart"          element={<CartScreen />} />
          <Route path="/wishlist"      element={<WishlistScreen />} />
          <Route path="/profile"       element={<ProfileScreen />} />
          <Route path="/about"         element={<AboutScreen />} />
          <Route path="/post_ad"       element={<PostAdScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/orders"        element={<OrdersScreen />} />
        </Routes>
      </Suspense>
      {showTab && <TabBar />}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
