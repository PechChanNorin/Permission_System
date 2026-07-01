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

  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('student');

  if (loading || checkingProfile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <AuthSimulate onLoginSuccess={() => {}} />;
  }

  if (user && (!profile || !profile.onboarding_completed)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="p-8 border border-slate-200 rounded-xl shadow-sm w-full max-w-md bg-white">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Complete Your Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" className="w-full p-2 border border-slate-300 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input type="text" className="w-full p-2 border border-slate-300 rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <select className="w-full p-2 border border-slate-300 rounded-lg" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <button 
              onClick={async () => {
                const userData = { 
                  id: user.id, 
                  email: user.email, 
                  fullname: name,
                  phone: phone,
                  role: role,
                  onboarding_completed: true, 
                  status: 'active'
                };
                const { error } = await supabase.from('users').upsert(userData);
                if (error) {
                    console.error("Error upserting profile:", error);
                    alert("Error saving profile: " + error.message);
                } else {
                    setProfile(userData);
                }
              }}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              Complete Registration
            </button>
          </div>
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
