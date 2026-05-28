/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Users, 
  Compass, 
  Cpu, 
  PlusCircle, 
  ChevronRight, 
  HelpCircle, 
  CheckCircle2, 
  FileCheck, 
  Award,
  Sparkles,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Lock,
  Settings
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';

import { UserProfile } from './types';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import CurriculumHub from './components/CurriculumHub';
import ResourceHub from './components/ResourceHub';
import DoubtSolver from './components/DoubtSolver';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'landing' | 'auth' | 'dashboard' | 'curriculum' | 'doubts' | 'resources'>('landing');
  const [authArg, setAuthArg] = useState<'signup' | 'login'>('signup');
  const authArgRef = useRef<'signup' | 'login'>('signup');
  
  useEffect(() => {
    authArgRef.current = authArg;
  }, [authArg]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted user on startup from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
            setActiveTab(prev => (prev === 'landing' || prev === 'auth') ? 'dashboard' : prev);
          } else {
            // If the document is missing and we are in login mode, we should create a fallback profile
            // so they are not permanently stuck. If it's signup mode, AuthPage handles it.
            if (authArgRef.current === 'login') {
              console.warn("User document missing on login, creating fallback...");
              const fallbackProfile: UserProfile = {
                name: firebaseUser.displayName || 'Student',
                email: firebaseUser.email || '',
                classLevel: '10',
                stream: 'General',
                examTarget: 'Board',
                isSubscribed: true,
                planId: 'class-10-scholar',
                subscriptionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                xpPoints: 0,
                badges: [],
                streakDays: 0,
                lastActiveDate: new Date().toISOString(),
                examDate: '2027-03-15'
              };
              setUser(fallbackProfile);
              setActiveTab(prev => (prev === 'landing' || prev === 'auth') ? 'dashboard' : prev);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({
            name: firebaseUser.displayName || 'Student',
            email: firebaseUser.email || '',
            classLevel: '10',
            stream: 'General',
            examTarget: 'Board',
            isSubscribed: true,
            planId: 'class-10-scholar',
            subscriptionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            xpPoints: 20,
            badges: ['Trial Pioneer'],
            streakDays: 1,
            lastActiveDate: new Date().toISOString(),
            examDate: '2027-03-15'
          });
          setActiveTab(prev => (prev === 'landing' || prev === 'auth') ? 'dashboard' : prev);
        }
      } else {
        setUser(null);
        setActiveTab('landing');
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleAuthComplete = async (profile: UserProfile) => {
    setUser(profile);
    setActiveTab('dashboard');
    // The profile is saved to Firestore within AuthPage.tsx, but we can do a sync here if needed.
  };

  const handleStartAuth = (mode: 'signup' | 'login') => {
    setAuthArg(mode);
    setActiveTab('auth');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveTab('landing');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handleNavigateToChapter = (chapterId: string) => {
    setActiveTab('curriculum');
    // Find chapters and match inside curriculum view
  };

  const handleUpdateUserProfile = async (updater: (prev: UserProfile) => UserProfile) => {
    if (!user || !auth.currentUser) return;
    const updatedUser = updater(user);
    // Eagerly update local state so UI doesn't block
    setUser(updatedUser);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedUser, { merge: true });
    } catch (error) {
      console.error("Failed to update user profile", error);
    }
  };

  // Direct content selections
  const renderPrivateContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} onUpdateUser={handleUpdateUserProfile} onNavigate={setActiveTab as any} />;
      case 'curriculum':
        return <CurriculumHub user={user} onUpdateUser={handleUpdateUserProfile} />;
      case 'resources':
        return <ResourceHub user={user} onUpdateUser={handleUpdateUserProfile} />;
      case 'doubts':
        return (
          <DoubtSolver 
            user={user} 
            isFloatingWidget={false} 
            onNavigateToChapter={handleNavigateToChapter} 
            onUpdateUser={handleUpdateUserProfile}
          />
        );
      default:
        return <Dashboard user={user} onUpdateUser={handleUpdateUserProfile} onNavigate={setActiveTab as any} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is at Landing or Auth level, display public routes directly
  if (!user || activeTab === 'landing' || activeTab === 'auth') {
    if (activeTab === 'auth') {
      return (
        <AuthPage 
          initialMode={authArg} 
          onAuthComplete={handleAuthComplete} 
          onBackToLanding={() => setActiveTab('landing')}
          onModeChange={setAuthArg}
        />
      );
    }
    return (
      <LandingPage 
        onStartAuth={handleStartAuth} 
        onExplorePlans={() => {
          const el = document.getElementById('pricing');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex relative overflow-hidden font-sans">
      
      {/* Absolute Ambient blur elements */}
      <div className="absolute top-[20%] left-[-5%] w-[30rem] h-[30rem] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[30rem] h-[30rem] rounded-full bg-[#10b981]/5 blur-[120px] pointer-events-none" />

      {/* Left drawer Collapsible Sidebar Navigation */}
      <aside className={`bg-[#13112B]/90 backdrop-blur-2xl border-r border-white/10 relative z-30 flex flex-col justify-between transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} shadow-2xl`}>
        <div>
          {/* Logo brand card */}
          <div className="h-20 border-b border-white/10 flex items-center justify-between px-4">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#10b981] flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-base tracking-wider text-white font-display">STUDY<span className="text-[#10b981]">BUDDY</span></span>
                  <div className="text-[9px] text-[#10b981]/60 tracking-widest font-mono uppercase font-bold">AI COMMAND</div>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#10b981] flex items-center justify-center mx-auto shadow-lg shadow-[#10b981]/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard Control', icon: <LayoutDashboard className="w-5 h-5" /> },
              { id: 'curriculum', label: 'Syllabus Curriculum', icon: <BookOpen className="w-5 h-5" /> },
              { id: 'resources', label: 'Reference & Docs', icon: <FileCheck className="w-5 h-5" /> },
              { id: 'doubts', label: 'AI Doubt Solver', icon: <Cpu className="w-5 h-5" /> }
            ].map((link) => {
              const isSelected = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`btn_nav_${link.id}`}
                  onClick={() => setActiveTab(link.id as any)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer group ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[#6366f1]/20 to-[#10b981]/20 text-white border border-[#6366f1]/30 shadow-inner' 
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`${isSelected ? 'text-[#10b981] drop-shadow-md' : 'text-white/40 group-hover:text-white/70'} transition-all`}>
                    {link.icon}
                  </div>
                  {sidebarOpen && <span className="truncate">{link.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User detail card & simulated Reset credentials link */}
        <div className="p-4 border-t border-white/10 space-y-4">
          
          {sidebarOpen && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#10b981] text-white font-bold flex items-center justify-center text-sm border border-white/20 uppercase shadow-md shrink-0">
                {user.name.substring(0, 2)}
              </div>
              <div className="text-left select-none overflow-hidden flex-1">
                <div className="text-sm font-semibold text-white/90 truncate">{user.name}</div>
                <div className="text-[10px] text-[#10b981] font-mono font-bold uppercase tracking-wider mt-0.5">{user.planId ? 'Premium Active' : '7n Trial Active'}</div>
              </div>
            </div>
          )}

          <div className="space-y-1.5 font-sans">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-semibold text-[#7E7E9F] hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span>Log Out Session</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content viewport layout */}
      <main className="flex-1 min-h-screen flex flex-col relative z-15 overflow-x-hidden">
        
        {/* Dynamic Header navbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 sm:px-8 bg-[#1e293b]/35 backdrop-blur-md relative z-10 shrink-0">
          <div>
            <span className="text-[10px] text-[#94a3b8] font-mono tracking-widest uppercase block">Indian Secondary Study Lab v2</span>
            <span className="text-sm font-semibold text-white sm:text-base capitalize">
              {activeTab === 'dashboard' ? 'Student Command Centre' : activeTab === 'curriculum' ? 'Structured Curriculum Hub' : activeTab === 'resources' ? 'Resource Summarization Desk' : '24/7 AI Doubt Solver'}
            </span>
          </div>

          {/* Quick Metrics display */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-white">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>XP Level: <strong className="text-[#10b981]">{user.xpPoints} Pts</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-white">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Streak Days: <strong className="text-rose-400">{user.streakDays} Days</strong></span>
            </div>
            
            {/* Class Plan status */}
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[#10b981] text-[9px] uppercase tracking-widest font-bold">
              Class {user.classLevel} {user.classLevel === '10' ? 'Scholar' : `${user.stream} Pro`}
            </span>
          </div>
        </header>

        {/* Sub page component display portal */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto pb-24 relative">
          {renderPrivateContent()}
        </div>

      </main>

      {/* FLOATING AI CHAT WIDGET DOCK BOTTOM RIGHT AS SPECIFIED */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
        <AnimatePresence>
          {showFloatingChat && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="shadow-2xl shadow-black/80"
            >
              <DoubtSolver 
                user={user} 
                isFloatingWidget={true} 
                onCloseFloating={() => setShowFloatingChat(false)}
                onNavigateToChapter={handleNavigateToChapter} 
                onUpdateUser={handleUpdateUserProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Circle launcher */}
        <button
          id="btn_floating_chat"
          onClick={() => setShowFloatingChat(!showFloatingChat)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#10b981] flex items-center justify-center text-[#0f172a] hover:brightness-110 shadow-lg shadow-[#6366f1]/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer relative"
          title="24/7 AI Doubt Solver Desk"
        >
          {showFloatingChat ? <X className="w-6 h-6 text-[#0f172a]" /> : <MessageSquare className="w-6 h-6 text-[#0f172a]" />}
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">AI</span>
        </button>
      </div>

    </div>
  );
}
