import './index.css';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { TabBar } from './components/TabBar';
import { COLORS, RADIUS } from './theme';

const WelcomeScreen   = lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.WelcomeScreen })));
const LoginScreen     = lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.LoginScreen })));
const RegisterScreen  = lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.RegisterScreen })));
const HomeScreen      = lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const ProductScreen   = lazy(() => import('./screens/ProductScreen').then(m => ({ default: m.ProductScreen })));
const ListingScreen   = lazy(() => import('./screens/ListingScreen').then(m => ({ default: m.ListingScreen })));
const SearchScreen    = lazy(() => import('./screens/SearchScreen').then(m => ({ default: m.SearchScreen })));
const CartScreen      = lazy(() => import('./screens/CartScreen').then(m => ({ default: m.CartScreen })));
const WishlistScreen  = lazy(() => import('./screens/WishlistScreen').then(m => ({ default: m.WishlistScreen })));
const ProfileScreen   = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const AboutScreen     = lazy(() => import('./screens/AboutScreen').then(m => ({ default: m.AboutScreen })));
const PostAdScreen    = lazy(() => import('./screens/PostAdScreen').then(m => ({ default: m.PostAdScreen })));
const NotificationsScreen  = lazy(() => import('./screens/NotificationsScreen').then(m => ({ default: m.NotificationsScreen })));
const OrdersScreen         = lazy(() => import('./screens/OrdersScreen').then(m => ({ default: m.OrdersScreen })));
const ResetPasswordScreen  = lazy(() => import('./screens/AuthScreens').then(m => ({ default: m.ResetPasswordScreen })));

const PHONE_W = 430;

function ScreenLoader() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: 200 }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

const NO_TAB_PATHS = new Set(['/welcome', '/login', '/register', '/about', '/post_ad', '/notifications', '/orders', '/reset-password']);
function needsTab(path: string) {
  return !NO_TAB_PATHS.has(path) && !path.startsWith('/product/') && !path.startsWith('/listing/');
}

// Component to handle password recovery redirect from email link
function PasswordRecoveryHandler() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    // Check if we have recovery tokens in the URL hash
    if (hash && hash.includes('type=recovery') && pathname !== '/reset-password') {
      // Navigate to reset-password while preserving the hash
      window.history.replaceState(null, '', '/reset-password' + hash);
      // Force a re-render by navigating
      navigate('/reset-password', { replace: true });
    }
  }, [navigate, pathname]);

  return null;
}

function RouterContent() {
  const { user, isLoading } = useApp();
  const { pathname } = useLocation();

  if (isLoading) return <ScreenLoader />;

  return (
    <>
      <PasswordRecoveryHandler />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' } as React.CSSProperties}>
        <Suspense fallback={<ScreenLoader />}>
          <Routes>
            <Route path="/welcome"       element={<WelcomeScreen />} />
            <Route path="/login"         element={<LoginScreen />} />
            <Route path="/register"      element={<RegisterScreen />} />
            <Route path="/home"          element={user ? <HomeScreen /> : <Navigate to="/welcome" replace />} />
            <Route path="/product/:id"   element={<ProductScreen />} />
            <Route path="/listing/:id"   element={<ListingScreen />} />
            <Route path="/search"        element={<SearchScreen />} />
            <Route path="/cart"          element={<CartScreen />} />
            <Route path="/wishlist"      element={<WishlistScreen />} />
            <Route path="/profile"       element={user ? <ProfileScreen /> : <Navigate to="/login" replace />} />
            <Route path="/about"         element={<AboutScreen />} />
            <Route path="/post_ad"       element={<PostAdScreen />} />
            <Route path="/edit_listing/:id" element={<PostAdScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/orders"          element={<OrdersScreen />} />
            <Route path="/reset-password"   element={<ResetPasswordScreen />} />
            <Route path="/"              element={user ? <Navigate to="/home" replace /> : <Navigate to="/welcome" replace />} />
            <Route path="*"              element={user ? <Navigate to="/home" replace /> : <Navigate to="/welcome" replace />} />
          </Routes>
        </Suspense>
      </div>
      {needsTab(pathname) && <TabBar />}
    </>
  );
}

export default function App() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      minHeight: '100dvh', background: '#0f0f0f',
    }}>
      <div style={{
        width: PHONE_W, maxWidth: '100vw', minHeight: '100dvh',
        background: COLORS.background,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.5)',
        borderRadius: `clamp(0px, (100vw - ${PHONE_W}px) * 999, ${RADIUS.xxl}px)`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <BrowserRouter>
          <AppProvider>
            <RouterContent />
          </AppProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}
