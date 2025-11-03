// models/User.ts
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  subscription: 'free' | 'pro' | 'enterprise';
  credits: number;
  settings: {
    emailNotifications: boolean;
    weeklyReports: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profileImage: String,
    subscription: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    credits: {
      type: Number,
      default: 10,
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);