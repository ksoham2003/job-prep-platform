// components/resume/AnalysisResults.tsx
'use client';

import { ResumeAnalysis } from '../../types';
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
  onContinue: () => void;
}

export default function AnalysisResults({ analysis, onContinue }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-indigo-600';
    return 'from-orange-500 to-red-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Complete</h2>
        <p className="text-gray-600">AI-powered insights to improve your resume</p>
      </div>

      {/* Score Card */}
      <div className={`bg-gradient-to-r ${getScoreColor(analysis.score)} rounded-xl p-6 text-white mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Overall Score</h3>
            <p className="opacity-90">Based on job requirements and best practices</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{analysis.score}/100</div>
            <div className="opacity-90 mt-2">{getScoreText(analysis.score)}</div>
          </div>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mt-4">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000"
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Strengths */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-xl font-semibold text-green-800">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span className="text-green-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="text-xl font-semibold text-orange-800">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-500 mr-2 mt-1">•</span>
                <span className="text-orange-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Skills Analysis</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-600 mb-3">Matched Skills</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium border border-green-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-red-600 mb-3">Missing Skills</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-red-100 text-red-800 px-3 py-2 rounded-full text-sm font-medium border border-red-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-purple-50 rounded-lg p-6 mb-8 border border-purple-200">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-6 w-6 text-purple-500 mr-2" />
          <h3 className="text-xl font-semibold text-purple-800">Actionable Suggestions</h3>
        </div>
        <ul className="space-y-3">
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="text-purple-500 mr-2 mt-1">•</span>
              <span className="text-purple-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Analysis */}
      {analysis.analysis && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{analysis.analysis}</p>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
        >
          <span>Continue to Skill Assessments</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}