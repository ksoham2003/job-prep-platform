// lib/auth.ts
import { currentUser } from '@clerk/nextjs/server';
import User from '../models/User';
import connectDB from './db';

export async function getCurrentUser() {
  try {
    // Use currentUser() from @clerk/nextjs/server
    const user = await currentUser();
    
    if (!user) {
      return null;
    }

    await connectDB();
    
    // Get user from database
    let dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      // If user doesn't exist in our database, create them
      dbUser = await User.create({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        profileImage: user.imageUrl,
        subscription: 'free',
        credits: 10,
        settings: {
          emailNotifications: true,
          weeklyReports: true,
        },
      });
    }

    return dbUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

export async function checkCredits(userId: string, requiredCredits: number = 1) {
  try {
    await connectDB();
    const user = await User.findById(userId);
    
    if (!user) {
      return false;
    }

    return user.credits >= requiredCredits;
  } catch (error) {
    console.error('Error checking credits:', error);
    return false;
  }
}

export async function deductCredits(userId: string, credits: number = 1) {
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: -credits } },
      { new: true }
    );
    
    return user;
  } catch (error) {
    console.error('Error deducting credits:', error);
    return null;
  }
}

export async function addCredits(userId: string, credits: number = 1) {
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits } },
      { new: true }
    );
    
    return user;
  } catch (error) {
    console.error('Error adding credits:', error);
    return null;
  }
}