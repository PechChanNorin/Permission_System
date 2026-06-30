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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Welcome to Permiso</h2>
            <p className="text-sm text-slate-500">Sign in or create an account to get started.</p>
          </div>

          <form onSubmit={handleLogin} className={AuthStyles.interaction.formContainer}>
            <div className={AuthStyles.interaction.fieldGroup}>
              <label className={AuthStyles.interaction.label}>Email / Phone</label>
              <input
                type="text"
                className={AuthStyles.interaction.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone"
              />
            </div>
            <div className={AuthStyles.interaction.fieldGroup}>
              <label className={AuthStyles.interaction.label}>Password</label>
              <input
                type="password"
                className={AuthStyles.interaction.inputMono}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className={AuthStyles.interaction.submitButton}
            >
              Sign In / Register
              <LogIn className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="my-6 text-center text-slate-400 text-xs uppercase font-bold">Or continue with</div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-slate-200 p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-xs"
          >
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
