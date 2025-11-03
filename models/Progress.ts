// models/Progress.ts
import mongoose from 'mongoose';

export interface IProgress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
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

const ProgressSchema = new mongoose.Schema<IProgress>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    answers: [{
      questionId: String,
      userAnswer: String,
      isCorrect: Boolean,
      timeSpent: Number,
    }],
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

ProgressSchema.index({ userId: 1, applicationId: 1 });
ProgressSchema.index({ userId: 1, completedAt: -1 });

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);