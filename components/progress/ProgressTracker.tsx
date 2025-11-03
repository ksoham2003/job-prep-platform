'use client';

import { UserProgress, JobApplication, ResumeAnalysis } from '../../types';
import { CheckCircle, Clock, TrendingUp, Target, Award, FileText } from 'lucide-react';

interface ProgressTrackerProps {
  progress: UserProgress; // Changed from Progress to UserProgress
  application: JobApplication;
  analysis: ResumeAnalysis;
  onRestart: () => void;
}

export default function ProgressTracker({ progress, application, analysis, onRestart }: ProgressTrackerProps) {
  const assessments = [
    { id: 'resume-review', name: 'Resume Analysis', completed: true, score: analysis.score, type: 'analysis' },
    { id: 'mcq-tech', name: 'Technical Skills Test', completed: progress.completedAssessments.includes('mcq-tech'), score: 85, type: 'mcq' },
    { id: 'audio-behavioral', name: 'Behavioral Interview', completed: progress.completedAssessments.includes('audio-behavioral'), score: 75, type: 'audio' },
    { id: 'mcq-system-design', name: 'System Design', completed: progress.completedAssessments.includes('mcq-system-design'), score: 0, type: 'mcq' },
  ];

  const completedCount = assessments.filter(a => a.completed).length;
  const totalCount = assessments.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Progress Dashboard</h2>
        <p className="text-gray-600">Track your preparation journey</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Overall Progress</h3>
            <p className="opacity-90">{completedCount} of {totalCount} assessments completed</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{completionPercentage.toFixed(0)}%</div>
            <div className="opacity-90 mt-2">Complete</div>
          </div>
        </div>
        <div className="w-full bg-blue-400 rounded-full h-3 mt-4">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{progress.overallScore}%</div>
          <div className="text-green-700 font-medium">Overall Score</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
          <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
          <div className="text-blue-700 font-medium">Completed</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
          <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
          <div className="text-orange-700 font-medium">Remaining</div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Job Title</p>
            <p className="font-medium text-gray-900">{application.jobTitle}</p>
          </div>
          {application.company && (
            <div>
              <p className="text-gray-600 text-sm">Company</p>
              <p className="font-medium text-gray-900">{application.company}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600 text-sm">Resume Score</p>
            <p className={`font-medium ${getScoreColor(analysis.score)}`}>{analysis.score}/100</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Last Updated</p>
            <p className="font-medium text-gray-900">
              {progress.lastUpdated.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Assessments Progress */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessments Progress</h3>
        <div className="space-y-4">
          {assessments.map(assessment => (
            <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  assessment.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {assessment.type === 'analysis' ? (
                    <FileText className="h-5 w-5" />
                  ) : assessment.type === 'mcq' ? (
                    <Award className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{assessment.name}</h4>
                  <p className={`text-sm ${
                    assessment.completed ? getScoreColor(assessment.score) : 'text-gray-500'
                  }`}>
                    {assessment.completed ? `Score: ${assessment.score}%` : 'Not started'}
                  </p>
                </div>
              </div>
              {assessment.completed ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Completed</span>
                </div>
              ) : (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors font-medium">
                  Start
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Next Steps & Recommendations</h3>
        <ul className="space-y-3 text-blue-800">
          {completionPercentage < 100 && (
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Complete remaining assessments to get full personalized feedback</span>
            </li>
          )}
          {analysis.score < 70 && (
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Focus on improving your resume based on the AI analysis</span>
            </li>
          )}
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 mt-1">•</span>
            <span>Practice behavioral questions for better interview performance</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 mt-1">•</span>
            <span>Review technical concepts related to {application.jobTitle}</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 mt-1">•</span>
            <span>Schedule mock interviews to build confidence</span>
          </li>
        </ul>
      </div>

      <div className="text-center space-y-4">
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          Start New Application
        </button>
        <p className="text-gray-600 text-sm">
          Ready to apply? You&apos;ve completed {completionPercentage.toFixed(0)}% of recommended preparation.
        </p>
      </div>
    </div>
  );
}