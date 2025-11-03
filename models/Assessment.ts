// models/Assessment.ts
import mongoose from 'mongoose';

export interface IQuestion {
  id: string;
  type: 'multiple-choice' | 'audio-response';
  question: string;
  options?: string[];
  correctAnswer?: string;
  audioPrompt?: string;
  explanation?: string;
  points: number;
}

export interface IAssessment extends mongoose.Document {
  title: string;
  description: string;
  type: 'technical' | 'behavioral' | 'system-design' | 'resume-review';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string[];
  questions: IQuestion[];
  duration: number; // in minutes
  passingScore: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new mongoose.Schema<IQuestion>({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'audio-response'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [String],
  correctAnswer: String,
  audioPrompt: String,
  explanation: String,
  points: {
    type: Number,
    default: 1,
  },
});

const AssessmentSchema = new mongoose.Schema<IAssessment>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['technical', 'behavioral', 'system-design', 'resume-review'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    category: [String],
    questions: [QuestionSchema],
    duration: {
      type: Number,
      default: 30,
    },
    passingScore: {
      type: Number,
      default: 70,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
AssessmentSchema.index({ type: 1, difficulty: 1, isActive: 1 });
AssessmentSchema.index({ tags: 1 });

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);