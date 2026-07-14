import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { TabBar } from '@/components/TabBar';
import { COLORS, RADIUS } from './theme';

/* ─── Lazy screen imports ──────────────────────────────────────────────── */
const WelcomeScreen      = React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.WelcomeScreen })));
const LoginScreen        = React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.LoginScreen })));
const RegisterScreen     = React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.RegisterScreen })));
const ResetPasswordScreen= React.lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.ResetPasswordScreen })));
const HomeScreen         = React.lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const ProductScreen      = React.lazy(() => import('./screens/ProductScreen').then(m => ({ default: m.ProductScreen })));
const ListingScreen      = React.lazy(() => import('./screens/ListingScreen').then(m => ({ default: m.ListingScreen })));
const EditListingScreen  = React.lazy(() => import('./screens/EditListingScreen').then(m => ({ default: m.EditListingScreen })));
const SearchScreen       = React.lazy(() => import('./screens/SearchScreen').then(m => ({ default: m.SearchScreen })));
const CartScreen         = React.lazy(() => import('./screens/CartScreen').then(m => ({ default: m.CartScreen })));
const WishlistScreen     = React.lazy(() => import('./screens/WishlistScreen').then(m => ({ default: m.WishlistScreen })));
const ProfileScreen      = React.lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const AboutScreen        = React.lazy(() => import('./screens/AboutScreen').then(m => ({ default: m.AboutScreen })));
const PostAdScreen       = React.lazy(() => import('./screens/PostAdScreen').then(m => ({ default: m.PostAdScreen })));
const NotificationsScreen= React.lazy(() => import('./screens/NotificationsScreen').then(m => ({ default: m.NotificationsScreen })));
const OrdersScreen       = React.lazy(() => import('./screens/OrdersScreen').then(m => ({ default: m.OrdersScreen })));

/* ─── Constants ────────────────────────────────────────────────────────── */
export const PHONE_W = 430;

const NO_TAB_PATHS = new Set([
  '/welcome', '/login', '/register', '/reset-password',
  '/about', '/post_ad', '/notifications', '/orders',
]);

function needsTab(path: string) {
  if (NO_TAB_PATHS.has(path)) return false;
  if (path.startsWith('/product/')) return false;
  if (path.startsWith('/listing/')) return false;
  if (path.startsWith('/edit_listing/')) return false;
  return true;
}

/* ─── Spinner (Suspense fallback) ──────────────────────────────────────── */
function ScreenLoader() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100vh' }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

/* ─── Password recovery handler ────────────────────────────────────────── */
function PasswordRecoveryHandler() {
  const nav = useNavigate();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      nav('/reset-password' + hash);
    }
  }, [nav]);
  return null;
}

/* ─── Inner app (has access to router context) ─────────────────────────── */
function AppInner() {
  const location = useLocation();
  const showTab  = needsTab(location.pathname);

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: PHONE_W,
        minHeight: '100vh',
        background: COLORS.background,
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        borderRadius: RADIUS.none,
        overflow: 'hidden',
      }}>
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
            <Route path="/edit_listing/:id" element={<EditListingScreen />} />
            <Route path="/search"        element={<SearchScreen />} />
            <Route path="/cart"          element={<CartScreen />} />
            <Route path="/wishlist"      element={<WishlistScreen />} />
            <Route path="/profile"       element={<ProfileScreen />} />
            <Route path="/about"         element={<AboutScreen />} />
            <Route path="/post_ad"       element={<PostAdScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/orders"        element={<OrdersScreen />} />
            {/* Fallback */}
            <Route path="*"              element={<HomeScreen />} />
          </Routes>
        </Suspense>
        {showTab && <TabBar />}
      </div>
    </div>
  );
}

/* ─── Root export ──────────────────────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  );
}
