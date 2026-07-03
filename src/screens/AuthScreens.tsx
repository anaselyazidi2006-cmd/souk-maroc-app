import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, ShoppingBag } from 'lucide-react';

function Input({ icon: Icon, type, placeholder, value, onChange }: {
  icon: typeof Mail; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: '0 14px', height: 50 }}>
      <Icon size={17} style={{ color: COLORS.textTertiary, flexShrink: 0 }} />
      <input
        type={isPass && show ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ flex: 1, background: 'none', fontSize: 14, color: COLORS.textPrimary, border: 'none', outline: 'none' }}
      />
      {isPass && (
        <button type="button" onClick={() => setShow(v => !v)} style={{ color: COLORS.textTertiary, lineHeight: 0 }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

export function WelcomeScreen() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 400 }}>
        <img src="https://images.pexels.com/photos/2574319/pexels-photo-2574319.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0, padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: COLORS.primary, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={22} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>SoukPro</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Authentic<br />Moroccan Crafts
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
            Discover handcrafted goods from Morocco's finest artisans — delivered worldwide.
          </p>
        </div>
      </div>
      <div style={{ padding: '28px 24px 40px', background: COLORS.card, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => nav('/login')} style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary }}>
          Sign In
        </button>
        <button onClick={() => nav('/register')} style={{ height: 52, background: COLORS.cardAlt, color: COLORS.textPrimary, fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, border: `1.5px solid ${COLORS.border}` }}>
          Create Account
        </button>
        <button onClick={() => nav('/home')} style={{ fontSize: 13, color: COLORS.textTertiary, marginTop: 4 }}>
          Continue as guest
        </button>
      </div>
    </div>
  );
}

export function LoginScreen() {
  const nav = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) { setError('يرجى إدخال البريد الإلكتروني'); return; }
    if (!password.trim()) { setError('يرجى إدخال كلمة المرور'); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.error) setError(result.error);
    else nav('/home', { replace: true });
  };

  return (
    <div style={{ padding: '0 24px', paddingTop: 60, background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => nav('/welcome')} style={{ alignSelf: 'flex-start', marginBottom: 28, color: COLORS.textSecondary, lineHeight: 0 }}>
        <ArrowLeft size={22} />
      </button>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Welcome back 👋</h2>
      <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: '0 0 32px' }}>Sign in to your SoukPro account</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(v) => { setEmail(v); setError(''); }} />
        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(v) => { setPassword(v); setError(''); }} />
        <button style={{ alignSelf: 'flex-end', fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>Forgot password?</button>
      </div>
      {error && <p style={{ color: '#e53935', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, marginTop: 24, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {loading && <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
        {loading ? 'جاري تسجيل الدخول...' : 'Sign In'}
      </button>
      <p style={{ textAlign: 'center', fontSize: 13, color: COLORS.textSecondary, marginTop: 20 }}>
        Don't have an account?{' '}
        <button onClick={() => nav('/register')} style={{ color: COLORS.primary, fontWeight: 700 }}>Register</button>
      </p>
    </div>
  );
}

export function RegisterScreen() {
  const nav = useNavigate();
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) { setError('يرجى إدخال الاسم الكامل'); return; }
    if (!email.trim()) { setError('يرجى إدخال البريد الإلكتروني'); return; }
    if (!password.trim()) { setError('يرجى إدخال كلمة المرور'); return; }
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    setLoading(true);
    setError('');
    const result = await register(name, email, password);
    setLoading(false);
    if (result.error) setError(result.error);
    else if (result.needsConfirmation) setSuccess(true);
    else nav('/home', { replace: true });
  };

  if (success) {
    return (
      <div style={{ padding: '0 24px', paddingTop: 60, background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 80, background: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Mail size={40} style={{ color: '#fff' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px', textAlign: 'center' }}>تم إنشاء الحساب بنجاح!</h2>
        <p style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 }}>
          تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.
        </p>
        <button onClick={() => nav('/login')} style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, padding: '0 32px' }}>
          العودة لتسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px', paddingTop: 60, background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => nav('/welcome')} style={{ alignSelf: 'flex-start', marginBottom: 28, color: COLORS.textSecondary, lineHeight: 0 }}>
        <ArrowLeft size={22} />
      </button>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Create account ✨</h2>
      <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: '0 0 32px' }}>Join thousands of happy customers</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input icon={User} type="text" placeholder="Full name" value={name} onChange={(v) => { setName(v); setError(''); }} />
        <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(v) => { setEmail(v); setError(''); }} />
        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(v) => { setPassword(v); setError(''); }} />
      </div>
      {error && <p style={{ color: '#e53935', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, marginTop: 24, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {loading && <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
        {loading ? 'جاري إنشاء الحساب...' : 'Create Account'}
      </button>
      <p style={{ textAlign: 'center', fontSize: 13, color: COLORS.textSecondary, marginTop: 20 }}>
        Already have an account?{' '}
        <button onClick={() => nav('/login')} style={{ color: COLORS.primary, fontWeight: 700 }}>Sign In</button>
      </p>
    </div>
  );
}
