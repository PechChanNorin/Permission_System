import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import AuthSimulate from './components/AuthSimulate';
import { supabase } from './supabaseClient';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      supabase.from('users').select('*').eq('id', user.id).single().then(({ data }) => {
        setProfile(data);
        setCheckingProfile(false);
      });
    } else {
      setCheckingProfile(false);
    }
  }, [user]);

  if (loading || checkingProfile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <AuthSimulate onLoginSuccess={() => {}} />;
  }

  if (user && (!profile || !profile.onboarding_completed)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
          {/* Add form here */}
          <button 
            onClick={async () => {
              if (profile) {
                await supabase.from('users').update({ onboarding_completed: true }).eq('id', user.id);
              } else {
                await supabase.from('users').insert({ 
                  id: user.id, 
                  email: user.email, 
                  fullname: user.user_metadata?.full_name || 'New User',
                  onboarding_completed: true, 
                  status: 'active',
                  role: 'student'
                });
              }
              setProfile({ ...profile, onboarding_completed: true });
            }}
            className="bg-blue-600 text-white p-2 rounded"
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Authenticated Dashboard</h1>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
