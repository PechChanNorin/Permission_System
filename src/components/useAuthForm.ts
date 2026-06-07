import React, { useState } from 'react';
import { mockDB } from '../services/mock_db';
import { User, UserRole } from '../types';

interface UseAuthFormProps {
  onLoginSuccess: (user: User) => void;
}

export function useAuthForm({ onLoginSuccess }: UseAuthFormProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Sign Up inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regPhone, setRegPhone] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('');
  const [regClass, setRegClass] = useState('class-cs-2026-a');

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setErrorMsg('Please enter your Username or Email details.');
      return;
    }
    if (!passwordInput) {
      setErrorMsg('Please enter your account password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const user = mockDB.login(emailInput, passwordInput);
      if (user) {
        onLoginSuccess(user);
      } else {
        setErrorMsg('Invalid login credentials. Please verify your Username or Email, and Password.');
        setLoading(false);
      }
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!regName || !regEmail) {
      setErrorMsg('Please enter Full Name and email address to register.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Please enter a password of at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      // Create a username based on the full name (lowercase, no spaces)
      const parsedUsername = regName.replace(/\s+/g, '').toLowerCase() || regEmail.split('@')[0];
      
      const newUser = mockDB.registerUser(regName, regEmail, regRole, {
        username: parsedUsername,
        password: regPassword,
        phone: regPhone,
        specialization: regRole === 'teacher' ? regSpecialty : undefined,
        class_id: regRole === 'student' ? regClass : undefined,
      });
      
      onLoginSuccess(newUser);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registrations failed.');
      setLoading(false);
    }
  };

  const changeTab = (tab: 'signin' | 'signup') => {
    setErrorMsg('');
    setActiveTab(tab);
  };

  return {
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
  };
}
