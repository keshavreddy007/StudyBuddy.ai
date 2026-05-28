/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ClassLevel = '10' | '11' | '12';
export type Stream = 'PCM' | 'PCB' | 'Commerce' | 'General';
export type ExamTarget = 'JEE' | 'NEET' | 'Board' | 'State CET' | 'Other';

export interface UserProfile {
  name: string;
  email: string;
  classLevel: ClassLevel;
  stream: Stream;
  examTarget: ExamTarget;
  isSubscribed: boolean;
  planId: 'class-10-scholar' | 'class-11-12-pro' | null;
  subscriptionEndDate: string | null;
  xpPoints: number;
  badges: string[];
  streakDays: number;
  lastActiveDate: string | null;
  examDate: string; // YYYY-MM-DD
  weakSubjects?: string;
  studyPlan?: StudyPlanDay[];
  savedDoubts?: DoubtMessage[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Topic {
  id: string;
  name: string;
  notes: string; // Markdown supported notes
  formulas: string[]; // Formulas styled in LaTeX
  pyqs: PYQ[];
  practiceProblems: PracticeProblem[];
  flashcards: Flashcard[];
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface PYQ {
  id: string;
  year: number;
  examName: 'JEE Mains' | 'JEE Advanced' | 'NEET UG' | 'CBSE Board' | 'State CET';
  question: string;
  answer: string;
  explanation: string;
}

export interface PracticeProblem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

// Doubt Solver Typed Communication
export interface DoubtMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  imageUrl?: string;
  ocrText?: string;
  solutionData?: {
    subject: string;
    topic: string;
    steps: string[];
    formula?: string;
    tip?: string;
    related_chapter?: string;
  };
}

export interface SavedDoubt {
  id: string;
  question: string;
  imageUrl?: string;
  solution: DoubtMessage['solutionData'];
  timestamp: string;
}

// Resource Hub Content
export interface ResourceSummary {
  summary: string;
  explanation: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  flashcards: {
    term: string;
    definition: string;
  }[];
}

// Study Schedule Output
export interface StudyPlanDay {
  day: number;
  date: string;
  topics: string[];
  goal: string;
}
