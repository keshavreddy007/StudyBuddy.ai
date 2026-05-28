/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Calendar, 
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
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, StudyPlanDay } from '../types';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (updater: (prev: UserProfile) => UserProfile) => void;
  onNavigate: (tab: 'dashboard' | 'curriculum' | 'doubts' | 'resources') => void;
}

export default function Dashboard({ user, onUpdateUser, onNavigate }: DashboardProps) {
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState(false);
  const [weakSubjects, setWeakSubjects] = useState(user.weakSubjects || '');
  
  // Daily Challenge State
  const [answeredDaily, setAnsweredDaily] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isDailyCorrect, setIsDailyCorrect] = useState<boolean | null>(null);

  // Computed Exam Countdown days
  const [countdownDays, setCountdownDays] = useState(0);

  useEffect(() => {
    if (user.examDate) {
      const target = new Date(user.examDate);
      const diffTime = target.getTime() - Date.now();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCountdownDays(diffDays > 0 ? diffDays : 0);
    }
  }, [user.examDate]);

  // Load custom schedule
  const fetchCustomSchedule = async () => {
    setLoadingSchedule(true);
    setScheduleError(false);
    try {
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel: user.classLevel,
          stream: user.stream,
          examTarget: user.examTarget,
          examDate: user.examDate,
          weakSubjects: weakSubjects || 'Organic Chemistry, Calculus integration limits'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.plan) {
        onUpdateUser(prev => ({ ...prev, studyPlan: data.plan, weakSubjects }));
      } else {
        throw new Error("No plan returned");
      }
    } catch (err) {
      console.error(err);
      setScheduleError(true);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    if (!user.studyPlan || user.studyPlan.length === 0) {
      fetchCustomSchedule();
    }
  }, [user.classLevel, user.stream]);

  // Daily Challenge Question Data
  const dailyQuestion = {
    question: "Which quantum state or rule forbids two identical fermions from occupying the same position/state simultaneously?",
    options: [
      "Hund's Rule of Maximum Multiplicity",
      "Heisenberg Uncertainty Principal theory",
      "Pauli Exclusion Principle formulation",
      "De Broglie dual wavelength index"
    ],
    correctIndex: 2,
    xpReward: 25,
    explanation: "The Pauli Exclusion Principle states that no two electrons (fermions) in an atom can have the exact same four quantum numbers."
  };

  const handleDailyAnswer = (idx: number) => {
    if (answeredDaily) return;
    setSelectedOption(idx);
    setAnsweredDaily(true);
    const correct = idx === dailyQuestion.correctIndex;
    setIsDailyCorrect(correct);

    if (correct) {
      onUpdateUser(prev => ({
        ...prev,
        xpPoints: prev.xpPoints + dailyQuestion.xpReward,
        badges: prev.badges.includes('Quantum Master') ? prev.badges : [...prev.badges, 'Quantum Master']
      }));
    }
  };

  // Dummy mock leaderboard
  const mockLeaderboard = [
    { rank: 1, name: 'Aarav Mehta', stream: 'PCM', class: '12', xp: 2190, current: true },
    { rank: 2, name: 'Simran Jolly', stream: 'PCB', class: '12', xp: 1940, current: false },
    { rank: 3, name: user.name, stream: user.stream, class: user.classLevel, xp: user.xpPoints, current: true },
    { rank: 4, name: 'Suhail Khan', stream: 'Commerce', class: '11', xp: 480, current: false },
    { rank: 5, name: 'Divya Iyer', stream: 'General', class: '10', xp: 350, current: false }
  ].sort((a, b) => b.xp - a.xp);

  // Subject completion arrays for rings styling
  const subjectList = user.classLevel === '10' 
    ? [
        { name: 'Mathematics', desc: 'Real Numbers, Quadratic, Trig', coverage: 75, color: '#10b981' },
        { name: 'Science', desc: 'Spherical Optics, Carbon compounds', coverage: 60, color: '#6366f1' },
        { name: 'Social Studies', desc: 'Nationalism, Civics, maps', coverage: 40, color: '#FFB86C' }
      ]
    : [
        { name: 'Physics', desc: 'Kinematics, Thermal, Electrostatics', coverage: 65, color: '#10b981' },
        { name: 'Chemistry', desc: 'Atomic Hybridization, Organic chains', coverage: 50, color: '#6366f1' },
        { name: 'Mathematics / Biology', desc: 'Calculus, Vectors, Genetics', coverage: 45, color: '#FFB86C' }
      ];

  return (
    <div className="space-y-6">
      
      {/* Dynamic Greetings and Stats banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#13132B]/90 via-[#334155]/90 to-[#1F174B]/90 backdrop-blur-xl border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-black/50 min-h-[160px]">
          <div className="absolute right-[-5%] top-[-20%] w-64 h-64 bg-[#10b981]/15 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute left-[-10%] bottom-[-20%] w-64 h-64 bg-[#6366f1]/15 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#10b981]/20 border border-[#6366f1]/30 text-[10px] text-[#10b981] font-mono uppercase tracking-widest font-bold shadow-sm shadow-[#10b981]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" /> IIT-JEE / NEET COGNITIVE STUDY ACCESS
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">Jai Hind, {user.name}!</h1>
            <p className="text-sm text-white/60 max-w-xl leading-relaxed">
              Your profile is calibrated for <strong className="text-white/90">Class {user.classLevel}</strong> under Stream <strong className="text-white/90">{user.stream}</strong>. The diagnostic engine suggests prioritizing Organic Chemistry structural models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-mono">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white shadow-inner">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>XP Level: <strong className="text-[#10b981]">{user.xpPoints} Pts</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white shadow-inner">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Streak: <strong className="text-rose-400">{user.streakDays} Days</strong></span>
            </div>
          </div>
        </div>

        {/* Exams Countdown Grid */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 flex flex-col justify-between relative shadow-2xl shadow-black/50 min-h-[160px] overflow-hidden">
          <div className="absolute right-[-10%] bottom-[-10%] w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="space-y-1 relative z-10">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">Countdown to target</div>
            <h3 className="text-sm font-semibold text-white/90 uppercase">{user.examTarget} BOARD / ENTRANCE EXAM</h3>
          </div>

          <div className="my-4 relative z-10">
            <span className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-amber-500 tracking-tight drop-shadow-sm">
              {countdownDays}
            </span>
            <span className="text-sm font-medium text-white/60 ml-2">Days Left</span>
            <p className="text-[11px] text-white/40 mt-2 font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Target: {user.examDate || 'March 2027'}
            </p>
          </div>

          <p className="text-[11px] font-medium text-amber-300/90 flex items-center gap-1.5 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 w-fit relative z-10">
            <TrendingUp className="w-3.5 h-3.5" /> Optimize schedules daily to maximize score bandwidth.
          </p>
        </div>
      </div>

      {/* Primary Navigation shortcuts row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {[
          { tab: 'curriculum', label: 'Curriculum', icon: <BookOpen className="w-5 h-5 text-[#10b981]" />, desc: 'Structured revision map' },
          { tab: 'doubts', label: 'AI Doubt Solver', icon: <Cpu className="w-5 h-5 text-[#6366f1]" />, desc: 'Instant step-by-step solutions' },
          { tab: 'resources', label: 'Reference Base', icon: <FileCheck className="w-5 h-5 text-[#6366f1]" />, desc: 'Convert notes / PDFs' },
          { tab: 'curriculum', label: 'Past Papers', icon: <Trophy className="w-5 h-5 text-rose-400" />, desc: 'JEE/NEET archives' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(item.tab as any)}
            className="p-5 rounded-3xl bg-[#1e293b]/60 backdrop-blur-sm border border-white/5 hover:border-white/20 hover:bg-[#334155]/40 hover:-translate-y-1 text-left transition-all duration-300 cursor-pointer group shadow-lg"
          >
            <div className="mb-4 p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 border border-white/5">{item.icon}</div>
            <div className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{item.label}</div>
            <p className="text-[11px] text-white/50 mt-1 leading-snug">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Main Grid: Subject Coverage on Left, Daily Challenge & Leaderboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course Coverage Circles on Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#1e293b] border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">Course Progress Metrics</h3>
                <p className="text-xs text-[#94a3b8]">Completion tracks calibrated across syllabus weightings.</p>
              </div>
              <span className="text-[10px] uppercase font-mono bg-white/5 text-white px-2 py-0.5 rounded">All Subjects</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {subjectList.map((sub, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#020617] border border-white/5 flex flex-col items-center text-center">
                  {/* custom SVG progress loop */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
                      <circle cx="40" cy="40" r="32" stroke={sub.color} strokeWidth="6" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 32}
                        strokeDashoffset={2 * Math.PI * 32 * (1 - sub.coverage / 100)}
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-white font-mono">{sub.coverage}%</span>
                  </div>

                  <span className="text-xs font-semibold text-white mt-3 truncate w-full">{sub.name}</span>
                  <p className="text-[9px] text-[#94a3b8] mt-0.5 leading-normal">{sub.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Custom Planner & Weak Area highlights */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1]/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <div className="p-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20">
                    <Cpu className="w-4 h-4 text-[#10b981]" />
                  </div>
                  Cognitive Target Planner
                </h3>
                <p className="text-xs text-white/50 mt-1">AI-generated modular tracks prioritizing your weak subjects.</p>
              </div>

              {/* Refresh tracker inputs */}
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <input
                  type="text"
                  placeholder="Set weak areas..."
                  value={weakSubjects}
                  onChange={(e) => setWeakSubjects(e.target.value)}
                  className="w-full sm:w-40 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 text-[11px] text-[#f8fafc] focus:outline-none focus:border-[#6366f1] transition-all"
                />
                <button
                  id="btn_refresh_plan"
                  onClick={fetchCustomSchedule}
                  disabled={loadingSchedule}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-2"
                  title="Generate Revised plan via Gemini"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSchedule ? 'animate-spin' : ''}`} />
                  <span className="sm:hidden">Refresh Plan</span>
                </button>
              </div>
            </div>

            {loadingSchedule ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-t-2 border-[#10b981] animate-spin drop-shadow-md" />
                <span className="text-xs text-[#10b981] font-mono animate-pulse">Consulting AI Planner Database...</span>
              </div>
            ) : scheduleError ? (
              <div className="py-12 flex flex-col items-center justify-center text-center bg-red-500/5 border border-red-500/10 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                <h4 className="text-sm font-semibold text-white mb-1">Failed to generate planner</h4>
                <p className="text-xs text-white/50 max-w-xs mb-5">We encountered an error while communicating with the AI service. Please try again.</p>
                <button
                  onClick={fetchCustomSchedule}
                  className="px-5 py-2 rounded-xl bg-red-500/10 text-red-300 text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer"
                >
                  Retry Generation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(user.studyPlan || []).map((day, dIdx) => (
                  <div key={dIdx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:items-start gap-4 justify-between relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#6366f1] to-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#6366f1]/15 border border-[#6366f1]/20 text-[#6366f1] font-mono text-[10px] uppercase font-bold tracking-wider">DAY {day.day}</span>
                        <div className="text-sm font-bold text-white/90">{day.date}</div>
                      </div>
                      <p className="text-[13px] text-white/70 mt-1 leading-snug">{day.goal}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {day.topics?.map((tp, tIdx) => (
                          <span key={tIdx} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-white/60 border border-white/10 font-medium tracking-wide">
                            {tp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-1 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Challenge & Leaderboard on Right column */}
        <div className="space-y-6">
          
          {/* Daily Challenge Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1e293b]/80 to-[#1F174B]/60 backdrop-blur-xl border border-[#6366f1]/10 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#6366f1]/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex justify-between items-start mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold bg-[#6366f1]/10 text-[#6366f1] px-3 py-1 rounded-full border border-[#6366f1]/20">
                <Flame className="w-3.5 h-3.5 text-[#6366f1]" /> Daily Challenge
              </span>
              <span className="text-[11px] text-[#10b981] font-mono font-bold bg-[#10b981]/10 px-2.5 py-1 rounded-full border border-[#10b981]/20">+{dailyQuestion.xpReward} XP</span>
            </div>

            <h4 className="text-sm sm:text-base font-semibold text-white/90 leading-relaxed mb-6 font-display">{dailyQuestion.question}</h4>

            <div className="space-y-3 text-xs sm:text-sm font-medium">
              {dailyQuestion.options.map((opt, oIdx) => {
                let btnStyle = 'border-white/5 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04] hover:text-white';
                if (answeredDaily) {
                  if (oIdx === dailyQuestion.correctIndex) {
                    btnStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
                  } else if (selectedOption === oIdx) {
                    btnStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-400';
                  } else {
                    btnStyle = 'opacity-40 border-white/5 bg-transparent text-white/30';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    id={`btn_daily_ans_${oIdx}`}
                    onClick={() => handleDailyAnswer(oIdx)}
                    disabled={answeredDaily}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {answeredDaily && (
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-xs sm:text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
                {isDailyCorrect ? (
                  <span className="text-[#10b981] font-semibold flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4" /> Perfect! +{dailyQuestion.xpReward} XP added.
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" /> Incorrect. Let's review:
                  </span>
                )}
                <p className="text-white/60">{dailyQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Leaderboard container */}
          <div className="p-6 rounded-2xl bg-[#1e293b] border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h4 className="text-sm font-bold text-white">Top Scholar Rankings</h4>
                <p className="text-[10px] text-[#94a3b8]">IIT-JEE/NEET active cohort</p>
              </div>
              <Users className="w-4 h-4 text-[#10b981]" />
            </div>

            <div className="space-y-2.5">
              {mockLeaderboard.map((lead, lIdx) => (
                <div 
                  key={lIdx} 
                  className={`p-2.5 rounded-lg flex items-center justify-between text-xs transition-colors ${lead.current ? 'bg-[#6366f1]/10 border border-[#6366f1]/20' : 'bg-[#020617] border border-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] ${lIdx === 0 ? 'bg-amber-400 text-[#0f172a]' : lIdx === 1 ? 'bg-slate-300 text-[#0f172a]' : lIdx === 2 ? 'bg-amber-600 text-white' : 'text-[#94a3b8]'}`}>
                      {lIdx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-white block truncate max-w-[110px]">{lead.name} {lead.current && ' (You)'}</span>
                      <span className="text-[9px] text-[#94a3b8] font-mono">Class {lead.class} ({lead.stream})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-white block">{lead.xp} pts</span>
                    <span className="text-[8px] uppercase tracking-widest text-[#10b981]">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
