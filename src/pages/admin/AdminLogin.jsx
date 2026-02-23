import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';

/* ─── shared background wrapper ─── */
const AuthShell = ({ title, children }) => (
  <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg,#193d61 0%,#2d8ecf 100%)' }}>
    {/* grid overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    {/* top bar */}
    <header className="relative z-10 flex items-center justify-between px-8 py-4 bg-black/20">
      <div className="flex items-center gap-3">
         <img src="/credsure-real-logo.svg" alt="CredSure Loans" className="h-8 w-auto" />
        <img src="/suzuki-by-cfao-logo.svg" alt="Suzuki" className="h-7 w-auto" />
      </div>
      <span className="text-white/70 text-xs">© 2026 Credsure Loans X Suzuki. All Rights Reserved.</span>
    </header>
    {/* main */}
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
      <p className="text-white text-2xl font-semibold mb-8">
        Hi Admin, welcome back 👋
      </p>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-10 py-10">
        {children}
      </div>
    </div>
  </div>
);

/* ─── reusable input ─── */
const TextInput = ({ label, type = 'text', placeholder, value, onChange, icon: Icon }) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
      />
      {Icon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </span>
      )}
    </div>
  </div>
);

/* ─── password input ─── */
const PasswordInput = ({ label, placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
    </div>
  );
};

/* ─── primary button ─── */
const PrimaryBtn = ({ children, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full bg-[#2d9de5] hover:bg-[#1e8fd4] text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-1"
  >
    {children}
  </button>
);

/* ══════════════════════════════════════════
   STEP 1 – Log In
══════════════════════════════════════════ */
const LoginStep = ({ onForgot, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Log In</h2>
      <p className="text-sm text-gray-500 text-center mb-7">Enter your credentials to access your account</p>

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

      <div className="flex items-center justify-between mb-6 mt-1">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-blue-500"
          />
          Remember me for 30 days
        </label>
        <button
          type="button"
          onClick={onForgot}
          className="text-sm text-[#2d9de5] hover:underline font-medium"
        >
          Forgot Password?
        </button>
      </div>

      <PrimaryBtn onClick={onSuccess}>Log into Account</PrimaryBtn>
    </>
  );
};

/* ══════════════════════════════════════════
   STEP 2 – Forgot Password
══════════════════════════════════════════ */
const ForgotStep = ({ onBack, onProceed }) => {
  const [email, setEmail] = useState('');

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Forgot Password?</h2>
      <p className="text-sm text-gray-500 text-center mb-7">Enter your email the email linked to your account</p>

      <TextInput
        label="Email Address"
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
      />

      <PrimaryBtn onClick={onProceed}>Proceed</PrimaryBtn>

      <p className="text-center text-sm text-gray-500 mt-5">
        Didn't forget password?{' '}
        <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:underline">
          Back to login
        </button>
      </p>
    </>
  );
};

/* ══════════════════════════════════════════
   STEP 3 – Verify Code  (OTP)
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
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Verify Code</h2>
      <p className="text-sm text-gray-500 text-center mb-7">We've sent a 6-digit code to your email address</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Enter Code</label>
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
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
              className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                d
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <PrimaryBtn onClick={onProceed}>Proceed</PrimaryBtn>

      <p className="text-center text-sm text-gray-500 mt-5">
        Didn't forget password?{' '}
        <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:underline">
          Back to login
        </button>
      </p>
    </>
  );
};

/* ══════════════════════════════════════════
   STEP 4 – Reset Password
══════════════════════════════════════════ */
const ResetStep = ({ onBack, onDone }) => {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Reset Password</h2>
      <p className="text-sm text-gray-500 text-center mb-7">We've sent a 6-digit code to your email address</p>

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

      <p className="text-center text-sm text-gray-500 mt-5">
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

  // Keep browser tab title in sync
  useEffect(() => {
    document.title = pageTitles[step];
  }, [step]);

  return (
    <AuthShell>
      {step === STEPS.login && (
        <LoginStep
          onForgot={() => setStep(STEPS.forgot)}
          onSuccess={() => navigate('/admin/dashboard')}
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
