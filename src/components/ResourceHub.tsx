/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Link, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Copy, 
  Download, 
  Clock, 
  RotateCcw,
  BookOpen, 
  HelpCircle,
  Code
} from 'lucide-react';
import { UserProfile, ResourceSummary } from '../types';

interface ResourceHubProps {
  user: UserProfile;
  onUpdateUser: (updater: (prev: UserProfile) => UserProfile) => void;
}

export default function ResourceHub({ user, onUpdateUser }: ResourceHubProps) {
  // Input states
  const [sourceType, setSourceType] = useState<'url' | 'text'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  
  // File dragging simulator states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Processing states
  const [processing, setProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [progressVal, setProgressVal] = useState(0);

  // Result States
  const [result, setResult] = useState<ResourceSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'explanation' | 'quiz' | 'flashcards'>('summary');
  
  // Interactive Quiz States
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Interactive Flashcards States
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // File drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      
      // Attempt reading file as text
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setTextInput(text || '');
      };
      reader.readAsText(file);
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setTextInput(text || '');
      };
      reader.readAsText(file);
    }
  };

  // Run AI summary post
  const triggerSummarizeAPI = async () => {
    const textToSend = textInput.trim() || (urlInput ? `Generate academic analysis on target URL: ${urlInput}` : '');
    if (!textToSend) {
      alert('Please paste a lecture URL, drop an educational file, or enter raw notes first.');
      return;
    }

    setProcessing(true);
    setResult(null);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setCurrentCardIndex(0);
    setCardFlipped(false);

    // Dynamic step timers for high fidelity feel
    const steps = [
      { msg: 'Reading file data & aligning transcript codes...', prog: 20 },
      { msg: 'Injected study scope variables. Sending to Gemini-3.5-Flash node...', prog: 50 },
      { msg: 'Formatting structured LaTeX formulae & compression notes...', prog: 75 },
      { msg: 'Building diagnostic MCQ quiz papers & memory flashcards...', prog: 95 }
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i].msg);
      setProgressVal(steps[i].prog);
      await new Promise(r => setTimeout(r, 150));
    }

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: textToSend,
          classLevel: user.classLevel,
          stream: user.stream
        })
      });
      const data = await response.json();
      setResult(data);
      onUpdateUser(prev => ({ ...prev, xpPoints: prev.xpPoints + 15 }));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // Submission handles
  const handleScoreQuiz = () => {
    if (!result) return;
    setQuizSubmitted(true);
    // XP bonus
    const score = result.quiz.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length;
    if (score > 2) {
      onUpdateUser(prev => ({
        ...prev,
        xpPoints: prev.xpPoints + 30,
        badges: prev.badges.includes('Quiz Conqueror') ? prev.badges : [...prev.badges, 'Quiz Conqueror']
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Primary Input Box Panel */}
      <div className="p-6 rounded-2xl bg-[#1e293b] border border-white/5 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-[#10b981]" /> Dynamic AI Educational Resource Hub
          </h2>
          <p className="text-xs text-[#94a3b8]">Drop textbook PDFs, school transcripts, or Youtube links here. Instantly generate compressed notes, study worksheets, MCQs, and flashcards.</p>
        </div>

        {/* Toggle options */}
        <div className="flex gap-4 border-b border-white/5 pb-2">
          <button 
            onClick={() => {
              setSourceType('text');
              setUrlInput('');
            }}
            className={`text-xs font-semibold pb-1 cursor-pointer transition-all ${sourceType === 'text' ? 'text-[#10b981] border-b-2 border-[#10b981]' : 'text-[#94a3b8] hover:text-white'}`}
          >
            📋 Paste Text / Drop Files
          </button>
          <button 
            onClick={() => {
              setSourceType('url');
              setUploadedFileName('');
            }}
            className={`text-xs font-semibold pb-1 cursor-pointer transition-all ${sourceType === 'url' ? 'text-[#10b981] border-b-2 border-[#10b981]' : 'text-[#94a3b8] hover:text-white'}`}
          >
            🔗 Paste Video/Resource URL
          </button>
        </div>

        {sourceType === 'text' ? (
          <div className="space-y-4">
            {/* Drag Drop Area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-xl text-center transition-all relative ${dragActive ? 'border-[#10b981] bg-[#10b981]/5' : 'border-white/10 bg-[#020617]/60 hover:border-white/20'}`}
            >
              <input 
                type="file"
                id="file_upload_input"
                className="hidden"
                accept=".txt,.pdf,.docx"
                onChange={handleManualFileSelect}
              />
              <label htmlFor="file_upload_input" className="cursor-pointer space-y-2 block">
                <FileText className="w-8 h-8 text-[#6366f1] mx-auto animate-pulse" />
                <div className="text-xs font-semibold text-white/90">
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Drag & Drop your Class Syllabus PDF or .txt file here'}
                </div>
                <p className="text-[10px] text-[#94a3b8]">Or click to search local directory files. Limit 10MB.</p>
              </label>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase font-bold text-[#94a3b8] tracking-wider mb-1">Or paste raw notes content directly</label>
              <textarea 
                id="area_paste_notes"
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste paragraph text relating to Newton's equations, cellular division phases, organic chemical compounds hybridization indexes..."
                className="w-full bg-[#020617] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#6366f1] font-sans"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-[10px] font-mono uppercase font-bold text-[#94a3b8] tracking-wider mb-1">Enter YouTube URL or PDF Hosted Link</label>
            <div className="relative">
              <Link className="absolute left-3 top-2.5 w-4.5 h-4.5 text-[#94a3b8]" />
              <input 
                id="input_resource_url"
                type="text"
                placeholder="https://www.youtube.com/watch?v=f-x-k..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-[#020617] border border-[#94a3b8]/30 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1] font-mono"
              />
            </div>
          </div>
        )}

        <button 
          id="btn_trigger_resources"
          onClick={triggerSummarizeAPI}
          disabled={processing}
          className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#10b981] text-[#0f172a] font-bold text-xs tracking-wider rounded-lg hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {processing ? 'COMPRESSING CONTENT VIA AI ENGINE...' : 'GENERATE SUMMARY, QUIZ & STUDY CARDS'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* PROCESSING SCREEN */}
      {processing && (
        <div className="p-8 text-center bg-[#1e293b] border border-white/5 rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="max-w-xs mx-auto space-y-4 py-8">
            <div className="w-12 h-12 rounded-full border-t-2 border-[#10b981] animate-spin mx-auto" />
            
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#10b981] block uppercase tracking-widest animate-pulse">{loadingStep}</span>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#10b981] to-[#6366f1] transition-all duration-300" style={{ width: `${progressVal}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPRESS RESULTS */}
      {result && !processing && (
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header row */}
          <div className="p-5 border-b border-white/5 bg-[#121235]/40 flex justify-between items-center">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#10b981] font-bold">Processed output</span>
              <h3 className="text-sm font-bold text-white mt-0.5">Syllabus-aligned Summarize Output</h3>
            </div>
            
            <div className="flex gap-2 text-[10px] text-[#94a3b8] font-mono">
              <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/5">
                <Clock className="w-3.5 h-3.5 text-[#10b981]" /> Est. Read: 3 Mins
              </span>
            </div>
          </div>

          {/* Sub Navigation tabs */}
          <div className="flex border-b border-white/5 p-1 bg-[#0c0c22] overflow-x-auto text-xs whitespace-nowrap">
            {[
              { id: 'summary', label: '📝 Lecture Notes Summary' },
              { id: 'explanation', label: '🧠 Simple Concept Walkthrough' },
              { id: 'quiz', label: '❓ Evaluative MCQ Test' },
              { id: 'flashcards', label: '🎴 Memory Flashcards' }
            ].map((st) => {
              const isActive = activeTab === st.id;
              return (
                <button
                  key={st.id}
                  id={`tab_res_${st.id}`}
                  onClick={() => setActiveTab(st.id as any)}
                  className={`px-4 py-2 font-semibold transition-all rounded-lg cursor-pointer ${isActive ? 'bg-[#6366f1] text-white font-bold' : 'text-[#94a3b8] hover:text-white'}`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            
            {/* LECTURE NOTES SUMMARY VIEW */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs uppercase font-mono text-[#10b981] font-bold">Synthesized content points</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result.summary);
                      alert('Summary notes copied successfully!');
                    }}
                    className="text-[10px] text-[#94a3b8] hover:text-white flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy notes
                  </button>
                </div>

                <div className="text-sm text-[#f8fafc]/85 space-y-3 prose prose-invert font-sans max-w-none">
                  {result.summary.split('\n\n').map((para, idx) => {
                    if (para.startsWith('###')) {
                      return <h3 key={idx} className="text-base font-bold text-white pt-2 border-l-2 border-[#6366f1] pl-2">{para.replace('###', '').trim()}</h3>;
                    }
                    if (para.startsWith('-') || para.startsWith('1.')) {
                      return (
                        <div key={idx} className="pl-4 space-y-1">
                          {para.split('\n').map((li, lIdx) => (
                            <p key={lIdx} className="text-[12px] text-[#94a3b8] leading-normal flex items-start gap-1.5 font-sans">
                              <span className="text-[#10b981] mt-1 shrink-0">•</span>
                              <span>{li.replace(/^(\d+\.|\-)\s*/, '')}</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return <p key={idx} className="text-[13px] leading-relaxed font-sans">{para}</p>;
                  })}
                </div>
              </div>
            )}

            {/* SIMPLE CONCEPT Walkthrough SHEET */}
            {activeTab === 'explanation' && (
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-[#10b981] font-bold pb-2 border-b border-white/5">Simplified syllabus breakdowns</div>
                
                <div className="text-sm text-[#f8fafc]/90 space-y-4 font-sans leading-relaxed">
                  {result.explanation.split('\n\n').map((para, idx) => (
                    <p key={idx} className="text-[13px] leading-relaxed font-sans">{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* EVALUATIVE MCQ INTERACTIVE TESTS */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="text-xs font-mono uppercase text-[#10b981] font-bold pb-2 border-b border-white/5 flex justify-between items-center">
                  <span>Diagnostic practice session (+30 XP Rewards on submission)</span>
                  <span className="text-xs text-[#94a3b8]">Progress: {Object.keys(selectedAnswers).length} / {result.quiz.length} Answered</span>
                </div>

                <div className="space-y-6">
                  {result.quiz.map((q, qIdx) => {
                    const answered = selectedAnswers[qIdx] !== undefined;
                    const correctAns = selectedAnswers[qIdx] === q.correctIndex;

                    return (
                      <div key={qIdx} className="p-4 sm:p-5 rounded-xl bg-[#020617] border border-white/5 space-y-3.5">
                        <div className="text-[10px] font-mono text-[#6366f1] font-bold">QUESTION {qIdx + 1}</div>
                        <h4 className="text-xs sm:text-sm text-white/95 leading-normal font-sans">{q.question}</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                          {q.options.map((opt, oIdx) => {
                            let optionColors = 'border-white/5 bg-[#1e293b] text-white/95 hover:border-white/10';
                            if (quizSubmitted) {
                              if (oIdx === q.correctIndex) {
                                optionColors = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold';
                              } else if (selectedAnswers[qIdx] === oIdx) {
                                optionColors = 'bg-rose-500/10 border-rose-500 text-rose-400';
                              } else {
                                optionColors = 'opacity-40 border-white/5 bg-[#1e293b] text-[#94a3b8]';
                              }
                            } else if (selectedAnswers[qIdx] === oIdx) {
                              optionColors = 'bg-[#6366f1]/20 border-[#6366f1] text-white';
                            }

                            return (
                              <button
                                key={oIdx}
                                id={`btn_res_quiz_${qIdx}_opt_${oIdx}`}
                                onClick={() => !quizSubmitted && setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                disabled={quizSubmitted}
                                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${optionColors}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="p-3 bg-white/5 rounded-lg text-xs leading-normal font-sans">
                            {correctAns ? (
                              <span className="text-emerald-400 font-bold block mb-1">✓ Correct Statement</span>
                            ) : (
                              <span className="text-rose-400 font-bold block mb-1">✗ Incorrect Statement</span>
                            )}
                            <p className="text-[#94a3b8] font-sans">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    id="btn_submit_quiz"
                    onClick={handleScoreQuiz}
                    disabled={quizSubmitted || Object.keys(selectedAnswers).length < result.quiz.length}
                    className="px-6 py-2.5 rounded bg-[#10b981] font-bold text-[#0f172a] hover:brightness-110 disabled:opacity-45 text-xs transition-colors cursor-pointer mr-auto"
                  >
                    Submit Practice Test Paper
                  </button>
                  {quizSubmitted && (
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Verified Score: {result.quiz.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length} / {result.quiz.length} Corrected
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* MEMORY RECALL FORWARD CARDS */}
            {activeTab === 'flashcards' && (
              <div className="space-y-6">
                <div className="text-xs font-mono uppercase text-[#10b981] font-bold pb-2 border-b border-white/5 text-center">Active recall flipping review</div>

                {result.flashcards.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#94a3b8]">No card sheets constructed.</div>
                ) : (
                  <div className="max-w-md mx-auto space-y-4">
                    
                    <div 
                      onClick={() => setCardFlipped(!cardFlipped)}
                      className="h-44 rounded-xl bg-gradient-to-br from-[#121235] to-[#121245] border-2 border-white/5 p-6 flex flex-col justify-center items-center text-center cursor-pointer relative shadow-xl hover:border-white/10 select-none"
                    >
                      <div className="absolute top-2 right-3 text-[9px] uppercase font-mono text-[#94a3b8]">
                        {cardFlipped ? 'DISPLAYING DEF' : 'DISPLAYING TERM [CLICK TO FLIP]'}
                      </div>

                      {!cardFlipped ? (
                        <div className="space-y-1">
                          <span className="text-[10px] text-[#10b981] font-mono uppercase tracking-widest block font-bold">TERM VALUE</span>
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide font-sans">{result.flashcards[currentCardIndex]?.term}</h3>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[10px] text-violet-400 font-mono uppercase font-bold tracking-widest block">DEFINITION DETAILS</span>
                          <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">{result.flashcards[currentCardIndex]?.definition}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs px-2 select-none">
                      <button
                        disabled={currentCardIndex === 0}
                        onClick={() => {
                          setCurrentCardIndex(prev => prev - 1);
                          setCardFlipped(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                      >
                        Previous Card
                      </button>
                      <span className="font-mono text-[#94a3b8]">Card {currentCardIndex + 1} / {result.flashcards.length}</span>
                      <button
                        disabled={currentCardIndex === result.flashcards.length - 1}
                        onClick={() => {
                          setCurrentCardIndex(prev => prev + 1);
                          setCardFlipped(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                      >
                        Next Card
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
