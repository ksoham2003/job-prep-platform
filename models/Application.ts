// models/Application.ts
import mongoose from 'mongoose';

export interface IApplication extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  jobTitle: string;
  company?: string;
  jobUrl?: string;
  jobDescription: string;
  resumeUrl: string;
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

const ApplicationSchema = new mongoose.Schema<IApplication>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: String,
    jobUrl: String,
    jobDescription: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'analyzing', 'completed', 'archived'],
      default: 'draft',
    },
    analysis: {
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      score: Number,
      matchedSkills: [String],
      missingSkills: [String],
      analysis: String,
      aiModel: String,
      analyzedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ userId: 1, createdAt: -1 });
ApplicationSchema.index({ status: 1 });

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);