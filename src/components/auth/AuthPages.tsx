import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { login, signUp, resetPasswordSimulated, UserProfile } from '../../services/authService';

interface AuthPagesProps {
  onAuthSuccess: (user: UserProfile) => void;
  onBackToApp: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ onAuthSuccess, onBackToApp }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetFormState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const profile = await login(email, password);
      onAuthSuccess(profile);
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const profile = await signUp(name, email, password);
      onAuthSuccess(profile);
    } catch (err: any) {
      setErrorMsg(err.message || 'Account registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      resetPasswordSimulated(email);
      setSuccessMsg('Simulated password reset instructions sent. Please check console logs.');
    } catch (err: any) {
      setErrorMsg(err.message || 'No account found with this email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-8 relative z-10 shadow-2xl space-y-6 animate-fade-in">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' && 'Welcome Back 👋'}
            {mode === 'signup' && 'Create Account 🧭'}
            {mode === 'forgot' && 'Reset Password 🔒'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' && 'Log in to access your dashboard, saved trips, and history'}
            {mode === 'signup' && 'Sign up to customize, save, and track your travels'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Global Feedback Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-semibold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-semibold">
            {successMsg}
          </div>
        )}

        {/* Form rendering */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => { resetFormState(); setMode('forgot'); }}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-10 py-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-75 shrink-0 transition-transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Your Name</label>
              <div className="relative flex items-center">
                <User className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-10 py-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-10 py-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-75 shrink-0 transition-transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-75 shrink-0 transition-transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Requesting Reset...</span>
                </>
              ) : (
                <span>Request Reset</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { resetFormState(); setMode('login'); }}
              className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Mode switcher footer links */}
        <div className="flex flex-col items-center space-y-4 pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400">
            {mode === 'login' && (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => { resetFormState(); setMode('signup'); }}
                  className="text-sky-400 hover:text-sky-300 font-bold ml-1 transition-colors"
                >
                  Create account
                </button>
              </>
            )}
            {mode === 'signup' && (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { resetFormState(); setMode('login'); }}
                  className="text-sky-400 hover:text-sky-300 font-bold ml-1 transition-colors"
                >
                  Log in
                </button>
              </>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => { resetFormState(); setMode('login'); }}
                className="text-sky-400 hover:text-sky-300 font-bold transition-colors"
              >
                Log In Instead
              </button>
            )}
          </div>

          {/* Guest Mode link */}
          <button
            onClick={onBackToApp}
            className="text-xs text-slate-500 hover:text-slate-300 font-medium flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
