/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Sparkles, 
  ArrowRight, 
  Tv, 
  HelpCircle, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  HelpCircle as QuestionIcon, 
  MessageSquare, 
  Flame, 
  Star,
  Binary,
  Lightbulb,
  Cpu,
  Atom
} from 'lucide-react';
import { ClassLevel, Stream } from '../types';

interface LandingPageProps {
  onStartAuth: (role: 'signup' | 'login') => void;
  onExplorePlans: () => void;
}

export default function LandingPage({ onStartAuth, onExplorePlans }: LandingPageProps) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual');

  const faqs = [
    {
      q: 'Does it cover my state board or is it just CBSE?',
      a: 'We cover the unified NCERT-aligned syllabus which forms 100% of the CBSE, JEE, and NEET syllabus, and is highly relevant for State Boards (like MH-HSC, UP Board, and TS/AP board) and state CETs.'
    },
    {
      q: 'How does the AI Doubt Solver read my handwritten handwriting?',
      a: 'Our AI uses advanced visual-occlusion processing. When you upload a photo of your math or physics notebook, it translates the text into clean equations, determines the logical topic, and outputs fully drafted step-by-step solutions.'
    },
    {
      q: 'Can I cancel my free trial before the 7 days are up?',
      a: 'Absolutely! Our 7-day free trial requires zero credit card input. You can experience the full scope of Class 10 Scholar or IIT-JEE/NEET Pro freely, then decide whether to activate billing.'
    },
    {
      q: 'What makes this better than standard tuition classes?',
      a: 'Tuitions charge upwards of ₹20,000/year and don\'t answer doubts at midnight. For less than ₹499/year (essentially ₹41/month), you get 24/7 unlimited master-class doubt solving, automated custom summarizers for any reference material, and structured MCQ mock grids!'
    }
  ];

  const floatingSubjects = [
    { name: 'Physics', icon: <Atom className="w-5 h-5 text-cyan-400" />, color: 'shadow-[0_0_15px_rgba(34,211,238,0.3)] border-cyan-500/30', x: -140, y: -90 },
    { name: 'Maths', icon: <Binary className="w-5 h-5 text-teal-400" />, color: 'shadow-[0_0_15px_rgba(20,184,166,0.3)] border-teal-500/30', x: 140, y: -100 },
    { name: 'Chemistry', icon: <Cpu className="w-5 h-5 text-violet-400" />, color: 'shadow-[0_0_15px_rgba(139,92,246,0.3)] border-violet-500/30', x: -120, y: 100 },
    { name: 'Biology', icon: <Lightbulb className="w-5 h-5 text-rose-400" />, color: 'shadow-[0_0_15px_rgba(244,63,94,0.3)] border-rose-500/30', x: 125, y: 95 }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] relative overflow-hidden selection:bg-[#10b981]/30 selection:text-[#10b981] font-sans">
      
      {/* Dynamic Grid Background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,72,153,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Embedded Ambient Blurry Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#6366f1]/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#10b981]/10 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#10b981] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg tracking-wider text-white">STUDY<span className="text-[#10b981]">BUDDY</span></span>
            <div className="text-[10px] text-[#94a3b8] tracking-widest font-mono uppercase">AI Command Centre</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="btn_header_login"
            onClick={() => onStartAuth('login')}
            className="text-sm font-medium text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            id="btn_header_signup"
            onClick={() => onStartAuth('signup')}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 font-medium text-sm text-[#f8fafc] transition-all cursor-pointer shadow-lg"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3.py-1 rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#10b981]/20 border border-[#6366f1]/30 text-xs text-[#10b981] font-medium tracking-wide mb-6 uppercase py-1 px-3">
            <Sparkles className="w-3.5 h-3.5" /> Empowering Class 10, 11 & 12 Prep (IIT-JEE / NEET)
          </span>
        </motion.div>

        <motion.h1 
          className="text-4xl sm:text-6xl font-bold font-sans tracking-tight max-w-4xl mx-auto leading-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#6366f1]">AI Study Partner</span> for Academic Mastery
        </motion.h1>

        <motion.p 
          className="mt-6 text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto font-sans leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A brilliant integration of notes, round-the-clock doubts solver, resource summarizers, and diagnostic quiz engines customized exactly for standard Indian boards, JEE, and NEET syllabus.
        </motion.p>

        <motion.div 
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            id="btn_hero_signup"
            onClick={() => onStartAuth('signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#10b981] to-[#6366f1] font-semibold text-[#0f172a] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            Start Your 7-Day Free Trial
            <ArrowRight className="w-5 h-5 text-[#0f172a]" />
          </button>
          <button 
            id="btn_hero_plans"
            onClick={onExplorePlans}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1e293b] border border-white/10 text-white font-semibold hover:bg-[#334155] hover:border-white/20 transition-all cursor-pointer"
          >
            Explore Pricing Plans
          </button>
        </motion.div>

        {/* Hero Interactive Orbiting Mockup area */}
        <div className="mt-20 relative max-w-lg mx-auto flex items-center justify-center min-h-[320px] sm:min-h-[380px]">
          {/* Orbit rings */}
          <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] border border-dashed border-white/10 rounded-full animate-[spin_50s_linear_infinite]" />
          <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] border border-dotted border-white/5 rounded-full animate-[spin_80s_linear_infinite]" />

          {/* Central Mockup */}
          <motion.div 
            className="w-[280px] sm:w-[340px] rounded-2xl bg-[#1e293b] border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-20 text-left"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Coach Active
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-[10px] text-[#94a3b8] font-mono uppercase mb-1">Doubt Input Field</div>
                <div className="text-xs text-white/90 italic">"Solve the integral of cos²(x) w.r.t x limits 0 to π/2"</div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 relative overflow-hidden">
                <div className="absolute right-2 top-2"><CheckCircle className="w-3 text-emerald-400" /></div>
                <div className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest mb-1 font-bold">IIT-JEE Doubt Solver Solutions</div>
                <p className="text-[11px] text-[#f8fafc]/90 font-mono">{"$$\\int_0^{\\pi/2} \\cos^2(x) dx = \\frac{\\pi}{4}$$"}</p>
                <div className="text-[9px] text-[#94a3b8] mt-2">Steps mapped out in accordion block.</div>
              </div>
            </div>
          </motion.div>

          {/* Orbiting Icons */}
          {floatingSubjects.map((sb, idx) => (
            <motion.div
              key={idx}
              className={`absolute p-3 sm:p-4 rounded-xl bg-[#1e293b] border border-white/10 ${sb.color} flex flex-col items-center gap-1 cursor-pointer z-35`}
              style={{ x: sb.x, y: sb.y }}
              animate={{
                y: [sb.y - 10, sb.y + 10, sb.y - 10],
              }}
              transition={{
                duration: 4 + idx,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {sb.icon}
              <span className="text-[10px] sm:text-xs font-semibold text-white">{sb.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="bg-[#020617] py-24 relative z-10 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Engineered for Academic Superiority</h2>
            <p className="mt-4 text-[#94a3b8] max-w-xl mx-auto">Get state-of-the-art tools crafted to save hundreds of study hours and maximize JEE/NEET scorecard potential.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 (AI Doubt Solver) */}
            <div className="p-8 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-[#10b981]/20 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#10b981] mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">24/7 AI Doubt Solver</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Upload screenshot files of handwritten equations or key questions. Get back step-by-step diagnostic solution matrices instantaneously with formulas and learning tips.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-medium text-[#10b981] tracking-wide pointer-events-none uppercase">
                Active Doubt Solves <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Box 2 (Resource Summariser) */}
            <div className="p-8 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-[#6366f1]/25 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-[#6366f1] mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Full Resource Summariser</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Drop local student PDFs, school notes or Youtube masterclass lecture streams. Instantly extract dense bullet points summaries, simple syllabus mappings, MCQs, and memory flashcards.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-medium text-[#6366f1] tracking-wide pointer-events-none uppercase">
                Any media format <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Box 3 (Auto-Quiz & Flashcards) */}
            <div className="p-8 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-amber-500/20 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#6366f1] mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Adaptive MCQ Quiz Generator</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Practice with infinite dynamically drafted test suites containing different difficulties. Receive score assessments linked back directly to weak areas alerts.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-medium text-[#6366f1] tracking-wide pointer-events-none uppercase">
                Review mistakes <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Box 4 (Notes + Narrated Slides) */}
            <div className="p-8 md:col-span-2 rounded-2xl bg-[#1e293b] border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#10b981]/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="flex-1 space-y-4">
                <span className="px-2.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] font-mono text-[9px] uppercase tracking-wider">NEW REVISIONS MATRIX</span>
                <h3 className="text-2xl font-bold text-white">Full Syllabus Coverage & Simulated Video Walkthroughs</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Browse math, physics, biology, and chemistry chapters for Class 10, 11, and 12. Check LaTeX formulas Sheets, previous year questions (PYQs) with explanations, and view animated slide revisions summaries!
                </p>
              </div>
              <div className="w-full md:w-56 p-4 rounded-xl bg-[#020617] border border-white/5 shrink-0 flex flex-col gap-2">
                <div className="text-[10px] text-[#94a3b8] font-mono uppercase tracking-widest flex justify-between">
                  <span>Interactive Explainer</span>
                  <span className="text-[#10b981] animate-pulse">● Ready</span>
                </div>
                <div className="aspect-video rounded bg-black/40 flex items-center justify-center border border-white/5 relative">
                  <Tv className="w-10 h-10 text-violet-400" />
                  <span className="absolute bottom-1 right-2 text-[8px] bg-black/60 px-1 py-0.5 rounded font-mono text-white/80">3:15 Min</span>
                </div>
                <div className="text-xs text-white/90 truncate font-semibold">Anomalous Hybridization</div>
              </div>
            </div>

            {/* Box 5 (AI Diagnostic Scheduler) */}
            <div className="p-8 md:col-span-1 rounded-2xl bg-[#1e293b] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#6366f1]/5 rounded-full blur-[40px] pointer-events-none" />
              <div>
                <span className="text-[#6366f1] font-mono text-[9px] uppercase tracking-widest block mb-1 font-bold">Weak Areas Guard</span>
                <h3 className="text-xl font-bold text-white mb-2">AI Diagnostics Planner</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Identify specific topics failing in mock sets. Generate customized calendar planners target-tracking weak links leading seamlessly right to exam date.
                </p>
              </div>
              <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg text-rose-400 text-xs mt-6 flex gap-2 items-center">
                <Flame className="w-4 h-4 shrink-0" />
                <span>Weak Area Highlight: Organic Chemistry represents 40% of missed answers. Focus here!</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing / Subscriptions Matrix */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Honest, Simplified Pricing</h2>
          <p className="mt-4 text-[#94a3b8] max-w-xl mx-auto">Skip highly expensive offline classes and physical books. Access premium AI tools with absolute affordability.</p>
          
          <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-xl bg-[#1e293b] border border-white/5">
            <button 
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${billingPeriod === 'annual' ? 'bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a]' : 'text-[#94a3b8] hover:text-white'}`}
            >
              Billed Annually
            </button>
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${billingPeriod === 'monthly' ? 'bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a]' : 'text-[#94a3b8] hover:text-white'}`}
            >
              Show Monthly Eq.
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plan 1 */}
          <div className="rounded-2xl bg-[#1e293b] border border-white/5 hover:border-white/10 p-8 flex flex-col justify-between relative shadow-2xl">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Class 10 Scholar</h3>
                  <p className="text-xs text-[#94a3b8] mt-0.5">Perfect for secondary board excellence</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-teal-500/10 text-[#10b981] font-mono text-[9px] uppercase tracking-wider">ANNUAL PASS</span>
              </div>

              <div className="my-6">
                <span className="text-4xl font-bold text-white tracking-tight">
                  {billingPeriod === 'annual' ? '₹399' : '₹33'}
                </span>
                <span className="text-sm text-[#94a3b8]"> {billingPeriod === 'annual' ? '/ year' : '/ month equ.'}</span>
                <p className="text-xs text-[#94a3b8] mt-1 italic">Under ₹1.1 per day. Billed annually.</p>
              </div>

              <div className="space-y-3.5 border-t border-white/5 pt-6 text-sm text-[#f8fafc]/90">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Full Class 10 curriculum access (all subjects)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>AI Doubt Solver (Unlimited step questions)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Resource Summariser (20 uploads/month)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Structured Notes + Video Walkthroughs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Auto-Quiz Generator & diagnostic tracking</span>
                </div>
              </div>
            </div>

            <button 
              id="btn_pricing_p1"
              onClick={() => onStartAuth('signup')}
              className="mt-8 w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all cursor-pointer"
            >
              Choose Class 10 Mode
            </button>
          </div>

          {/* Plan 2 */}
          <div className="rounded-2xl bg-[#1e293b] border-2 border-[#6366f1] p-8 flex flex-col justify-between relative shadow-[0_0_40px_rgba(236,72,153,0.15)]">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a] font-bold text-[10px] uppercase tracking-wider whitespace-nowrap shadow-lg">
              Most Popular — NEET / JEE Choice
            </div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Class 11 & 12 NEET / JEE Pro</h3>
                  <p className="text-xs text-[#94a3b8] mt-0.5">High-octane physics, maths, botany, chemistry</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-mono text-[9px] uppercase tracking-wider">ALL ACCESS</span>
              </div>

              <div className="my-6">
                <span className="text-4xl font-bold text-white tracking-tight">
                  {billingPeriod === 'annual' ? '₹499' : '₹41'}
                </span>
                <span className="text-sm text-[#94a3b8]"> {billingPeriod === 'annual' ? '/ year' : '/ month equ.'}</span>
                <p className="text-xs text-[#94a3b8] mt-1 italic">Under ₹1.4 per day. Billed annually.</p>
              </div>

              <div className="space-y-3.5 border-t border-white/5 pt-6 text-sm text-[#f8fafc]/90">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span className="font-semibold text-white">Includes everything in Scholar plan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Class 11 + Class 12 comprehensive syllabus</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span className="text-[#10b981] font-medium">IIT-JEE Mains & Advanced Prep Mode</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span className="text-[#10b981] font-medium">NEET UG Medical (Botany / Zoology) Mode</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Unlimited custom document summaries uploads</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Full-length timed simulated Mock Test series</span>
                </div>
              </div>
            </div>

            <button 
              id="btn_pricing_p2"
              onClick={() => onStartAuth('signup')}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a] font-bold hover:brightness-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all cursor-pointer"
            >
              Get NEET / JEE All-Access
            </button>
          </div>

        </div>

        {/* Dynamic Referral Banner */}
        <div className="mt-16 max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-[#6366f1]/10 to-[#10b981]/10 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded">Referral Bonus Pass</span>
            <h4 className="text-base font-bold text-white mt-1">Get 1 month free for each friend referred!</h4>
            <p className="text-xs text-[#94a3b8] mt-0.5">Simply share your dashboard custom unique link to stack additional free learning credits.</p>
          </div>
          <button 
            onClick={() => onStartAuth('signup')}
            className="px-4 py-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Invite Friends
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0f172a] py-24 border-t border-white/5 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Loved by High-Scoring Students</h2>
          <p className="mt-4 text-[#94a3b8] max-w-md mx-auto">See how students are cracking secondary benchmarks and competitive JEE/NEET thresholds.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {[
              {
                name: 'Kshitij Sharma',
                tag: 'IIT-JEE Mains 99.4 Percentile',
                text: 'The AI Doubt Solver is like having a personal tutor standing next to my table. In physics mechanics, I can photograph my calculations and instantly see why my vector signs were incorrect!',
                stars: 5
              },
              {
                name: 'Ananya Iyer',
                tag: 'Class 12 Medical PCB (NEET)',
                text: 'The resource summarizer is incredible. I simply pasted online video lectures from Botany, got complete structured bullet point chapters, active MCQs and flashcards. This saved me months!',
                stars: 5
              },
              {
                name: 'Keshav Prasad',
                tag: 'Class 10 CBSE 96%',
                text: 'Instead of spending thousands on tuition, I activated the ₹399/year scholar program. The quadratic formula step-by-step math solver is absolute genius.',
                stars: 5
              }
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#1e293b] border border-white/5 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-[#6366f1]">
                    {Array.from({ length: t.stars }).map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-[#FFB86C]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#f8fafc]/90 italic leading-relaxed">"{t.text}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-[#10b981] font-mono tracking-wider mt-0.5 uppercase font-medium">{t.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs section */}
      <section className="py-24 bg-[#020617] relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#1e293b] border border-white/5 rounded-xl cursor-pointer overflow-hidden transition-all"
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
              >
                <div className="p-5 flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#6366f1]" /> {faq.q}
                  </span>
                  <span className="text-xs text-[#94a3b8] font-mono">
                    {activeFAQ === index ? 'Collapse [-]' : 'Expand [+]'}
                  </span>
                </div>
                
                {activeFAQ === index && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#94a3b8] leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 relative z-10 border-t border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-[#94a3b8] space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-bold text-sm text-white">STUDYBUDDY AI</span>
            <div className="flex gap-6">
              <a href="#pricing" className="hover:text-white">Pricing</a>
              <a href="#" className="hover:text-white">Security & Encryption</a>
              <a href="#" className="hover:text-white">India DPDP Compliant</a>
              <a href="#" className="hover:text-white">Support Help@studybuddy.ai</a>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>© 2026 StudyBuddy AI (Antigravity build). Dedicated to providing student learning acceleration.</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#10b981]">Server-Side Gemini active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
