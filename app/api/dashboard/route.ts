// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getCurrentUser } from '../../../lib/auth';
import connectDB from '../../../lib/db';
import Application from '../../../models/Application';
import Progress from '../../../models/Progress';

export async function GET(request: NextRequest) {
  try {
    // Check authentication with Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get our database user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await connectDB();

    // Get user's applications
    const applications = await Application.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user's progress/assessments
    const progress = await Progress.find({ userId: user._id })
      .populate('assessmentId')
      .sort({ completedAt: -1 })
      .limit(5);

    // Calculate stats
    const totalApplications = await Application.countDocuments({ userId: user._id });
    const completedAssessments = await Progress.countDocuments({ userId: user._id });
    
    const averageScore = progress.length > 0 
      ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length)
      : 0;

    const latestApplication = applications[0];
    const resumeScore = latestApplication?.analysis?.score || 0;

    // Get skills to improve from latest analysis
    const skillsToImprove = latestApplication?.analysis?.missingSkills?.slice(0, 3) || [];

    // Prepare recent activity
    const recentActivity = [
      ...applications.map(app => ({
        type: 'application' as const,
        title: `Application for ${app.jobTitle}`,
        score: app.analysis?.score,
        date: app.createdAt,
      })),
      ...progress.map(prog => ({
        type: 'assessment' as const,
        title: `Completed ${prog.assessmentId?.title || 'Assessment'}`,
        score: prog.score,
        date: prog.completedAt || prog.createdAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
     .slice(0, 5);

    return NextResponse.json({
      totalApplications,
      completedAssessments,
      averageScore,
      resumeScore,
      skillsToImprove,
      recentActivity,
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}