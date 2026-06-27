import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import { TabBar } from './components/TabBar';
import { WelcomeScreen, LoginScreen, RegisterScreen } from './screens/AuthScreens';
import { HomeScreen } from './screens/HomeScreen';
import { ProductScreen } from './screens/ProductScreen';
import { ListingScreen } from './screens/ListingScreen';
import { SearchScreen } from './screens/SearchScreen';
import { CartScreen } from './screens/CartScreen';
import { WishlistScreen } from './screens/WishlistScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AboutScreen } from './screens/AboutScreen';
import { PostAdScreen } from './screens/PostAdScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { COLORS } from './theme';

const PHONE_W = 430;

const AUTH_ROUTES = new Set(['welcome', 'login', 'register']);
const NO_TAB_ROUTES = new Set(['welcome', 'login', 'register', 'product', 'listing', 'about', 'post_ad', 'notifications']);

function Router() {
  const { route } = useApp();

  const Screen = () => {
    switch (route) {
      case 'welcome':       return <WelcomeScreen />;
      case 'login':         return <LoginScreen />;
      case 'register':      return <RegisterScreen />;
      case 'home':          return <HomeScreen />;
      case 'product':       return <ProductScreen />;
      case 'listing':       return <ListingScreen />;
      case 'search':        return <SearchScreen />;
      case 'cart':          return <CartScreen />;
      case 'wishlist':      return <WishlistScreen />;
      case 'profile':       return <ProfileScreen />;
      case 'about':         return <AboutScreen />;
      case 'post_ad':       return <PostAdScreen />;
      case 'notifications': return <NotificationsScreen />;
      default:              return <HomeScreen />;
    }
  };

  return (
    <div style={{
      width: PHONE_W, maxWidth: '100vw',
      minHeight: '100dvh', maxHeight: '100dvh',
      background: COLORS.background,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.5)',
      borderRadius: window.innerWidth > PHONE_W ? 36 : 0,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
        <Screen />
      </div>
      {!NO_TAB_ROUTES.has(route) && <TabBar />}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100dvh', background: '#0f0f0f', paddingTop: window.innerWidth > PHONE_W ? 24 : 0 }}>
      <AppProvider>
        <Router />
      </AppProvider>
    </div>
  );
}
