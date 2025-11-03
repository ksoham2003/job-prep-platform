// types/index.ts
// Remove the model imports and define types directly
import { IUser, IApplication, IAssessment } from '../models';

export type User = IUser;
export type Application = IApplication;
export type Assessment = IAssessment;
// User types
// export interface User {
//   _id: string;
//   clerkId: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   profileImage?: string;
//   subscription: 'free' | 'pro' | 'enterprise';
//   credits: number;
//   settings: {
//     emailNotifications: boolean;
//     weeklyReports: boolean;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

// types/index.ts
// Add a type for creating new applications (without the database-specific fields)
export interface CreateApplicationData {
  jobTitle: string;
  company?: string;
  jobUrl?: string;
  jobDescription: string;
  resume: File; // This is the file to be uploaded
}

// Update the JobApplication interface to match the database model
export interface JobApplication {
  _id: string;
  userId: string;
  jobTitle: string;
  company?: string;
  jobUrl?: string;
  jobDescription: string;
  resumeUrl: string; // This is the URL after upload
  resumeText: string;
  status: 'draft' | 'analyzing' | 'completed' | 'archived';
  analysis?: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    analysis: string;
    aiModel: string;
    analyzedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Assessment types
export interface Question {
  id: string;
  type: 'multiple-choice' | 'audio-response';
  question: string;
  options?: string[];
  correctAnswer?: string;
  audioPrompt?: string;
  explanation?: string;
  points: number;
}

// export interface Assessment {
//   _id: string;
//   id: string;
//   title: string;
//   description: string;
//   type: 'technical' | 'behavioral' | 'system-design' | 'resume-review';
//   difficulty: 'easy' | 'medium' | 'hard';
//   category: string[];
//   questions: Question[];
//   duration: number;
//   passingScore: number;
//   isActive: boolean;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// types/index.ts
// Progress types
export interface Progress {
  _id: string;
  userId: string;
  applicationId: string;
  assessmentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Add a new type for tracking user progress across multiple assessments
export interface UserProgress {
  userId: string;
  applicationId: string;
  completedAssessments: string[]; // Array of assessment IDs that are completed
  overallScore: number;
  resumeScore: number;
  lastUpdated: Date;
}

// Form data types
export interface ResumeUploadData {
  jobTitle: string;
  company?: string;
  jobUrl?: string;
  jobDescription: string;
  resume: File;
}

export interface AssessmentResult {
  assessmentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }>;
}

// Resume Analysis types
export interface ResumeAnalysis {
  id: string;
  applicationId: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  analysis: string;
  aiModel?: string;
  analyzedAt?: Date;
}

// Dashboard types
export interface DashboardStats {
  totalApplications: number;
  completedAssessments: number;
  averageScore: number;
  resumeScore: number;
  skillsToImprove: string[];
  recentActivity: Array<{
    type: 'application' | 'assessment';
    title: string;
    score?: number;
    date: Date;
  }>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Clerk user type
export interface ClerkUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  publicMetadata?: {
    credits?: number;
    subscription?: string;
  };
}

