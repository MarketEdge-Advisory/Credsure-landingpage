import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── compact, non‑scrollable background wrapper ─── */
const AuthShell = ({ title, children }) => (
  <div className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(180deg,#193d61 0%,#2d8ecf 100%)' }}>
    {/* grid overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    {/* slim header */}
    <header className="relative z-10 flex items-center justify-between px-4 py-2 bg-black/20">
      <div className="flex items-center gap-2">
        <img src="/credsure-real-logo.svg" alt="CredSure Loans" className="h-5 sm:h-6 w-auto object-contain brightness-0 invert" />
        <img src="/suzuki-by-cfao-logo.png" alt="Suzuki" className="h-6 sm:h-7 w-auto object-contain brightness-0 invert" />
      </div>
      <span className="text-white/70 text-[9px] sm:text-xs">© 2026 CredSure Loans X Suzuki.</span>
    </header>

    {/* main – flex ensures centering, no scroll */}
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
      <p className="text-white text-lg sm:text-xl font-semibold mb-4 text-center">
        Hi Admin, welcome back 👋
      </p>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md px-5 py-6 sm:px-8 sm:py-8">
        {children}
      </div>
    </div>
  </div>
);

/* ─── compact input ─── */
const TextInput = ({ label, type = 'text', placeholder, value, onChange, icon: Icon }) => (
  <div className="mb-3 sm:mb-4">
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 pr-8 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
      />
      {Icon && (
        <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={14} />
        </span>
      )}
    </div>
  </div>
);

/* ─── compact password input ─── */
const PasswordInput = ({ label, placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-3 sm:mb-4">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 pr-8 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </div>
  );
};

/* ─── primary button (unchanged) ─── */
const PrimaryBtn = ({ children, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full bg-[#2d9de5] hover:bg-[#1e8fd4] text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm mt-1"
  >
    {children}
  </button>
);

/* ══════════════════════════════════════════
   STEP 1 – Log In (compact)
══════════════════════════════════════════ */
const LoginStep = ({ onForgot, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    const result = await onSuccess(email, password);
    if (!result.ok) setError(result.message);
  };

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Log In</h2>
      <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">Enter your credentials to access your account</p>

      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600">
          {error}
        </div>
      )}

      <TextInput
        label="Email Address"
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
      />

      <PasswordInput
        label="Personal / Auto-generated Password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center justify-between mb-4 mt-1">
        <label className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-500"
          />
          Remember me for 30 days
        </label>
        <button
          type="button"
          onClick={onForgot}
          className="text-xs sm:text-sm text-[#2d9de5] hover:underline font-medium"
        >
          Forgot Password?
        </button>
      </div>

      <PrimaryBtn onClick={handleLogin}>Log into Account</PrimaryBtn>
    </>
  );
};

/* ══════════════════════════════════════════
   STEP 2 – Forgot Password (compact)
══════════════════════════════════════════ */
const ForgotStep = ({ onBack, onProceed }) => {
  const [email, setEmail] = useState('');

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Forgot Password?</h2>
      <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">Enter your email the email linked to your account</p>

      <TextInput
        label="Email Address"
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
      />

      <PrimaryBtn onClick={onProceed}>Proceed</PrimaryBtn>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
        Didn't forget password?{' '}
        <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:underline">
          Back to login
        </button>
      </p>
    </>
  );
};

/* ══════════════════════════════════════════
   STEP 3 – Verify Code (OTP) – compact
══════════════════════════════════════════ */
const VerifyStep = ({ onBack, onProceed }) => {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const refs = useRef([]);

  const handleChange = (idx, val) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = cleaned;
    setDigits(next);
    if (cleaned && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array(6).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Verify Code</h2>
      <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">We've sent a 6-digit code to your email address</p>

      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Enter Code</label>
        <div className="flex gap-1 justify-between" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-8 h-8 sm:w-10 sm:h-10 text-center text-sm sm:text-base font-semibold rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                d
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <PrimaryBtn onClick={onProceed}>Proceed</PrimaryBtn>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
        Didn't forget password?{' '}
        <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:underline">
          Back to login
        </button>
      </p>
    </>
  );
};

/* ══════════════════════════════════════════
   STEP 4 – Reset Password (compact)
══════════════════════════════════════════ */
const ResetStep = ({ onBack, onDone }) => {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Reset Password</h2>
      <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">We've sent a 6-digit code to your email address</p>

      <PasswordInput
        label="New Password"
        placeholder="Enter New Password"
        value={newPwd}
        onChange={(e) => setNewPwd(e.target.value)}
      />

      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm Password"
        value={confirmPwd}
        onChange={(e) => setConfirmPwd(e.target.value)}
      />

      <PrimaryBtn onClick={onDone}>Proceed to Login</PrimaryBtn>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
        Didn't forget password?{' '}
        <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:underline">
          Back to login
        </button>
      </p>
    </>
  );
};

/* ══════════════════════════════════════════
   ROOT – AdminLogin
══════════════════════════════════════════ */
const STEPS = { login: 'login', forgot: 'forgot', verify: 'verify', reset: 'reset' };

const pageTitles = {
  login: 'Log In',
  forgot: 'Forgot Password?',
  verify: 'Forgot Password?',
  reset: 'Forgot Password?',
};

export default function AdminLogin() {
  const [step, setStep] = useState(STEPS.login);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  if (user) return <Navigate to="/admin/dashboard" replace />;

  useEffect(() => {
    document.title = pageTitles[step];
  }, [step]);

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.ok) {
      navigate('/admin/dashboard', { replace: true });
    }
    return result;
  };

  return (
    <AuthShell>
      {step === STEPS.login && (
        <LoginStep
          onForgot={() => setStep(STEPS.forgot)}
          onSuccess={handleLogin}
        />
      )}
      {step === STEPS.forgot && (
        <ForgotStep
          onBack={() => setStep(STEPS.login)}
          onProceed={() => setStep(STEPS.verify)}
        />
      )}
      {step === STEPS.verify && (
        <VerifyStep
          onBack={() => setStep(STEPS.login)}
          onProceed={() => setStep(STEPS.reset)}
        />
      )}
      {step === STEPS.reset && (
        <ResetStep
          onBack={() => setStep(STEPS.login)}
          onDone={() => setStep(STEPS.login)}
        />
      )}
    </AuthShell>
  );
}