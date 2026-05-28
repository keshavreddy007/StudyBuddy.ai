/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Image, 
  Mic, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  RotateCcw,
  BookOpen, 
  ArrowRight,
  Calculator,
  X,
  Plus,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { DoubtMessage, UserProfile, SavedDoubt } from '../types';

interface DoubtSolverProps {
  user: UserProfile;
  isFloatingWidget?: boolean;
  onCloseFloating?: () => void;
  onNavigateToChapter?: (chapterId: string) => void;
  onUpdateUser: (updater: (prev: UserProfile) => UserProfile) => void;
}

export default function DoubtSolver({ 
  user, 
  isFloatingWidget = false, 
  onCloseFloating, 
  onNavigateToChapter,
  onUpdateUser
}: DoubtSolverProps) {
  const [messages, setMessages] = useState<DoubtMessage[]>(() => {
    if (user.savedDoubts && user.savedDoubts.length > 0) {
      return user.savedDoubts;
    }
    // Loaded base welcoming prompts
    return [
      {
        id: 'welcome-1',
        sender: 'ai',
        text: `Hello ${user.name}! I am your StudyBuddy AI Tutor. I can solve difficult math integrals, chemical bonding hybridization steps, mechanics vector forces, or biology genetics cross rates.
        
        How can I accelerate your prep on Class ${user.classLevel} study variables today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Keep Firestore synced with messages
  useEffect(() => {
    if (messages.length > 1) { // dont just save the welcome message on load
      onUpdateUser(prev => ({ ...prev, savedDoubts: messages }));
    }
  }, [messages]);


  const [inputVal, setInputVal] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Emulations
  const [isRecording, setIsRecording] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const endMsgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingAI]);

  // Pre-compiled academic trigger examples
  const promptSnippets = [
    { label: 'Integration of cos²(x)', q: 'Find the integral of cos²(x) w.r.t x limits 0 to π/2.' },
    { label: 'Pauli Exclusion Rule', q: 'Explain why Pauli Exclusion Principle governs electron pairs spins.' },
    { label: 'SF4 Hybridization', q: 'What is the exact sp3d hybridization steps for sulfur tetrafluoride (SF4)?' },
    { label: 'Crossing Over mitosis', q: 'Describe crossing over homologous chromosomes during pachytene stage of meiosis I.' }
  ];

  // Send message API trigger
  const handleSendMessage = async (textToSend: string, imageSrc?: string, ocrText?: string) => {
    if (!textToSend.trim()) return;

    // Push Student Message
    const studentMsg: DoubtMessage = {
      id: `std-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imageSrc,
      ocrText: ocrText
    };

    setMessages(prev => [...prev, studentMsg]);
    setInputVal('');
    setLoadingAI(true);

    try {
      const response = await fetch('/api/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: ocrText || textToSend,
          classLevel: user.classLevel,
          stream: user.stream
        })
      });

      const data = await response.json();
      
      const aiResponse: DoubtMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here is the verified conceptual breakdown for your Class ${user.classLevel} doubt:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        solutionData: data
      };

      setMessages(prev => [...prev, aiResponse]);
      onUpdateUser(prev => ({ ...prev, xpPoints: prev.xpPoints + 10 }));

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Speak voice simulation
  const handleVoiceSimulate = () => {
    setIsRecording(true);
    let spokenText = 'What is the sum-of-roots for any quadratic formula';
    let chars = spokenText.split('');
    let currentStr = '';
    
    // Simulate keyboard typing effect as voice speaks
    chars.forEach((c, idx) => {
      setTimeout(() => {
        currentStr += c;
        setInputVal(currentStr);
        if (idx === chars.length - 1) {
          setIsRecording(false);
        }
      }, 10 * idx);
    });
  };

  // Image upload draft simulation
  const handleImageUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      setTimeout(() => {
        setUploadingImage(false);
        // Handwritten problem simulation OCR text
        const mockOCR = 'Solve $2x^2 + 5x + 3 = 0$ for Nature of Roots.';
        const mockBase64Url = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&auto=format&fit=crop';
        
        handleSendMessage('Handwritten Notebook Diagram uploaded: nature of roots equation.', mockBase64Url, mockOCR);
      }, 300);
    }
  };

  return (
    <div className={`flex flex-col bg-[#1e293b] border border-white/5 shadow-2xl overflow-hidden h-full ${isFloatingWidget ? 'rounded-2xl w-80 sm:w-96 max-h-[500px]' : 'rounded-2xl h-[70vh]'}`}>
      
      {/* Doubt header */}
      <div className="bg-[#121235]/40 p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">StudyBuddy AI Tutor</h3>
            <span className="text-[9px] text-[#10b981] uppercase tracking-wider font-mono">Stream: Custom Class {user.classLevel} Course v2</span>
          </div>
        </div>

        {isFloatingWidget && onCloseFloating && (
          <button onClick={onCloseFloating} className="p-1 text-white/75 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages pane Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans max-h-[calc(100%-110px)]">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] ${msg.sender === 'student' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            {/* Timestamp */}
            <span className="text-[9px] text-[#94a3b8] font-mono mb-1">{msg.timestamp}</span>

            {/* Bubble parameters */}
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'student' ? 'bg-[#6366f1] text-white rounded-br-none' : 'bg-[#020617]/80 border border-white/5 text-[#f8fafc]/90 rounded-bl-none'}`}>
              
              {/* If Image included */}
              {msg.imageUrl && (
                <div className="mb-2 rounded overflow-hidden max-w-[120px] border border-white/10">
                  <img src={msg.imageUrl} alt="Student Notebook Capture" referrerPolicy="no-referrer" className="w-full h-auto" />
                </div>
              )}

              {/* Text render */}
              <p className="whitespace-pre-line font-sans">{msg.text}</p>

              {/* If OCR math text extracted */}
              {msg.ocrText && (
                <div className="mt-2 p-2 bg-black/40 rounded border border-white/5 font-mono text-[10px] text-[#10b981]">
                  <strong>OCR Transcribed:</strong> "{msg.ocrText}"
                </div>
              )}

              {/* RENDER COMPLEX JSON SOLUTION ACCORDION WORKFLOWS */}
              {msg.solutionData && (
                <div className="mt-4 space-y-3 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="px-1.5 py-0.5 bg-violet-500/10 text-violet-400 rounded text-[9px] uppercase font-bold font-mono">
                      {msg.solutionData.subject}
                    </span>
                    <span className="text-[#94a3b8] text-[10px]">{msg.solutionData.topic}</span>
                  </div>

                  {/* Math Formula Card if present */}
                  {msg.solutionData.formula && (
                    <div className="p-2.5 rounded bg-black/30 border border-white/5 text-center font-mono text-xs text-[#10b981] overflow-x-auto">
                      $${msg.solutionData.formula}$$
                    </div>
                  )}

                  {/* Step accordions */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#94a3b8] block mb-1">Step-By-Step Solution steps:</span>
                    {msg.solutionData.steps.map((st, sIdx) => (
                      <div key={sIdx} className="p-2 bg-[#1e293b]/90 border border-white/5 rounded text-[11px] leading-relaxed relative font-sans">
                        <span className="text-[#10b981] font-bold font-mono block mb-0.5">Step {sIdx + 1}:</span>
                        <p className="text-white/80 font-sans">{st}</p>
                      </div>
                    ))}
                  </div>

                  {/* Concept check tip help */}
                  {msg.solutionData.tip && (
                    <div className="p-2 bg-amber-500/5 border border-amber-500/10 text-amber-500 rounded text-[10px] leading-normal flex gap-1.5 font-sans">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <span><strong>Remember Tip:</strong> {msg.solutionData.tip}</span>
                    </div>
                  )}

                  {/* Redirect chapter Link */}
                  {msg.solutionData.related_chapter && onNavigateToChapter && (
                    <button
                      onClick={() => onNavigateToChapter(msg.solutionData!.related_chapter!)}
                      className="w-full mt-1.5 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] uppercase text-white font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer font-mono"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Read Notes under Syllabus Chapter <ArrowRight className="w-3" />
                    </button>
                  )}

                </div>
              )}

            </div>
          </div>
        ))}

        {/* Loading AI waveform indicator */}
        {loadingAI && (
          <div className="flex flex-col max-w-[85%] mr-auto items-start">
            <span className="text-[9px] text-[#94a3b8] font-mono mb-1">AI Thinking...</span>
            <div className="p-3.5 bg-[#020617]/80 border border-white/5 rounded-2xl rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-xs text-[#94a3b8] font-mono ml-1">Drafting solution mathematical steps...</span>
            </div>
          </div>
        )}

        <div ref={endMsgRef} />
      </div>

      {/* Suggested chips row if not floating */}
      {!isFloatingWidget && messages.length < 3 && (
        <div className="p-3 px-4 border-t border-white/5 bg-[#020617]/30 flex flex-wrap gap-1.5 overflow-x-auto text-xs whitespace-nowrap">
          {promptSnippets.map((sn, snIdx) => (
            <button
              key={snIdx}
              onClick={() => handleSendMessage(sn.q)}
              className="px-2.5 py-1 rounded-full bg-[#1e293b] border border-white/5 text-[#94a3b8] hover:text-white text-[10px] transition-colors cursor-pointer"
            >
              {sn.label}
            </button>
          ))}
        </div>
      )}

      {/* Footer input bars area */}
      <div className="p-3.5 bg-[#020617]/60 border-t border-white/5 flex items-center gap-2 relative">
        <input 
          type="file"
          id="doubt_image_simulate"
          className="hidden"
          accept="image/*"
          onChange={handleImageUploadSimulate}
        />
        <label 
          htmlFor="doubt_image_simulate" 
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[#94a3b8] hover:text-white transition-all cursor-pointer relative"
          title="Simulate Camera Notebook Photo Solution"
        >
          <Image className="w-4 h-4" />
          {uploadingImage && <span className="absolute inset-0 bg-[#10b981] rounded-lg animate-ping opacity-60" />}
        </label>

        <button
          onClick={handleVoiceSimulate}
          disabled={isRecording}
          className={`p-2 rounded-lg bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white transition-all cursor-pointer ${isRecording ? 'bg-rose-500/20 text-rose-400' : ''}`}
          title="Simulate Speech doubt"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input 
          id="input_doubt_text"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
          placeholder={isRecording ? 'Listening...' : 'Type math formula, physics question...'}
          className="flex-1 bg-[#020617] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
        />

        <button
          id="btn_send_doubt"
          onClick={() => handleSendMessage(inputVal)}
          className="p-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a] font-bold transition-all hover:brightness-110 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
