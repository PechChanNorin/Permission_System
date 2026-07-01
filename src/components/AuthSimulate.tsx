/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogIn, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthStyles } from './AuthStyles';

interface AuthSimulateProps {
  onLoginSuccess: () => void;
}

export default function AuthSimulate({ onLoginSuccess }: AuthSimulateProps) {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', email, password);
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    onLoginSuccess();
  };

  return (
    <div className={AuthStyles.wrapper}>
      <div className={AuthStyles.card}>
        
        {/* Left branding panel */}
        <div className={AuthStyles.branding.panel}>
          <div className={AuthStyles.branding.glowTop} />
          <div className={AuthStyles.branding.glowBottom} />

          <div className="relative">
            <h1 className={AuthStyles.branding.heading}>
              Permiso Attendance System
            </h1>
            <p className={AuthStyles.branding.description}>
              Digital Attendance & Absence Management Platform.
            </p>
          </div>

          <div className={AuthStyles.branding.featureList}>
            <div className={AuthStyles.branding.featureRow}>
              <Check className={AuthStyles.branding.featureCheckIcon} />
              <p className={AuthStyles.branding.featureText}>Secure Row-Level Security</p>
            </div>
            <div className={AuthStyles.branding.featureRow}>
              <Check className={AuthStyles.branding.featureCheckIcon} />
              <p className={AuthStyles.branding.featureText}>Real-time Absence Registries</p>
            </div>
          </div>

          <div className="relative pt-6 border-t border-indigo-500/50 flex items-center justify-between">
            <span className={AuthStyles.branding.footerText}>
              SECURED ACADEMIC INTERFACE
            </span>
          </div>
        </div>

        {/* Right interaction form */}
        <div className={AuthStyles.interaction.panel}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-2">Sign in or create an account to get started.</p>
          </div>

          <form onSubmit={handleLogin} className={AuthStyles.interaction.formContainer}>
            <div className={AuthStyles.interaction.fieldGroup}>
              <label className={AuthStyles.interaction.label}>Email or Phone</label>
              <input
                type="text"
                className={AuthStyles.interaction.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
              />
            </div>
            <div className={AuthStyles.interaction.fieldGroup}>
              <label className={AuthStyles.interaction.label}>Password</label>
              <input
                type="password"
                className={AuthStyles.interaction.inputMono}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className={AuthStyles.interaction.submitButton}
            >
              Sign In / Register
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
