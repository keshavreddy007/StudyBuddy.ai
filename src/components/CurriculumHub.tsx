/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  FileText, 
  Volume2, 
  HelpCircle, 
  Download, 
  Tv, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { Chapter, Topic, PYQ, PracticeProblem, Flashcard, UserProfile } from '../types';
import { getSubjectChapters } from '../data/curriculum';

interface CurriculumHubProps {
  user: UserProfile;
  onUpdateUser: (updater: (prev: UserProfile) => UserProfile) => void;
}

export default function CurriculumHub({ user, onUpdateUser }: CurriculumHubProps) {
  const chapters = getSubjectChapters(user.classLevel, user.stream);
  
  // Browsing States
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(chapters[0] || null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(chapters[0]?.topics[0] || null);
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'video' | 'formulas' | 'pyqs' | 'practice' | 'flashcards'>('notes');

  // Flashcards flipping state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Practice problem assessment state
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number>>({});
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);

  // Explainer Video Simulation Slide
  const [videoSlideIndex, setVideoSlideIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(false);

  const handleSelectChapter = (ch: Chapter) => {
    setSelectedChapter(ch);
    setSelectedTopic(ch.topics[0] || null);
    // Reset answers
    setSelectedPracticeAnswers({});
    setCompletedProblems([]);
    setCurrentFlashcardIndex(0);
    setIsFlipped(false);
    setVideoSlideIndex(0);
  };

  const handleSelectTopic = (tp: Topic) => {
    setSelectedTopic(tp);
    setSelectedPracticeAnswers({});
    setCompletedProblems([]);
    setCurrentFlashcardIndex(0);
    setIsFlipped(false);
    setVideoSlideIndex(0);
  };

  // Practice selection
  const handleAnswerPractice = (probId: string, optionIdx: number, correctIdx: number) => {
    if (completedProblems.includes(probId)) return;
    
    setSelectedPracticeAnswers(prev => ({ ...prev, [probId]: optionIdx }));
    setCompletedProblems(prev => [...prev, probId]);

    const isCorrect = optionIdx === correctIdx;
    if (isCorrect) {
      onUpdateUser(prev => ({ 
        ...prev, 
        xpPoints: prev.xpPoints + 10,
        badges: prev.badges.includes('Topic Voyager') ? prev.badges : [...prev.badges, 'Topic Voyager']
      }));
    }
  };

  // Explainer Video Slide Data
  const getSimulatedSlides = () => {
    if (!selectedTopic) return [];
    return [
      {
        title: `Introduction: ${selectedTopic.name}`,
        narrator: `Welcome back scholar! Let's explore the conceptual structure of ${selectedTopic.name}. We always begin by highlighting physical constants and coordinate markers.`,
        visual: '✏️ Base parameters loading...'
      },
      {
        title: 'Formula Breakdown & LaTeX Application',
        narrator: `Look at the main equation displayed here. Notice the parameters. We calculate these directly to satisfy secondary CBSE, JEE, or NEET questions.`,
        visual: selectedTopic.formulas[0] ? `$$${selectedTopic.formulas[0]}$$` : 'Calculating models...'
      },
      {
        title: 'Strategic Shortcuts for JEE / NEET Exam Timeframes',
        narrator: `When working under fast timed tests constraints, bypass heavy computations. Apply direct shortcuts and eliminate outliers from the 4 optional variables.`,
        visual: '💡 Focus on the nature of roots & field strengths'
      },
      {
        title: 'Summary Points & Review Practice Worksheets',
        narrator: `We\'ve set up flashcards and practice problems. Go through them to cement this topic securely in your revision bank. Good luck!`,
        visual: '📚 Revisions Complete! Move to active worksheets.'
      }
    ];
  };

  const slides = getSimulatedSlides();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Subject checklist browser on Left */}
      <div className="space-y-4 lg:col-span-1">
        <div className="p-4 rounded-xl bg-[#1e293b] border border-white/5 space-y-3 shadow-md max-h-[80vh] overflow-y-auto">
          <div className="text-xs uppercase font-mono tracking-widest text-[#10b981] font-bold">Class {user.classLevel} Syllabus</div>
          <p className="text-[10px] text-[#94a3b8] leading-relaxed">Select chapter and target topic below:</p>

          <div className="space-y-2">
            {chapters.map((ch) => {
              const isSelected = selectedChapter?.id === ch.id;
              return (
                <div key={ch.id} className="space-y-1">
                  <button
                    id={`btn_ch_${ch.id}`}
                    onClick={() => handleSelectChapter(ch)}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-start gap-1.5 cursor-pointer ${isSelected ? 'bg-[#6366f1]/15 border border-[#6366f1]/35 text-white' : 'bg-[#020617]/60 border border-white/5 text-[#94a3b8] hover:text-white'}`}
                  >
                    <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-bold leading-normal truncate">{ch.name}</span>
                  </button>

                  {/* Show Topics if Chapter Selected */}
                  {isSelected && (
                    <div className="pl-4 space-y-1.5 pt-1">
                      {ch.topics.map((tp) => {
                        const isTpSelected = selectedTopic?.id === tp.id;
                        return (
                          <button
                            key={tp.id}
                            id={`btn_tp_${tp.id}`}
                            onClick={() => handleSelectTopic(tp)}
                            className={`w-full p-1.5 rounded text-[10px] text-left transition-all flex items-center justify-between cursor-pointer ${isTpSelected ? 'text-[#10b981] font-semibold bg-white/5' : 'text-[#94a3b8] hover:text-white'}`}
                          >
                            <span className="truncate">{tp.name}</span>
                            <ChevronRight className="w-3" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Reading area on Right */}
      <div className="lg:col-span-3 space-y-6">
        
        {selectedTopic ? (
          <div className="bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Header banner */}
            <div className="p-6 bg-gradient-to-r from-[#121232] to-[#111128] border-b border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#10b981]">Syllabus Topic</span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{selectedTopic.name}</h2>
                <div className="flex gap-2 items-center text-[10px] text-[#94a3b8] mt-1">
                  <span>Class {user.classLevel}</span>
                  <span>•</span>
                  <span>NCERT & Entrance Standard</span>
                </div>
              </div>

              {/* Download bookmark helper */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white transition-all cursor-pointer font-semibold">
                <Bookmark className="w-3.5 h-3.5" /> Save to Revision Book
              </button>
            </div>

            {/* Sub Tabs Toggle */}
            <div className="flex border-b border-white/5 bg-[#0e0e22] p-1 overflow-x-auto text-xs whitespace-nowrap">
              {[
                { id: 'notes', label: '📖 Study Notes' },
                { id: 'video', label: '💡 AI Explainer Slide Video' },
                { id: 'formulas', label: '⑃ Formula Sheet' },
                { id: 'pyqs', label: '✓ Previous Years Papers (PYQs)' },
                { id: 'practice', label: '✏️ Practice Problems' },
                { id: 'flashcards', label: '🎴 Flashcards Review' }
              ].map((tb) => {
                const isActive = activeSubTab === tb.id;
                return (
                  <button
                    key={tb.id}
                    id={`tab_sub_${tb.id}`}
                    onClick={() => setActiveSubTab(tb.id as any)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${isActive ? 'bg-[#6366f1] text-white' : 'text-[#94a3b8] hover:text-white'}`}
                  >
                    {tb.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              
              {/* STUDY NOTES SUB-TAB */}
              {activeSubTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs uppercase font-mono text-[#10b981] font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Structured Synthesis notes
                    </span>
                    <span className="text-[10px] text-[#94a3b8] font-mono">Billed: Included</span>
                  </div>

                  <div className="text-sm leading-relaxed text-[#f8fafc]/90 space-y-4 max-w-none prose prose-invert font-sans">
                    {/* Render paragraphs simple markdown blocks manually with beautiful style */}
                    {selectedTopic.notes.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('###')) {
                        return <h3 key={pIdx} className="text-base font-bold text-white pt-2 border-l-2 border-[#6366f1] pl-2.5 font-sans">{para.replace('###', '').trim()}</h3>;
                      }
                      if (para.startsWith('1.') || para.startsWith('-')) {
                        return (
                          <div key={pIdx} className="pl-4 space-y-1 my-2">
                            {para.split('\n').map((li, lIdx) => (
                              <p key={lIdx} className="text-[13px] text-[#94a3b8] leading-normal flex items-start gap-1.5 font-sans">
                                <span className="text-[#10b981] mt-1 shrink-0">•</span>
                                <span>{li.replace(/^(\d+\.|\-)\s*/, '')}</span>
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return <p key={pIdx} className="text-[13px] sm:text-sm text-[#f8fafc]/80 leading-relaxed font-sans">{para}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* EXPLAIER VIDEO SIMULATOR */}
              {activeSubTab === 'video' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 text-xs text-violet-300">
                    <strong>AI Explainer Platform:</strong> Simulated narrated slides representing complex mathematical models, structural bonds or vector formulas using text-to-speech parameters.
                  </div>

                  {/* Synthesia / D-ID Virtual Player Mockup */}
                  <div className="max-w-xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#020617] shadow-2xl relative">
                    
                    {/* Visual Stage screen */}
                    <div className="aspect-video p-6 flex flex-col justify-between items-center text-center bg-gradient-to-br from-[#121232] to-black relative">
                      
                      {/* Avatar Overlay Circle */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#10b981] flex items-center justify-center border-2 border-white/10 shadow-lg">
                          <span className="text-xs font-bold text-white font-mono">AI</span>
                        </div>
                        <div className="text-left font-mono">
                          <span className="text-[9px] uppercase font-bold text-[#10b981] block">Avatar Coach</span>
                          <span className="text-[8px] text-[#94a3b8]">Voice synth activated</span>
                        </div>
                      </div>

                      {/* Diagnostic waveform */}
                      {playingVideo && (
                        <div className="absolute top-4 right-4 flex gap-0.5 items-end h-6 w-10">
                          {Array.from({ length: 6 }).map((_, waveIdx) => (
                            <span 
                              key={waveIdx} 
                              className="w-1 bg-[#10b981] rounded-full animate-bounce"
                              style={{ 
                                height: `${Math.random() * 100}%`,
                                animationDuration: `${0.4 + waveIdx * 0.1}s`
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Centered slide formulas visual */}
                      <div className="my-auto py-10">
                        <h4 className="text-sm font-semibold text-white/50 mb-4">{slides[videoSlideIndex]?.title}</h4>
                        <div className="text-lg font-mono text-white p-3.5 rounded bg-white/5 border border-white/5 inline-block">
                          {slides[videoSlideIndex]?.visual}
                        </div>
                      </div>

                      {/* Narrator prompt track text block */}
                      <div className="w-full bg-black/60 p-3 rounded border border-white/5 backdrop-blur">
                        <p className="text-[11px] sm:text-xs text-[#10b981] font-sans">
                          {playingVideo ? slides[videoSlideIndex]?.narrator : '[Video Paused. Hit Play to simulate audio explanation and auto-slide narrative transcripts]'}
                        </p>
                      </div>

                    </div>

                    {/* Progress Slider Bar */}
                    <div className="h-1 bg-white/5 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-[#10b981] to-[#6366f1] transition-all duration-300" 
                        style={{ width: `${((videoSlideIndex + 1) / slides.length) * 100}%` }}
                      />
                    </div>

                    {/* Player controls */}
                    <div className="p-4 bg-[#1e293b] border-t border-white/5 flex items-center justify-between text-xs">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPlayingVideo(!playingVideo)}
                          className="px-3.5 py-1.5 bg-[#10b981] hover:brightness-110 text-[#0f172a] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          {playingVideo ? 'Pause Video' : 'Play Explainer'}
                        </button>
                        <button
                          onClick={() => {
                            setVideoSlideIndex(0);
                            setPlayingVideo(false);
                          }}
                          className="p-1 px-2 hover:bg-white/5 text-white/80 rounded"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-2 items-center">
                        <button
                          disabled={videoSlideIndex === 0}
                          onClick={() => setVideoSlideIndex(prev => prev - 1)}
                          className="p-1 text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-xs text-[#94a3b8]">Slide {videoSlideIndex + 1} / {slides.length}</span>
                        <button
                          disabled={videoSlideIndex === slides.length - 1}
                          onClick={() => setVideoSlideIndex(prev => prev + 1)}
                          className="p-1 text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* FORMULAS LIST TAB */}
              {activeSubTab === 'formulas' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">Important Formulas sheet</span>
                    <button className="text-[10px] text-amber-400 flex items-center gap-1 hover:underline cursor-pointer">
                      <Download className="w-3" /> Download Printable PDF Sheet
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTopic.formulas.map((form, fIdx) => (
                      <div key={fIdx} className="p-4 rounded-xl bg-[#020617] border border-white/5 hover:border-[#10b981]/10 transition-colors">
                        <div className="text-[10px] text-[#94a3b8] font-mono mb-2">Equation {fIdx + 1}</div>
                        <div className="text-xs sm:text-sm font-mono text-white text-center py-2.5 bg-black/30 rounded border border-white/5 overflow-x-auto">
                          $${form}$$
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PYQS TIMELINE TAB */}
              {activeSubTab === 'pyqs' && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase text-[#10b981] font-bold pb-2 border-b border-white/5">
                    Previous Year competitive & Board papers questions
                  </div>

                  {selectedTopic.pyqs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#94a3b8]">No PYQ questions compiled under this mock topic.</div>
                  ) : (
                    <div className="space-y-4">
                      {selectedTopic.pyqs.map((pyq) => (
                        <div key={pyq.id} className="p-4 sm:p-5 rounded-xl bg-[#020617] border border-white/5 space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[#6366f1] font-bold">
                              {pyq.examName} • {pyq.year}
                            </span>
                            <span className="text-[#10b981]">✓ Answer Sheet Verified</span>
                          </div>

                          <h4 className="text-xs sm:text-sm text-white/95 font-semibold font-sans">{pyq.question}</h4>

                          <div className="p-3 rounded bg-emerald-500/5 text-xs text-white border border-emerald-500/10">
                            <strong>Official Answer:</strong> <span className="font-mono text-emerald-400 font-bold">{pyq.answer}</span>
                          </div>

                          <div className="p-3.5 bg-white/5 rounded-lg text-xs tracking-wide">
                            <span className="text-[10px] uppercase font-mono text-violet-400 font-bold block mb-1">Detailed Explanation:</span>
                            <p className="text-[#94a3b8] leading-relaxed font-sans">{pyq.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PRACTICE PROBLEM MCQ TAB */}
              {activeSubTab === 'practice' && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase text-[#10b981] font-bold pb-2 border-b border-white/5 flex justify-between items-center">
                    <span>Topic problem set (+10 XP per correct answer)</span>
                    <span className="text-xs text-[#94a3b8] font-sans font-normal">Score: {completedProblems.filter(id => {
                      const prob = selectedTopic.practiceProblems.find(p => p.id === id);
                      return prob && selectedPracticeAnswers[id] === prob.correctIndex;
                    }).length} / {selectedTopic.practiceProblems.length} Complete</span>
                  </div>

                  <div className="space-y-6">
                    {selectedTopic.practiceProblems.map((prob, pIdx) => {
                      const isCompleted = completedProblems.includes(prob.id);
                      const myAnsIdx = selectedPracticeAnswers[prob.id];
                      const isCorrect = myAnsIdx === prob.correctIndex;

                      return (
                        <div key={prob.id} className="p-4 sm:p-5 rounded-xl bg-[#020617] border border-white/5 space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-[#6366f1] font-bold">EXERCISE {pIdx + 1}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold ${prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-400'}`}>
                              {prob.difficulty}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-semibold text-white/95 font-sans leading-relaxed">{prob.question}</h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                            {prob.options.map((opt, oIdx) => {
                              let btnStyle = 'border-white/5 bg-[#1e293b] text-white/95 hover:border-white/10';
                              if (isCompleted) {
                                if (oIdx === prob.correctIndex) {
                                  btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold';
                                } else if (myAnsIdx === oIdx) {
                                  btnStyle = 'bg-rose-500/10 border-rose-500 text-rose-400';
                                } else {
                                  btnStyle = 'opacity-40 border-white/5 bg-[#1e293b] text-[#94a3b8]';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  id={`btn_prob_${prob.id}_opt_${oIdx}`}
                                  onClick={() => handleAnswerPractice(prob.id, oIdx, prob.correctIndex)}
                                  disabled={isCompleted}
                                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${btnStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {isCompleted && (
                            <div className="p-3 bg-white/5 rounded-lg text-xs leading-relaxed">
                              {isCorrect ? (
                                <span className="text-emerald-400 font-semibold block mb-1">✓ Perfect. +10 XP rewards added!</span>
                              ) : (
                                <span className="text-rose-400 font-semibold block mb-1">✗ Incorrect answer. Recheck details:</span>
                              )}
                              <p className="text-[#94a3b8] font-sans">{prob.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FLASHCARDS REVIEW TAB */}
              {activeSubTab === 'flashcards' && (
                <div className="space-y-6">
                  <div className="text-xs font-mono uppercase text-[#10b981] font-bold pb-2 border-b border-white/5 text-center">
                    Active Recall Flashcards review
                  </div>

                  {selectedTopic.flashcards.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#94a3b8]">No card blocks configured here.</div>
                  ) : (
                    <div className="max-w-md mx-auto space-y-4">
                      
                      {/* Flipping structure */}
                      <div 
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="h-48 rounded-xl bg-gradient-to-br from-[#121235] to-[#1a1a45] border-2 border-white/10 p-6 flex flex-col justify-center items-center text-center cursor-pointer relative shadow-2xl overflow-hidden group select-none"
                      >
                        <div className="absolute top-2 right-3 text-[9px] uppercase font-mono text-[#94a3b8] select-none">
                          {isFlipped ? 'DISPLAYING DEF' : 'DISPLAYING TERM [CLICK TO FLIP]'}
                        </div>

                        {!isFlipped ? (
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#10b981] font-mono uppercase tracking-widest block font-semibold">TERM DEFINITION</span>
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide font-sans leading-normal">
                              {selectedTopic.flashcards[currentFlashcardIndex]?.term}
                            </h3>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[10px] text-violet-400 font-mono uppercase tracking-widest block font-semibold">ACADEMIC DEFINITION WALKTHROUGH</span>
                            <p className="text-xs sm:text-sm text-white/95 leading-relaxed max-w-xs font-sans">
                              {selectedTopic.flashcards[currentFlashcardIndex]?.definition}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Direction utilities */}
                      <div className="flex items-center justify-between text-xs px-2 select-none">
                        <button
                          disabled={currentFlashcardIndex === 0}
                          onClick={() => {
                            setCurrentFlashcardIndex(prev => prev - 1);
                            setIsFlipped(false);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                        >
                          Previous Card
                        </button>
                        <span className="font-mono text-[#94a3b8]">Card {currentFlashcardIndex + 1} / {selectedTopic.flashcards.length}</span>
                        <button
                          disabled={currentFlashcardIndex === selectedTopic.flashcards.length - 1}
                          onClick={() => {
                            setCurrentFlashcardIndex(prev => prev + 1);
                            setIsFlipped(false);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
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
        ) : (
          <div className="p-8 text-center bg-[#1e293b] border border-white/5 rounded-2xl">
            <span className="text-xs text-[#94a3b8]">No curriculum files selected. Select class stream chapters to start reviewing.</span>
          </div>
        )}

      </div>

    </div>
  );
}
