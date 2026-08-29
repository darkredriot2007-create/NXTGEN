import React, { useState } from 'react';
import { AuthUser } from '../types';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  X,
  Facebook,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  onLogout,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [facebookFlowOpen, setFacebookFlowOpen] = useState(false);

  if (!isOpen) return null;

  // Handle Email / Password authentication
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (tab === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const nameDerived =
        tab === 'signup'
          ? fullName.trim()
          : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      const authenticatedUser: AuthUser = {
        id: `user_email_${Date.now()}`,
        name: nameDerived || 'PulseHealth Member',
        email: email.trim().toLowerCase(),
        provider: 'email',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      onLoginSuccess(authenticatedUser);
      onClose();
    }, 600);
  };

  // Handle Facebook Login simulation
  const handleFacebookStart = () => {
    setFacebookFlowOpen(true);
  };

  const handleFacebookConfirm = (selectedName: string, selectedEmail: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFacebookFlowOpen(false);

      const authenticatedUser: AuthUser = {
        id: `fb_user_${Date.now()}`,
        name: selectedName,
        email: selectedEmail,
        provider: 'facebook',
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        isVerified: true,
        token: `fb_access_token_${Math.random().toString(36).substring(2, 10)}`,
        createdAt: new Date().toISOString(),
      };

      onLoginSuccess(authenticatedUser);
      onClose();
    }, 700);
  };

  // Quick fill demo user
  const handleQuickDemoUser = (demoEmail: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword('PulseHealth2026!');
    setFullName(demoName);
    setErrorMessage('');
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="auth-modal-container"
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-teal-100/90 dark:border-slate-800 w-full max-w-md my-8 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 transition-colors"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
          title="Continue as Guest"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Facebook OAuth Authorization Flow Modal View */}
        {facebookFlowOpen ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md">
                <Facebook className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">Sign in with Facebook</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">PulseHealth AI Identity Verification</p>
              </div>
            </div>

            <div className="p-4 bg-sky-50/70 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900/60 space-y-3">
              <div className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100">PulseHealth AI</strong> will receive:
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Your Public Name &amp; Profile Picture</li>
                <li>Your primary email address for clinical consultations &amp; updates</li>
              </ul>
              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-sky-200/60 dark:border-sky-800/60">
                This does not allow the app to post to Facebook without your explicit permission.
              </div>
            </div>

            {/* Simulated Facebook Accounts Choice */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-950 dark:text-teal-300 block">Continue as:</span>
              <button
                type="button"
                onClick={() =>
                  handleFacebookConfirm('Vamsi Krishna', 'dadivamsikrishna180@gmail.com')
                }
                className="w-full p-3 rounded-2xl border border-sky-100 dark:border-slate-800 hover:border-[#1877F2] dark:hover:border-[#1877F2] hover:bg-sky-50/50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    V
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block group-hover:text-[#1877F2]">
                      Vamsi Krishna
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      dadivamsikrishna180@gmail.com
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1877F2]" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleFacebookConfirm('Alex Rivera', 'alex.rivera@pulsehealth.ai')
                }
                className="w-full p-3 rounded-2xl border border-sky-100 dark:border-slate-800 hover:border-[#1877F2] dark:hover:border-[#1877F2] hover:bg-sky-50/50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    A
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block group-hover:text-[#1877F2]">
                      Alex Rivera
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      alex.rivera@pulsehealth.ai
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1877F2]" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFacebookFlowOpen(false)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : currentUser ? (
          /* Logged In Status View */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-teal-100/80 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wider">
                Currently Authenticated
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2 font-display">{currentUser.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5">
                <span>Signed in via</span>
                <span className="font-semibold capitalize text-teal-800 dark:text-teal-300">
                  {currentUser.provider === 'facebook' ? 'Facebook OAuth' : 'Verified Email'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700 text-left text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-950 dark:text-teal-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Your medical baseline &amp; reports are securely synced</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Consultation logs, vitals baselines, and clinical doctor briefs will be associated with this account.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Continue to App
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Main Sign In / Sign Up Form */
          <div className="p-6 sm:p-8 space-y-5">
            {/* Brand Logo & Title */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 mx-auto mb-3">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-display">
                Welcome to MedTrack <span className="text-teal-600 dark:text-teal-400">AI</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Powered by PulseHealth AI. Sign in with your Email or Facebook to access personalized clinical triage &amp; health records.
              </p>
            </div>

            {/* Social Authentication: Facebook */}
            <div className="space-y-2">
              <button
                type="button"
                id="login-with-facebook-btn"
                onClick={handleFacebookStart}
                className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-all hover:shadow-md cursor-pointer"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>Continue with Facebook</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-teal-100 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                  Or use Email
                </span>
                <div className="border-t border-teal-100 dark:border-slate-800 w-full"></div>
              </div>
            </div>

            {/* Tabs: Sign In / Create Account */}
            <div className="flex p-1 bg-teal-50/70 dark:bg-slate-800/80 border border-teal-100 dark:border-slate-700 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'signin'
                    ? 'bg-white dark:bg-slate-700 text-teal-950 dark:text-teal-200 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-teal-950 dark:text-teal-200 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error message banner */}
            {errorMessage && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-teal-950 dark:text-teal-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Rivera or Vamsi Krishna"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800/90 border border-teal-200/80 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200/60 outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-teal-950 dark:text-teal-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800/90 border border-teal-200/80 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200/60 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-teal-950 dark:text-teal-300">Password</label>
                  {tab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('A password reset link has been sent to your email.')}
                      className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-800/90 border border-teal-200/80 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200/60 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="email-auth-submit-btn"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : tab === 'signin' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Email</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-fill Pill */}
            <div className="pt-2 border-t border-teal-100/80 dark:border-slate-800 flex flex-col gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 text-center">Quick demo credentials:</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoUser('dadivamsikrishna180@gmail.com', 'Vamsi Krishna')
                  }
                  className="px-2.5 py-1 bg-teal-50/70 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-[11px] font-medium text-teal-900 dark:text-teal-300 rounded-lg border border-teal-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  👤 Vamsi (dadivamsikrishna180@...)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoUser('alex.rivera@pulsehealth.ai', 'Alex Rivera')
                  }
                  className="px-2.5 py-1 bg-teal-50/70 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-[11px] font-medium text-teal-900 dark:text-teal-300 rounded-lg border border-teal-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  👤 Alex (Software Eng.)
                </button>
              </div>
            </div>

            {/* Bottom Guest Option & Privacy Note */}
            <div className="pt-1 text-center space-y-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 font-semibold underline cursor-pointer"
              >
                Skip and explore as Guest
              </button>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>Encrypted medical records &bull; HIPAA &amp; GDPR compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
