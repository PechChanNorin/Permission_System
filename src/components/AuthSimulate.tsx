/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogIn, Check, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthStyles } from './AuthStyles';
import { supabase } from '../supabaseClient';

interface AuthSimulateProps {
  onLoginSuccess: () => void;
}

export default function AuthSimulate({ onLoginSuccess }: AuthSimulateProps) {
  const { signInWithGoogle } = useAuth();
  
  // State for tabs
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  
  // Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    if (activeTab === 'signup' && !fullName) {
      setErrorMsg('Please fill in your full name.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLoginSuccess();
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullname: fullName,
              full_name: fullName,
              phone: phone,
              role: role,
            }
          }
        });
        if (error) throw error;

        // If automatic email confirmation is on, we might need a notice, but usually in sandbox they get signed in automatically
        if (data.session) {
          setSuccessMsg('Registration successful!');
          setTimeout(() => {
            onLoginSuccess();
          }, 1000);
        } else {
          setSuccessMsg('Registration successful! Please check your email inbox to verify your account.');
          setActiveTab('signin');
        }
      }
    } catch (err: any) {
      console.error('Authentication exception:', err);
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      console.error('Google login error:', err);
      setErrorMsg(err.message || 'Failed to initialize Google login.');
    }
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
          
          {/* Interactive Tab Selectors */}
          <div className={AuthStyles.interaction.tabContainer}>
            <button
              type="button"
              className={activeTab === 'signin' ? AuthStyles.interaction.tabButtonActive : AuthStyles.interaction.tabButtonInactive}
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={activeTab === 'signup' ? AuthStyles.interaction.tabButtonActive : AuthStyles.interaction.tabButtonInactive}
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              Register
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className={AuthStyles.interaction.errorBanner}>
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-2xl mb-6 flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className={AuthStyles.interaction.formContainer}>
            {activeTab === 'signup' && (
              <>
                <div className={AuthStyles.interaction.fieldGroup}>
                  <label className={AuthStyles.interaction.label}>Full Name</label>
                  <input
                    type="text"
                    required
                    className={AuthStyles.interaction.input}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    disabled={loading}
                  />
                </div>

                <div className={AuthStyles.interaction.gridTwoCols}>
                  <div className={AuthStyles.interaction.fieldGroup}>
                    <label className={AuthStyles.interaction.label}>Role</label>
                    <select
                      className={AuthStyles.interaction.select}
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      disabled={loading}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>

                  <div className={AuthStyles.interaction.fieldGroup}>
                    <label className={AuthStyles.interaction.label}>Phone Number</label>
                    <input
                      type="tel"
                      className={AuthStyles.interaction.input}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 012345678"
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            <div className={AuthStyles.interaction.fieldGroup}>
              <label className={AuthStyles.interaction.label}>Email Address</label>
              <input
                type="email"
                required
                className={AuthStyles.interaction.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                disabled={loading}
              />
            </div>

            <div className={AuthStyles.interaction.fieldGroup}>
              <label className={AuthStyles.interaction.label}>Password</label>
              <input
                type="password"
                required
                className={AuthStyles.interaction.inputMono}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={AuthStyles.interaction.submitButton}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : activeTab === 'signin' ? (
                <>
                  Sign In
                  <LogIn className="w-4 h-4" />
                </>
              ) : (
                <>
                  Register Account
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
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
