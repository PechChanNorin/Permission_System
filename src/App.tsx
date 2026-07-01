import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import AuthSimulate from './components/AuthSimulate';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';
import DBPlayground from './components/DBPlayground';
import { supabase } from './supabaseClient';

const AppContent = () => {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('users').select('*').eq('id', user.id).single().then(({ data }) => {
        setProfile(data);
        if (data) {
          const userObj = {
            ...data,
            avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.fullname || 'user')}`
          };
          setActiveUser(userObj);
        }
        setCheckingProfile(false);
      });
    } else {
      setCheckingProfile(false);
    }
  }, [user]);

  // Clean up old OAuth error parameters from the address bar when logged in successfully
  useEffect(() => {
    if (user && profile) {
      const url = new URL(window.location.href);
      if (url.search || url.hash) {
        url.search = '';
        url.hash = '';
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, [user, profile]);

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
                  role: role as any,
                  onboarding_completed: true, 
                  status: 'active'
                };
                
                console.log("Attempting to save profile...", userData);
                
                // 1. Try pure insert first (permissive RLS insert policy applies, no upsert-related UPDATE RLS checks)
                let { error } = await supabase
                  .from('users')
                  .insert(userData);
                  
                // 2. If it fails because the row already exists (duplicate key error), perform a clean update
                if (error && (error.code === '23505' || error.message?.toLowerCase().includes('duplicate') || error.message?.toLowerCase().includes('already exists'))) {
                  console.log("Profile already exists. Performing clean update instead.");
                  const { error: updateError } = await supabase
                    .from('users')
                    .update({
                      fullname: name,
                      phone: phone,
                      role: role as any,
                      onboarding_completed: true,
                      status: 'active'
                    })
                    .eq('id', user.id);
                  error = updateError;
                }
                
                if (error) {
                    console.error("Error saving profile:", error);
                    if (error.message?.includes('violates foreign key constraint "users_id_fkey"') || error.message?.includes('users_id_fkey')) {
                        alert(
                          "Database Alignment Required:\n\n" +
                          "Your current login session ID does not exist in your database's Auth registry.\n\n" +
                          "This usually happens when you recently reset or re-created your database tables while keeping your browser's old login session cookie/token active.\n\n" +
                          "To fix this, please click 'Log Out / Restart Session' below, refresh the page, and sign in again to register your account cleanly!"
                        );
                    } else {
                        alert("Error saving profile: " + error.message);
                    }
                } else {
                    const savedUser = {
                      ...userData,
                      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userData.fullname || 'user')}`
                    };
                    setProfile(savedUser);
                    setActiveUser(savedUser);
                }
              }}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              Complete Registration
            </button>
            
            <button
              onClick={() => signOut()}
              className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Log Out / Restart Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {activeUser && (
        <Header 
          currentUser={activeUser} 
          onUserChanged={(u) => setActiveUser(u)} 
          openDatabaseConsole={() => setShowConsole(true)} 
        />
      )}
      
      <main className="flex-grow">
        {activeUser?.role === 'student' && <StudentView currentStudentUser={activeUser} />}
        {activeUser?.role === 'teacher' && <TeacherView currentTeacherUser={activeUser} />}
        {activeUser?.role === 'admin' && <AdminView />}
      </main>

      {showConsole && (
        <DBPlayground onClose={() => setShowConsole(false)} />
      )}
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
