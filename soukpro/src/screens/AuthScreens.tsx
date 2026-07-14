import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, FONT } from '@/theme';

// ── Shared sub-components ─────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

function InputField({ label, type = 'text', value, onChange, placeholder, autoComplete }: InputFieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: FONT.sm, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            padding: '13px 16px',
            paddingLeft: isPassword ? 44 : 16,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            fontSize: FONT.base,
            color: COLORS.text,
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            direction: 'rtl',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted, display: 'flex', alignItems: 'center' }}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function AuthError({ message }: { message: string }) {
  return (
    <div style={{ padding: 14, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: RADIUS.md, color: COLORS.error, fontSize: FONT.sm, fontWeight: 600, marginBottom: 16 }}>
      {message}
    </div>
  );
}

function AuthSuccess({ message }: { message: string }) {
  return (
    <div style={{ padding: 14, background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: RADIUS.md, color: '#065F46', fontSize: FONT.sm, fontWeight: 600, marginBottom: 16 }}>
      {message}
    </div>
  );
}

// ── WelcomeScreen ─────────────────────────────────────────────────────────────
export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.primary, padding: 32 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏺</div>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1 }}>سوق المغرب</h1>
        <p style={{ fontSize: FONT.md, color: 'rgba(255,255,255,0.8)', marginTop: 12, lineHeight: 1.6 }}>
          اكتشف أجمل المنتجات التقليدية المغربية الأصيلة
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={() => navigate('/register')}
          style={{ padding: '16px 0', background: '#fff', color: COLORS.primary, border: 'none', borderRadius: RADIUS.full, fontSize: FONT.md, fontWeight: 800, cursor: 'pointer' }}
        >
          إنشاء حساب
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '16px 0', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.5)', borderRadius: RADIUS.full, fontSize: FONT.md, fontWeight: 700, cursor: 'pointer' }}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '12px 0', background: 'none', color: 'rgba(255,255,255,0.7)', border: 'none', fontSize: FONT.sm, cursor: 'pointer' }}
        >
          تصفح بدون تسجيل
        </button>
      </div>
    </div>
  );
}

// ── LoginScreen ───────────────────────────────────────────────────────────────
export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } else {
      navigate('/');
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/welcome')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
          <ArrowRight size={22} />
        </button>
        <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>تسجيل الدخول</h1>
      </div>

      <div style={{ flex: 1, padding: '32px 24px' }}>
        {error && <AuthError message={error} />}

        <InputField label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} placeholder="example@email.com" autoComplete="email" />
        <InputField label="كلمة المرور" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />

        <button
          onClick={() => navigate('/reset-password')}
          style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: FONT.sm, cursor: 'pointer', padding: '0 0 20px', display: 'block' }}
        >
          نسيت كلمة المرور؟
        </button>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '16px 0', background: loading ? COLORS.textMuted : COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.md, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'جارٍ الدخول...' : 'دخول'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: FONT.sm, color: COLORS.textSecondary }}>
          ليس لديك حساب؟{' '}
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: COLORS.primary, fontWeight: 700, cursor: 'pointer', fontSize: FONT.sm }}>
            إنشاء حساب
          </button>
        </p>
      </div>
    </div>
  );
}

// ── RegisterScreen ────────────────────────────────────────────────────────────
export function RegisterScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!email.trim() || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signUp({ email: email.trim(), password });
    if (err) {
      setError('فشل إنشاء الحساب. البريد الإلكتروني مستخدم بالفعل.');
    } else {
      navigate('/');
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/welcome')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
          <ArrowRight size={22} />
        </button>
        <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>إنشاء حساب</h1>
      </div>

      <div style={{ flex: 1, padding: '32px 24px' }}>
        {error && <AuthError message={error} />}

        <InputField label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} placeholder="example@email.com" autoComplete="email" />
        <InputField label="كلمة المرور" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="new-password" />
        <InputField label="تأكيد كلمة المرور" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" autoComplete="new-password" />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ width: '100%', padding: '16px 0', background: loading ? COLORS.textMuted : COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.md, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: FONT.sm, color: COLORS.textSecondary }}>
          لديك حساب بالفعل؟{' '}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: COLORS.primary, fontWeight: 700, cursor: 'pointer', fontSize: FONT.sm }}>
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  );
}

// ── ResetPasswordScreen ───────────────────────────────────────────────────────
export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Detect if we're in recovery mode (came from email link)
  const isRecoveryMode = window.location.hash.includes('type=recovery');

  async function handleSendReset() {
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) {
      setError('فشل إرسال رابط الاسترداد');
    } else {
      setSuccess('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
    }
    setLoading(false);
  }

  async function handleUpdatePassword() {
    if (!newPassword || newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      setError('فشل تحديث كلمة المرور');
    } else {
      setSuccess('تم تحديث كلمة المرور بنجاح!');
      setTimeout(() => navigate('/login'), 2000);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
          <ArrowRight size={22} />
        </button>
        <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>
          {isRecoveryMode ? 'تعيين كلمة مرور جديدة' : 'استعادة كلمة المرور'}
        </h1>
      </div>

      <div style={{ flex: 1, padding: '32px 24px' }}>
        {error && <AuthError message={error} />}
        {success && <AuthSuccess message={success} />}

        {isRecoveryMode ? (
          <>
            <InputField label="كلمة المرور الجديدة" type="password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" autoComplete="new-password" />
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              style={{ width: '100%', padding: '16px 0', background: loading ? COLORS.textMuted : COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.md, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'جارٍ التحديث...' : 'تحديث كلمة المرور'}
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: FONT.base, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 1.6 }}>
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور.
            </p>
            <InputField label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} placeholder="example@email.com" autoComplete="email" />
            <button
              onClick={handleSendReset}
              disabled={loading}
              style={{ width: '100%', padding: '16px 0', background: loading ? COLORS.textMuted : COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.md, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'جارٍ الإرسال...' : 'إرسال الرابط'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
