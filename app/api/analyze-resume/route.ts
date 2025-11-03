// app/api/analyze-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getCurrentUser, checkCredits, deductCredits } from '../../../lib/auth';
import connectDB from '../../../lib/db';
import Application from '../../../models/Application';
import { ResumeAnalyzer } from '../../../lib/gemini';
import { uploadToCloudinary } from '../../../lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // First check if user is authenticated with Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Then get our database user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has enough credits
    const hasCredits = await checkCredits(user._id.toString(), 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    const formData = await request.formData();
    
    const jobTitle = formData.get('jobTitle') as string;
    const company = formData.get('company') as string;
    const jobUrl = formData.get('jobUrl') as string;
    const jobDescription = formData.get('jobDescription') as string;
    const resumeFile = formData.get('resume') as File;

    // Validate required fields
    if (!resumeFile || !jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Upload resume to Cloudinary
    const resumeUrl = await uploadToCloudinary(resumeFile, 'resumes');
    
    // For demo purposes, we'll simulate PDF text extraction
    const simulatedResumeText = `
      JOHN DOE
      Software Engineer
      Email: john.doe@email.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe
      
      SUMMARY
      Experienced software engineer with 5+ years in full-stack development. Proficient in JavaScript, 
      React, Node.js, and Python. Strong background in building scalable web applications and leading 
      development teams.
      
      EXPERIENCE
      Senior Software Engineer - Tech Company Inc. (2020-Present)
      - Led development of customer-facing web applications using React and Node.js
      - Improved application performance by 40% through code optimization
      - Mentored 3 junior developers and conducted code reviews
      
      Software Developer - Startup Co. (2018-2020)
      - Developed RESTful APIs using Express.js and MongoDB
      - Implemented responsive UI components with React and Tailwind CSS
      - Collaborated with product team to deliver features on schedule
      
      SKILLS
      Programming Languages: JavaScript, TypeScript, Python, Java
      Frontend: React, Next.js, HTML5, CSS3, Tailwind CSS
      Backend: Node.js, Express.js, Django, REST APIs
      Databases: MongoDB, PostgreSQL, MySQL
      Tools: Git, Docker, AWS, Jenkins
      
      EDUCATION
      Bachelor of Science in Computer Science - University of Technology (2014-2018)
    `;

    // Create application record
    const application = await Application.create({
      userId: user._id,
      jobTitle,
      company,
      jobUrl,
      jobDescription,
      resumeUrl,
      resumeText: simulatedResumeText,
      status: 'analyzing',
    });

    try {
      // Analyze with Gemini AI
      const analyzer = new ResumeAnalyzer();
      const analysisResult = await analyzer.analyzeResume(
        simulatedResumeText,
        jobDescription,
        jobTitle
      );

      // Update application with analysis results
      application.analysis = {
        ...analysisResult,
        aiModel: 'gemini-pro',
        analyzedAt: new Date(),
      };
      application.status = 'completed';

      await application.save();

      // Deduct credits after successful analysis
      await deductCredits(user._id.toString(), 1);

      return NextResponse.json({
        success: true,
        data: {
          application: {
            id: application._id,
            ...application.toObject(),
          },
          analysis: analysisResult,
          remainingCredits: user.credits - 1,
        },
      });

    } catch (analysisError) {
      // If analysis fails, mark as completed but without analysis
      application.status = 'completed';
      await application.save();

      // Still deduct credits as service was used
      await deductCredits(user._id.toString(), 1);

      return NextResponse.json(
        { 
          error: 'Analysis failed, but application was saved',
          applicationId: application._id 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in resume analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}