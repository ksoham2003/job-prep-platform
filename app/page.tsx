// app/page.tsx (or wherever you're using ResumeUpload)
'use client';

import { useState, useEffect } from 'react';
import { JobApplication, ResumeAnalysis, UserProgress, CreateApplicationData } from '../types';
import Header from '../components/ui/Header';
import ResumeUpload from '../components/resume/ResumeUpload';
import AnalysisResults from '../components/resume/AnalysisResults';
import AssessmentComponent from '../components/assessment/AssessmentComponent';
import ProgressTracker from '../components/progress/ProgressTracker';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'assessment' | 'progress'>('upload');
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedApplication = localStorage.getItem('currentApplication');
    const savedAnalysis = localStorage.getItem('currentAnalysis');
    const savedProgress = localStorage.getItem('currentProgress');

    if (savedApplication) {
      const appData = JSON.parse(savedApplication);
      setApplication({ ...appData, createdAt: new Date(appData.createdAt) });
    }
    if (savedAnalysis) setAnalysis(JSON.parse(savedAnalysis));
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      setProgress({ ...progressData, lastUpdated: new Date(progressData.lastUpdated) });
    }
  }, []);

  const handleApplicationSubmit = async (appData: CreateApplicationData) => {
    setIsLoading(true);
    try {
      // Call API to analyze resume
      const formData = new FormData();
      formData.append('jobTitle', appData.jobTitle);
      formData.append('jobDescription', appData.jobDescription);
      formData.append('jobUrl', appData.jobUrl || '');
      if (appData.resume) {
        formData.append('resume', appData.resume);
      }

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      if (result.success) {
        setApplication(result.data.application);
        setAnalysis(result.data.analysis);
        
        localStorage.setItem('currentApplication', JSON.stringify(result.data.application));
        localStorage.setItem('currentAnalysis', JSON.stringify(result.data.analysis));
        
        // Initialize progress
        const newProgress: UserProgress = {
          userId: 'user-1', // This would come from authentication
          applicationId: result.data.application._id,
          completedAssessments: [],
          overallScore: result.data.analysis.score,
          resumeScore: result.data.analysis.score,
          lastUpdated: new Date()
        };
        
        setProgress(newProgress);
        localStorage.setItem('currentProgress', JSON.stringify(newProgress));
        
        setCurrentStep('analysis');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
      
    } catch (error) {
      console.error('Error processing application:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssessmentComplete = (assessmentId: string, score: number) => {
    if (progress && application) {
      const updatedProgress: UserProgress = {
        ...progress,
        completedAssessments: [...progress.completedAssessments, assessmentId],
        overallScore: Math.round((progress.overallScore + score) / 2),
        lastUpdated: new Date()
      };
      setProgress(updatedProgress);
      localStorage.setItem('currentProgress', JSON.stringify(updatedProgress));
    }
  };

  const resetApplication = () => {
    setApplication(null);
    setAnalysis(null);
    setProgress(null);
    setCurrentStep('upload');
    localStorage.removeItem('currentApplication');
    localStorage.removeItem('currentAnalysis');
    localStorage.removeItem('currentProgress');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            JobPrep <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered resume analysis and interview preparation. Get personalized feedback and practice assessments.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {['upload', 'analysis', 'assessment', 'progress'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step
                      ? 'bg-blue-600 text-white'
                      : index < ['upload', 'analysis', 'assessment', 'progress'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-24 h-1 ${
                      index < ['upload', 'analysis', 'assessment', 'progress'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Upload Resume</span>
            <span>AI Analysis</span>
            <span>Assessments</span>
            <span>Progress</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {currentStep === 'upload' && (
            <ResumeUpload 
              onSubmit={handleApplicationSubmit} 
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 'analysis' && analysis && (
            <AnalysisResults 
              analysis={analysis} 
              onContinue={() => setCurrentStep('assessment')}
            />
          )}
          
          {currentStep === 'assessment' && application && progress && (
            <AssessmentComponent 
              application={application}
              progress={progress}
              onComplete={handleAssessmentComplete}
              onViewProgress={() => setCurrentStep('progress')}
            />
          )}
          
          {currentStep === 'progress' && progress && application && analysis && (
            <ProgressTracker 
              progress={progress} 
              application={application}
              analysis={analysis}
              onRestart={resetApplication}
            />
          )}
        </div>
      </div>
    </main>
  );
}