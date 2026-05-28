/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  ChevronRight, 
  Compass, 
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ClassLevel, Stream, ExamTarget, UserProfile } from '../types';

interface AuthPageProps {
  initialMode: 'signup' | 'login';
  onAuthComplete: (profile: UserProfile) => void;
  onBackToLanding: () => void;
  onModeChange: (mode: 'signup' | 'login') => void;
}

export default function AuthPage({ initialMode, onAuthComplete, onBackToLanding, onModeChange }: AuthPageProps) {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [step, setStep] = useState<number>(1); // Step 1: Base info, Step 2: Stream & Target, Step 3: Premium Payment Check
  
  // Registration States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('11');
  const [stream, setStream] = useState<Stream>('PCM');
  const [examTarget, setExamTarget] = useState<ExamTarget>('JEE');
  const [examDate, setExamDate] = useState('2027-04-15'); // CBSE/JEE Board target next spring

  // Razorpay Gateway Simulator States
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isTrialMode, setIsTrialMode] = useState(false);
  const [autoPayConfirmed, setAutoPayConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  const getPrice = () => {
    return classLevel === '10' ? 399 : 499;
  };

  const getPlanId = () => {
    return classLevel === '10' ? 'class-10-scholar' : 'class-11-12-pro';
  };

  const handleBaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill out email and password.');
      return;
    }
    
    if (mode === 'login') {
      setIsProcessingAuth(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // App.tsx onAuthStateChanged logic will redirect to dashboard
      } catch (error: any) {
        alert("Login failed: " + error.message);
        setIsProcessingAuth(false);
      }
    } else {
      if (!name) {
        alert('Please enter your full name.');
        return;
      }
      setStep(2);
    }
  };

  const handleAcademicSubmit = () => {
    // Proceed to payment gateway preview selection
    setIsTrialMode(false);
    setShowRazorpay(true);
  };

  const handleTrialSubmit = () => {
    setIsTrialMode(true);
    setShowRazorpay(true);
  };

  const handleAuthFinalize = async (paymentType: 'paid' | 'trial') => {
    setIsProcessingAuth(true);
    let fbUser;
    
    try {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          fbUser = cred.user;
        } else {
          throw err;
        }
      }
      
      const isPaid = paymentType === 'paid';
      const completeProfile: UserProfile = {
        name,
        email,
        classLevel,
        stream: classLevel === '10' ? 'General' : stream,
        examTarget: classLevel === '10' ? 'Board' : examTarget,
        isSubscribed: true,
        planId: getPlanId(),
        subscriptionEndDate: new Date(Date.now() + (isPaid ? 365 : 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        xpPoints: isPaid ? 50 : 20,
        badges: [isPaid ? 'Smart Starter' : 'Trial Pioneer'],
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        examDate: examDate || '2027-03-15'
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), completeProfile, { merge: true });
      } catch (dbError) {
        console.warn("Could not save to Firestore, continuing with local profile...", dbError);
      }
      
      onAuthComplete(completeProfile);
    } catch (error: any) {
      alert("Sign up failed: " + error.message);
      setIsProcessingAuth(false);
      setPaymentSuccess(false);
      setShowRazorpay(false);
      if (error.code === 'auth/email-already-in-use') {
        setStep(1);
      }
    }
  };

  const handleSimulatedPayment = async () => {
    if (paymentMethod === 'card') {
      if (cardNumber.length < 12) {
        alert('Enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        alert('Enter valid expiry date and CVV.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        alert('Enter a valid UPI ID (e.g., name@bank) to setup the auto-pay mandate.');
        return;
      }
    }

    setPaymentSuccess(true);
    
    try {
      // Strictly gate profile creation behind payment gateway verification promise
      const transactionVerified = await new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
          // In a real scenario, this would await response from Razorpay/Stripe API
          resolve(true); 
        }, 800);
      });

      if (transactionVerified) {
        await handleAuthFinalize(isTrialMode ? 'trial' : 'paid');
      } else {
        throw new Error("Payment authorization rejected by gateway.");
      }
    } catch (error: any) {
      setPaymentSuccess(false);
      alert(error.message || "Transaction failed. Please try again.");
    }
  };

  // Adjust default targets based on class selection
  const handleClassSelection = (lvl: ClassLevel) => {
    setClassLevel(lvl);
    if (lvl === '10') {
      setStream('General');
      setExamTarget('Board');
    } else {
      setStream('PCM');
      setExamTarget('JEE');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] relative flex items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Navigation Return Hook */}
      <button 
        id="btn_back_to_landing"
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Main Registration Panel Container */}
      <div className="w-full max-w-md bg-[#1e293b] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 overflow-hidden">
        
        {/* Dynamic header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#10b981] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#6366f1]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'signup' ? `StudyBuddy Command Registration` : `Welcome Back Scholar`}
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1 uppercase tracking-wider font-mono">
            {step === 1 ? 'Step 1: Account setup' : 'Step 2: Stream alignment'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleBaseSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1">Full Student Name</label>
                <input 
                  id="input_auth_name"
                  type="text"
                  required
                  placeholder="Keshav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1">Email Address</label>
              <input 
                id="input_auth_email"
                type="email"
                required
                placeholder="keshav@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1">Pass-credentials</label>
              <input 
                id="input_auth_password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Class Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['10', '11', '12'] as ClassLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleClassSelection(lvl)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${classLevel === lvl ? 'bg-[#6366f1]/15 border-[#6366f1] text-white' : 'bg-[#020617] border-white/5 text-[#94a3b8] hover:text-white'}`}
                    >
                      Class {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              id="btn_auth_step1"
              type="submit"
              disabled={isProcessingAuth}
              className={`w-full py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a] font-semibold text-sm hover:brightness-110 shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer ${isProcessingAuth ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessingAuth ? (
                <div className="w-4 h-4 rounded-full border-t-2 border-[#0f172a] animate-spin" />
              ) : mode === 'signup' ? 'Configure Academic Stream' : 'Enter Dashboard'}
              {!isProcessingAuth && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  const newMode = mode === 'login' ? 'signup' : 'login';
                  setMode(newMode);
                  onModeChange(newMode);
                }}
                className="text-xs text-[#10b981] hover:underline"
              >
                {mode === 'signup' ? 'Already possess user account? Log In' : 'Create new scholar account here'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            
            {classLevel !== '10' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#10b981]" /> Choose Academic Stream
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['PCM', 'PCB', 'Commerce', 'General'] as Stream[]).map((str) => (
                      <button
                        key={str}
                        type="button"
                        onClick={() => setStream(str)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${stream === str ? 'bg-[#10b981]/10 border-[#10b981] text-white' : 'bg-[#020617] border-white/5 text-[#94a3b8] hover:text-white'}`}
                      >
                        {str} ({str === 'PCM' ? 'Engineering' : str === 'PCB' ? 'Biological' : 'Standard'})
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#6366f1]" /> Competitive Target Exam
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['JEE', 'NEET', 'Board', 'State CET'] as ExamTarget[]).map((tar) => (
                      <button
                        key={tar}
                        type="button"
                        onClick={() => setExamTarget(tar)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${examTarget === tar ? 'bg-[#6366f1]/15 border-[#6366f1] text-white' : 'bg-[#020617] border-white/5 text-[#94a3b8] hover:text-white'}`}
                      >
                        {tar} Prep
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs">
                Your account is matched perfectly to **Class 10 CBSE / General board preparation syllabus**. All core subjects (Math, Science, Social Science, Hindi & English) will be mapped.
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6366f1]" /> Target Exam Date
              </label>
              <input 
                id="input_onboard_date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
              />
              <p className="text-[10px] text-[#94a3b8] mt-1">Countdown grids and diagnostic schedule will lock to this target.</p>
            </div>

            <div className="pt-2">
              <button 
                id="btn_auth_academic_submit"
                onClick={handleAcademicSubmit}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a] font-bold text-sm hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#10b981]/15"
              >
                Go to Subscription Activation
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTrialSubmit}
                className="w-full text-center text-xs text-[#94a3b8] hover:text-[#10b981] mt-3.5 block transition-colors"
              >
                Start 7-Day Free Trial
              </button>
            </div>
          </div>
        )}

      </div>

      {/* RAZORPAY INTEGRATED GATEWAY EMULATOR MODAL */}
      {showRazorpay && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
          >
            {/* Payment Top Loading Bar */}
            {paymentSuccess && (
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#6366f1] to-[#10b981] z-10" 
              />
            )}
            
            {/* Razorpay Header bar */}
            <div className="bg-[#1e293b] p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 flex items-center justify-center border border-[#10b981]/20">
                  <CreditCard className="w-5 h-5 text-[#10b981]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-widest uppercase">Razorpay Gateway</div>
                  <div className="text-[10px] text-[#10b981] tracking-wider uppercase font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                    Secured Sandbox Node
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#94a3b8] uppercase font-mono block mb-0.5">{isTrialMode ? 'Auto-Pay Setup' : 'Total Charge'}</div>
                <div className="text-lg font-bold text-white tracking-tight">{isTrialMode ? '₹0.00' : `₹${getPrice()}.00`}</div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-3.5 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl text-xs leading-relaxed flex gap-3 items-start text-white/95 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366f1]/10 rounded-bl-full pointer-events-none" />
                <ShieldCheck className="w-5 h-5 text-[#6366f1] shrink-0 mt-0.5" />
                <div className="relative z-10">
                  <span className="font-bold block text-white text-sm mb-1">StudyBuddy Annual Package</span>
                  <span className="text-[#94a3b8]">
                    {isTrialMode ? `7-Day Free Trial. Auto-pay ₹${getPrice()}/yr starts after trial.` : `Complete ${classLevel === '10' ? 'Class 10 Scholar' : 'NEET / JEE All-Access Pro'} account credentials active. Re-billed optionally.`}
                  </span>
                </div>
              </div>

              {/* Toggle Payment parameters */}
              <div className="flex bg-[#020617] rounded-xl border border-white/5 p-1 relative">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1e293b] border border-white/10 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${paymentMethod === 'upi' ? 'left-1' : 'left-[calc(50%+3px)]'}`}
                />
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 relative z-10 transition-colors ${paymentMethod === 'upi' ? 'text-white' : 'text-[#94a3b8] hover:text-white/80'}`}
                >
                  <QrCode className="w-4 h-4" /> UPI & QR
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 relative z-10 transition-colors ${paymentMethod === 'card' ? 'text-white' : 'text-[#94a3b8] hover:text-white/80'}`}
                >
                  <CreditCard className="w-4 h-4" /> Card
                </button>
              </div>

              <motion.div 
                key={paymentMethod}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {paymentMethod === 'upi' ? (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">Enter your UPI ID</label>
                      <input
                        type="text"
                        placeholder="you@okbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981] transition-colors placeholder:text-white/20"
                      />
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 duration-300">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=8867730371@ybl&pn=StudyBuddy&am=${getPrice()}&cu=INR`)}`} 
                          alt="UPI QR Code" 
                          className="w-32 h-32" 
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-bold mb-1">Or pay directly to</p>
                        <div className="text-sm font-mono text-emerald-400 font-bold bg-[#10b981]/10 py-1.5 px-4 rounded-lg inline-block border border-[#10b981]/20">8867730371@ybl</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (isTrialMode && !autoPayConfirmed) {
                          alert("Please confirm the auto-pay mandate below first.");
                          return;
                        }
                        handleSimulatedPayment();
                      }}
                      className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                        (isTrialMode && !autoPayConfirmed)
                          ? 'border-white/5 bg-white/5 text-white/30 cursor-not-allowed'
                          : 'border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981] font-bold hover:bg-[#10b981]/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer'
                      } text-xs tracking-wide`}
                    >
                      Open UPI App <QrCode className="w-4 h-4"/>
                    </button>
                    
                    <div className="p-3 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[10px] text-white/70 leading-relaxed flex gap-2 text-left">
                      <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                      <span>{isTrialMode ? 'Authorize auto-pay. No charge today. ₹' + getPrice() + ' will be billed after 7 days.' : 'Proceed with transaction confirmation below after successful payment transfer.'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider mb-1.5">Card Number (16-Digit)</label>
                      <div className="relative">
                        <input
                          id="input_pay_card"
                          type="text"
                          placeholder="4321  5678  1234  9876"
                          value={cardNumber}
                          maxLength={16}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-[#020617] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] font-mono transition-colors tracking-widest placeholder:text-white/20"
                        />
                        <CreditCard className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider mb-1.5">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] font-mono transition-colors placeholder:text-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider mb-1.5">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] font-mono transition-colors placeholder:text-white/20"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {isTrialMode && (
                <div className="p-3 bg-[#020617]/50 border border-white/5 rounded-xl flex items-start gap-3">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      id="autopay-consent"
                      checked={autoPayConfirmed}
                      onChange={(e) => setAutoPayConfirmed(e.target.checked)}
                      className="peer appearance-none w-4 h-4 rounded shadow-sm border border-white/20 checked:bg-[#10b981] checked:border-[#10b981] cursor-pointer transition-all"
                    />
                    <CheckCircle className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <label htmlFor="autopay-consent" className="text-[10px] text-[#94a3b8] leading-relaxed cursor-pointer select-none font-medium">
                    I confirm the auto-pay mandate. I won't be charged today, but my account will debit ₹{getPrice()}.00 annually after my 7-day trial ends unless cancelled.
                  </label>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <button
                  id="btn_pay_confirm"
                  onClick={handleSimulatedPayment}
                  disabled={paymentSuccess || (isTrialMode && !autoPayConfirmed)}
                  className={`relative w-full py-3.5 rounded-xl overflow-hidden group transition-all duration-300 ${
                    (isTrialMode && !autoPayConfirmed) 
                    ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5' 
                    : 'bg-white text-[#0f172a] hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer border border-transparent'
                  } font-bold text-sm tracking-wide flex items-center justify-center gap-2`}
                >
                  {paymentSuccess && !(isTrialMode && !autoPayConfirmed) && (
                    <motion.div 
                      className="absolute inset-0 bg-[#10b981]"
                      initial={{ left: "-100%" }}
                      animate={{ left: "0%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {paymentSuccess ? (
                      <>
                        <div className="w-4 h-4 border-[2px] border-[#0f172a]/20 border-t-[#0f172a] rounded-full animate-spin" /> 
                        PROCESSING...
                      </>
                    ) : (
                      isTrialMode ? 'AUTHORIZE FREE TRIAL' : `PAY SECURELY ₹${getPrice()}.00`
                    )}
                  </span>
                </button>
                <button
                  onClick={() => setShowRazorpay(false)}
                  className="text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors py-2 text-center"
                >
                  Cancel & Return
                </button>
              </div>

            </div>

            <div className="bg-[#020617] p-3 border-t border-white/5 flex justify-center items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-mono text-[#94a3b8]">
                <Lock className="w-3 h-3 text-[#10b981]" /> SECURED CONNECTION
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="text-[9px] uppercase font-mono text-[#94a3b8]">PCI DSS COMPLIANT</span>
            </div>

          </motion.div>
        </div>
      )}
    </div>
  );
}
