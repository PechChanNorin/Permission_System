/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LogIn, Check, UserPlus
} from 'lucide-react';
import { User } from '../types';
import { useAuthForm } from './useAuthForm';
import { AuthStyles } from './AuthStyles';

interface AuthSimulateProps {
  onLoginSuccess: (user: User) => void;
}

export default function AuthSimulate({ onLoginSuccess }: AuthSimulateProps) {
  const {
    activeTab,
    changeTab,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    regName,
    setRegName,
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    regRole,
    setRegRole,
    regPhone,
    setRegPhone,
    regSpecialty,
    setRegSpecialty,
    regClass,
    setRegClass,
    loading,
    errorMsg,
    handleStandardLogin,
    handleSignUp,
  } = useAuthForm({ onLoginSuccess });

  // JWT Decoder for Google Credential
  const decodeJwtResponse = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT decoding error:", e);
      return null;
    }
  };

  // Callback to receive credential token from Google
  const handleCredentialResponse = (response: any) => {
    if (response && response.credential) {
      const payload = decodeJwtResponse(response.credential);
      if (payload && payload.email) {
        if (activeTab === 'signin') {
          setEmailInput(payload.email);
        } else {
          setRegEmail(payload.email);
          if (payload.name) {
            setRegName(payload.name);
          }
        }
      }
    }
  };

  React.useEffect(() => {
    let intervalId: any;

    const initializeGoogle = () => {
      const googleObj = (window as any).google;
      if (googleObj && googleObj.accounts && googleObj.accounts.id) {
        clearInterval(intervalId);
        try {
          const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "1028795094970-m12bqqrff67d32vggas9tqisv3re77d8.apps.googleusercontent.com";
          googleObj.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          const btnEl = document.getElementById("google-signin-btn");
          if (btnEl) {
            googleObj.accounts.id.renderButton(
              btnEl,
              {
                theme: "outline",
                size: "large",
                width: 280,
                logo_alignment: "left",
                text: activeTab === 'signin' ? 'signin_with' : 'signup_with'
              }
            );
          }
        } catch (err) {
          console.error("Failed to initialize Google GSI SDK button", err);
        }
      }
    };

    intervalId = setInterval(initializeGoogle, 300);
    initializeGoogle();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab]);

  return (
    <div className={AuthStyles.wrapper}>
      <div className={AuthStyles.card}>
        
        {/* Left branding panel - Modern Swiss Theme configurable via AuthStyles */}
        <div className={AuthStyles.branding.panel}>
          {/* Ambient Design highlights */}
          <div className={AuthStyles.branding.glowTop} />
          <div className={AuthStyles.branding.glowBottom} />

          <div className="relative">
            <div className={AuthStyles.branding.logoContainer}>
              <span className={AuthStyles.branding.logoChar}>P</span>
            </div>
            
            <h1 className={AuthStyles.branding.heading}>
              Digital Attendance & Absence Management Platform
            </h1>
            <p className={AuthStyles.branding.description}>
              Replacing fragmented paper permissions with high-trust real-time workflows and advisor alerts.
            </p>
          </div>

          <div className={AuthStyles.branding.featureList}>
            <div className={AuthStyles.branding.featureRow}>
              <Check className={AuthStyles.branding.featureCheckIcon} />
              <p className={AuthStyles.branding.featureText}>Row-Level Security constraints lock student absence data to authorized staff.</p>
            </div>
            <div className={AuthStyles.branding.featureRow}>
              <Check className={AuthStyles.branding.featureCheckIcon} />
              <p className={AuthStyles.branding.featureText}>Dynamic notifications alert relevant advisors on real-time headcount absence registries.</p>
            </div>
            <div className={AuthStyles.branding.featureRow}>
              <Check className={AuthStyles.branding.featureCheckIcon} />
              <p className={AuthStyles.branding.featureText}>Advisors vet justifications (prescriptions, championship duty) securely.</p>
            </div>
          </div>

          <div className="relative pt-6 border-t border-indigo-500/50 flex items-center justify-between">
            <span className={AuthStyles.branding.footerText}>
              SECURED ACADEMIC INTERFACE
            </span>
          </div>
        </div>

        {/* Right interaction form - Minimal Slate layout configurable via AuthStyles */}
        <div className={AuthStyles.interaction.panel}>
          <div>
            {/* Header / Tabs Selection */}
            <div className={AuthStyles.interaction.tabContainer}>
              <button
                onClick={() => changeTab('signin')}
                className={activeTab === 'signin' ? AuthStyles.interaction.tabButtonActive : AuthStyles.interaction.tabButtonInactive}
              >
                Sign In
              </button>
              <button
                onClick={() => changeTab('signup')}
                className={activeTab === 'signup' ? AuthStyles.interaction.tabButtonActive : AuthStyles.interaction.tabButtonInactive}
              >
                Register Identity
              </button>
            </div>

            {/* Google Sign-In Button Container */}
            <div className="mb-5 pb-5 border-b border-dashed border-slate-100 flex flex-col items-center">
              <label className={AuthStyles.interaction.label + " mb-2 text-center block w-full text-slate-400 text-[10px]"}>
                Quick Autofill with Google
              </label>
              <div id="google-signin-btn" className="flex justify-center min-h-[40px] max-w-full"></div>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className={AuthStyles.interaction.errorBanner}>
                <span>⚠️</span> {errorMsg}
              </div>
            )}

            {/* LOGIN TAB */}
            {activeTab === 'signin' ? (
              <form onSubmit={handleStandardLogin} className={AuthStyles.interaction.formContainer}>
                <div className={AuthStyles.interaction.fieldGroup}>
                  <label className={AuthStyles.interaction.label}>
                    Username or Email Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. pechchannorin@gmail.com or Admin"
                    className={AuthStyles.interaction.input}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>

                <div className={AuthStyles.interaction.fieldGroup}>
                  <label className={AuthStyles.interaction.label}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    className={AuthStyles.interaction.inputMono}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={AuthStyles.interaction.submitButton}
                >
                  {loading ? 'Authenticating secure session...' : 'Authorize Login Credentials'}
                  {!loading && <LogIn className="w-3.5 h-3.5" />}
                </button>
              </form>
            ) : (
              /* REGISTRATION TAB */
              <form onSubmit={handleSignUp} className={AuthStyles.interaction.formContainer}>
                <div className={AuthStyles.interaction.fieldGroup}>
                  <label className={AuthStyles.interaction.label}>
                    Choose Registration Role
                  </label>
                  <select
                    className={AuthStyles.interaction.select}
                    value={regRole}
                    onChange={(e: any) => setRegRole(e.target.value)}
                  >
                    <option value="student">🎓 Student Identity</option>
                    <option value="teacher">🧑‍🏫 Instructor Faculty</option>
                  </select>
                </div>

                <div className={AuthStyles.interaction.fieldGroup}>
                  <label className={AuthStyles.interaction.label}>
                    Legal Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Timothy Vance"
                    className={AuthStyles.interaction.input}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div className={AuthStyles.interaction.gridTwoCols}>
                  <div className={AuthStyles.interaction.fieldGroup}>
                    <label className={AuthStyles.interaction.label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. timmy@permiso.edu"
                      className={AuthStyles.interaction.inputMono}
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                  <div className={AuthStyles.interaction.fieldGroup}>
                    <label className={AuthStyles.interaction.label}>
                      Phone No.
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 9912"
                      className={AuthStyles.interaction.inputMono}
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className={AuthStyles.interaction.fieldGroup}>
                  <label className={AuthStyles.interaction.label}>
                    Set Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter at least 6 characters"
                    className={AuthStyles.interaction.inputMono}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>

                {regRole === 'student' && (
                  <div className={AuthStyles.interaction.fieldGroup}>
                    <label className={AuthStyles.interaction.label}>
                      Select Academic Class Section
                    </label>
                    <select
                      className={AuthStyles.interaction.select}
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                    >
                      <option value="class-cs-2026-a">CS-2026-A (Computer Science)</option>
                      <option value="class-ba-2026-b">BA-2026-B (Business Administration)</option>
                    </select>
                  </div>
                )}

                {regRole === 'teacher' && (
                  <div className={AuthStyles.interaction.fieldGroup}>
                    <label className={AuthStyles.interaction.label}>
                      Classroom Speciality / Expertise
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cognitive Psychology, Cybernetics"
                      className={AuthStyles.interaction.input}
                      value={regSpecialty}
                      onChange={(e) => setRegSpecialty(e.target.value)}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={AuthStyles.interaction.submitButton}
                >
                  {loading ? 'Initializing record mappings...' : 'Submit Profile Registrations'}
                  {!loading && <UserPlus className="w-3.5 h-3.5" />}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
