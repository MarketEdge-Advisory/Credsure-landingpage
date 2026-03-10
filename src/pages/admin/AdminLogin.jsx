import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { verifyOtp } from '../../api/auth';
import Swal from 'sweetalert2';

const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
    if (!err) return fallback;
    if (typeof err === 'string') return err;
    if (err?.message) return err.message;
    try {
        return String(err);
    } catch {
        return fallback;
    }
};

const getFriendlyForgotPasswordError = (rawMessage) => {
    const msg = String(rawMessage || '').trim().toLowerCase();

    if (!msg) return 'Unable to send reset code. Please try again.';
    if (/invalid|must.*email|email.*invalid|invalid email/.test(msg)) {
        return 'Please enter a valid email address.';
    }
    if (/not\s*found|no\s*account|no\s*user|doesn\W*exist|not\s*registered|user\s*does\s*not\s*exist/.test(msg)) {
        return 'No account found with that email.';
    }
    if (/rate.*limit|too many|try again later|temporarily unavailable|service unavailable/.test(msg)) {
        return 'Too many attempts. Please try again later.';
    }
    if (/failed to fetch|network/i.test(msg)) {
        return 'Network error. Please check your connection and try again.';
    }

    return 'Unable to send reset code. Please try again.';
};

/* ─── background wrapper ─── */
const AuthShell = ({ children }) => (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(180deg,#193d61 0%,#2d8ecf 100%)' }}>
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage:
                    'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
                backgroundSize: '40px 40px',
            }}
        />
        <header className="relative z-10 flex items-center justify-between px-4 py-2 bg-black/20">
            <div className="flex items-center gap-2">
                <img src="/credsure-real-logo.svg" alt="CredSure Loans" className="h-5 sm:h-6 w-auto object-contain brightness-0 invert" />
                <img src="/suzuki-by-cfao-logo.png" alt="Suzuki" className="h-6 sm:h-7 w-auto object-contain brightness-0 invert" />
            </div>
            <span className="text-white/70 text-[9px] sm:text-xs">© 2026 CredSure Loans X Suzuki.</span>
        </header>
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

/* ─── text input ─── */
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

/* ─── password input ─── */
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

/* ─── primary button ─── */
const PrimaryBtn = ({ children, onClick, type = 'button', disabled = false, loading = false }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full bg-[#2d9de5] hover:bg-[#1e3f6e] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm mt-1 flex items-center justify-center gap-2"
    >
        {loading && (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
        )}
        {children}
    </button>
);

/* ─── error box ─── */
const ErrorBox = ({ message }) =>
    message ? (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600">
            {message}
        </div>
    ) : null;

/* ══════════════════════════════════════════
   STEP 1 – Log In
══════════════════════════════════════════ */
const LoginStep = ({ onForgot, onSuccess }) => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [showPwdHints, setShowPwdHints] = useState(false);

    const pwdRules = [
        { label: 'At least 8 characters',        pass: password.length >= 8 },
        { label: 'At least one uppercase letter', pass: /[A-Z]/.test(password) },
        { label: 'At least one number',           pass: /[0-9]/.test(password) },
        { label: 'At least one special character', pass: /[^A-Za-z0-9]/.test(password) },
    ];

    const handleLogin = async () => {
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Please enter your email and password.');
            return;
        }
        setLoading(true);
        const result = await onSuccess(email, password);
        setLoading(false);
        if (!result.ok) {
            const raw = String(result.message || '').toLowerCase();
            let friendly = result.message;
            if (/validation failed|invalid.*credential|credential.*invalid|wrong.*password|incorrect.*password|password.*wrong|password.*incorrect|unauthorized/i.test(raw)) {
                friendly = 'Incorrect email or password. Please try again.';
                setShowPwdHints(true);
            } else if (/not\s*found|no\s*account|no\s*user|doesn\W*exist|not\s*registered|user\s*does\s*not\s*exist/i.test(raw)) {
                friendly = 'No account found with that email address.';
            } else if (/invalid.*email|email.*invalid|must.*email/i.test(raw)) {
                friendly = 'The email address entered is invalid.';
            } else if (/network|failed to fetch/i.test(raw)) {
                friendly = 'Network error. Please check your connection and try again.';
            }
            setError(friendly);
        }
    };

    return (
        <>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Log In</h2>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">Enter your credentials to access your account</p>

            <ErrorBox message={error} />

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
                onChange={(e) => { setPassword(e.target.value); if (showPwdHints) setShowPwdHints(true); }}
            />
            {showPwdHints && (
                <ul className="mb-3 space-y-1">
                    {pwdRules.map((rule) => (
                        <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.pass ? 'text-green-600' : 'text-red-500'}`}>
                            <span>{rule.pass ? '✓' : '✗'}</span>
                            {rule.label}
                        </li>
                    ))}
                </ul>
            )}

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

            <PrimaryBtn onClick={handleLogin} loading={loading}>
                Log into Account
            </PrimaryBtn>
        </>
    );
};

/* ══════════════════════════════════════════
   STEP 2 – Forgot Password
══════════════════════════════════════════ */
const ForgotStep = ({ onBack, onProceed }) => {
    const { forgotPassword } = useAuth();
    const [email, setEmail]     = useState('');
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    const handleProceed = async () => {
        setError('');
        const trimmedEmail = String(email || '').trim();
        if (!trimmedEmail) {
            setError('Please enter your email address.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const result = await forgotPassword(trimmedEmail);
            if (!result.ok) {
                const userMessage = getFriendlyForgotPasswordError(result.message);
                setError(userMessage);
                Swal.fire({
                    icon: 'error',
                    title: 'Unable to send reset code',
                    text: userMessage,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e3f6e',
                });
                return;
            }
            onProceed(trimmedEmail);
        } catch (e) {
            const userMessage = getFriendlyForgotPasswordError(e?.message || e);
            setError(userMessage);
            Swal.fire({
                icon: 'error',
                title: 'Unable to send reset code',
                text: userMessage,
                confirmButtonText: 'OK',
                confirmButtonColor: '#1e3f6e',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Forgot Password?</h2>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">Enter the email linked to your account</p>

            <ErrorBox message={error} />

            <TextInput
                label="Email Address"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
            />

            <PrimaryBtn onClick={handleProceed} disabled={!email.trim()} loading={loading}>
                Proceed
            </PrimaryBtn>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                Remembered your password?{' '}
                <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:underline">
                    Back to login
                </button>
            </p>
        </>
    );
};

/* ══════════════════════════════════════════
   STEP 3 – Verify OTP
══════════════════════════════════════════ */
const VerifyStep = ({ email, onBack, onProceed }) => {
    const { forgotPassword } = useAuth();
    const [digits, setDigits]   = useState(Array(6).fill(''));
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const [resendError, setResendError] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otpExpiry, setOtpExpiry] = useState(10 * 60); // 10 minutes in seconds
    const refs = useRef([]);

    // OTP expiry countdown
    useEffect(() => {
        if (otpExpiry <= 0) return;
        const timer = window.setInterval(() => {
            setOtpExpiry((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [otpExpiry]);

    const otpMinutes = Math.floor(otpExpiry / 60);
    const otpSeconds = otpExpiry % 60;
    const otpExpired = otpExpiry === 0;

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

    const handleProceed = async () => {
        setError('');
        if (otpExpired) {
            setError('Your code has expired. Please request a new one.');
            return;
        }
        const otp = digits.join('');
        if (otp.length < 6) {
            setError('Please enter the complete 6-digit code.');
            return;
        }
        setLoading(true);
        try {
            const payload = await verifyOtp({ email, code: otp });
            const resetToken =
                payload?.resetToken ||
                payload?.token ||
                payload?.data?.resetToken ||
                payload;
            onProceed(resetToken);
        } catch (e) {
            const msg = getErrorMessage(e, 'Invalid or expired code. Please try again.');
            const userMessage = /expired|expired\s*otp|token\s*expired/i.test(msg)
                ? 'Expired or wrong OTP. Please resend and try again.'
                : /invalid|wrong|incorrect|not\s*valid|validation\s*failed/i.test(msg)
                ? 'Expired or wrong OTP. Please resend and try again.'
                : msg;

            setError(userMessage);
            Swal.fire({
                icon: 'error',
                title: 'OTP Verification Failed',
                text: userMessage,
                confirmButtonText: 'OK',
                confirmButtonColor: '#1e3f6e',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendError('');
        setResendMessage('');

        if (!email) {
            setResendError('Unable to resend code: missing email address.');
            return;
        }

        setResendCooldown(60);
        setResendMessage('Sending new code...');

        try {
            const result = await forgotPassword(email);
            if (!result.ok) {
                setResendError(getFriendlyForgotPasswordError(result.message));
                setResendCooldown(0);
                return;
            }
            setOtpExpiry(10 * 60); // reset 10-minute timer
            setDigits(Array(6).fill(''));
            setError('');
            setResendMessage('A new code was sent to your email.');
        } catch (e) {
            setResendError(getFriendlyForgotPasswordError(e?.message || e));
            setResendCooldown(0);
        }
    };

    useEffect(() => {
        if (!resendCooldown) return;
        const timer = window.setInterval(() => {
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [resendCooldown]);

    const otp = digits.join('');

    return (
        <>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Verify Code</h2>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">
                We've sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>
            </p>

            {/* OTP expiry timer */}
            <div className={`flex items-center justify-center gap-1.5 mb-3 text-xs sm:text-sm font-medium ${
                otpExpired ? 'text-red-500' : otpExpiry <= 60 ? 'text-orange-500' : 'text-gray-500'
            }`}>
                {otpExpired ? (
                    <span>Code expired. Please resend.</span>
                ) : (
                    <span>Code expires in {otpMinutes}:{String(otpSeconds).padStart(2, '0')}</span>
                )}
            </div>

            <ErrorBox message={error} />
            <ErrorBox message={resendError} />

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
                                d ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {resendMessage && (
                <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs sm:text-sm text-green-600">
                    {resendMessage}
                </div>
            )}

            <div className="text-center mb-4">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className="text-xs sm:text-sm text-[#2d9de5] hover:underline font-medium disabled:text-gray-400 disabled:hover:no-underline"
                >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                </button>
            </div>

            <PrimaryBtn onClick={handleProceed} disabled={otp.length < 6 || otpExpired} loading={loading}>
                Proceed
            </PrimaryBtn>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                Remembered your password?{' '}
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
const ResetStep = ({ resetToken, onBack, onDone }) => {
    const { resetPassword } = useAuth();
    const [newPwd, setNewPwd]      = useState('');
    const [confirmPwd, setConfirm] = useState('');
    const [error, setError]        = useState('');
    const [loading, setLoading]    = useState(false);
    const [showHints, setShowHints] = useState(false);

    const pwdRules = [
        { label: 'At least 8 characters',        pass: newPwd.length >= 8 },
        { label: 'At least one uppercase letter', pass: /[A-Z]/.test(newPwd) },
        { label: 'At least one number',           pass: /[0-9]/.test(newPwd) },
        { label: 'At least one special character', pass: /[^A-Za-z0-9]/.test(newPwd) },
    ];
    const pwdValid = pwdRules.every((r) => r.pass);

    const getFriendlyResetError = (raw) => {
        const msg = String(raw || '').toLowerCase();
        if (!msg) return 'Failed to reset password. Please try again.';
        if (/token.*expired|expired.*token|link.*expired|reset.*expired/i.test(msg))
            return 'Your reset link has expired. Please request a new one.';
        if (/token.*invalid|invalid.*token|token.*not.*found|bad.*token/i.test(msg))
            return 'Invalid reset token. Please go back and verify your code again.';
        if (/password.*too.*short|too.*short|minimum.*character/i.test(msg))
            return 'Password is too short. It must be at least 8 characters.';
        if (/uppercase/i.test(msg))
            return 'Password must contain at least one uppercase letter.';
        if (/number|digit/i.test(msg))
            return 'Password must contain at least one number.';
        if (/special|symbol/i.test(msg))
            return 'Password must contain at least one special character.';
        if (/password.*match|match.*password/i.test(msg))
            return 'Passwords do not match.';
        if (/network|failed to fetch/i.test(msg))
            return 'Network error. Please check your connection and try again.';
        if (/validation failed/i.test(msg))
            return 'Password does not meet requirements. Please check the rules below.';
        return 'Failed to reset password. Please try again.';
    };

    const handleReset = async () => {
        setError('');
        if (!resetToken) {
            setError('Reset token missing. Please verify your code again.');
            return;
        }
        if (!newPwd.trim() || !confirmPwd.trim()) {
            setError('Please fill in both password fields.');
            return;
        }
        if (!pwdValid) {
            setShowHints(true);
            setError('Password does not meet all requirements.');
            return;
        }
        if (newPwd !== confirmPwd) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const result = await resetPassword({ resetToken, newPassword: newPwd });
            if (!result.ok) {
                const friendly = getFriendlyResetError(result.message);
                setError(friendly);
                if (/requirement|uppercase|special|short|validation/i.test(friendly)) setShowHints(true);
                return;
            }
            onDone();
        } catch (e) {
            const friendly = getFriendlyResetError(e?.message || e);
            setError(friendly);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">Reset Password</h2>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">Enter your new password below</p>

            <ErrorBox message={error} />

            <PasswordInput
                label="New Password"
                placeholder="Enter New Password"
                value={newPwd}
                onChange={(e) => { setNewPwd(e.target.value); if (showHints) setShowHints(true); }}
            />
            {showHints && (
                <ul className="mb-3 space-y-1">
                    {pwdRules.map((rule) => (
                        <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.pass ? 'text-green-600' : 'text-red-500'}`}>
                            <span>{rule.pass ? '✓' : '✗'}</span>
                            {rule.label}
                        </li>
                    ))}
                </ul>
            )}
            <PasswordInput
                label="Confirm Password"
                placeholder="Confirm Password"
                value={confirmPwd}
                onChange={(e) => setConfirm(e.target.value)}
            />

            <PrimaryBtn
                onClick={handleReset}
                disabled={!newPwd.trim() || !confirmPwd.trim()}
                loading={loading}
            >
                Proceed to Login
            </PrimaryBtn>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                Remembered your password?{' '}
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
    const [step, setStep]           = useState(STEPS.login);
    const [userEmail, setUserEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();

    useEffect(() => {
        document.title = pageTitles[step];
    }, [step]);

    if (user) return <Navigate to="/admin/dashboard" replace />;

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
                    onProceed={(email) => {
                        setUserEmail(email);
                        setStep(STEPS.verify);
                    }}
                />
            )}
            {step === STEPS.verify && (
                <VerifyStep
                    email={userEmail}
                    onBack={() => setStep(STEPS.login)}
                    onProceed={(resetToken) => {
                        setResetToken(resetToken);
                        setStep(STEPS.reset);
                    }}
                />
            )}
            {step === STEPS.reset && (
                <ResetStep
                    email={userEmail}
                    resetToken={resetToken}
                    onBack={() => setStep(STEPS.login)}
                    onDone={() => setStep(STEPS.login)}
                />
            )}
        </AuthShell>
    );
}