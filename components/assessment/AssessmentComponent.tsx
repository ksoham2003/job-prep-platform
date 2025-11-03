// components/assessment/AssessmentComponent.tsx
'use client';

import { useState } from 'react';
import { JobApplication, UserProgress, Assessment, Question } from '../../types';
import MCQQuestion from './MCQQuestion';
import AudioQuestion from './AudioQuestion';
import { sampleAssessments } from '../../data/sampleData';
import { Play, CheckCircle, Clock } from 'lucide-react';

interface AssessmentComponentProps {
  application: JobApplication;
  progress: UserProgress; // Changed from Progress to UserProgress
  onComplete: (assessmentId: string, score: number) => void;
  onViewProgress: () => void;
}

export default function AssessmentComponent({ 
  application, 
  progress, 
  onComplete, 
  onViewProgress 
}: AssessmentComponentProps) {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    if (!currentAssessment) return 0;
    
    let correct = 0;
    currentAssessment.questions.forEach((question: Question) => {
      if (question.correctAnswer && userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    return (correct / currentAssessment.questions.length) * 100;
  };

  const handleComplete = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
    
    if (currentAssessment) {
      onComplete(currentAssessment.id, finalScore);
    }
  };

  const currentQuestion = currentAssessment?.questions[currentQuestionIndex];

  if (!currentAssessment) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Skill Assessments</h2>
          <p className="text-gray-600">Test your knowledge and practice for interviews</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sampleAssessments.map(assessment => {
            const isCompleted = progress.completedAssessments.includes(assessment.id);
            
            return (
              <div 
                key={assessment.id}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                  isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-500 bg-white'
                }`}
                onClick={() => startAssessment(assessment)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
                  {isCompleted && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                </div>
                <p className="text-gray-600 mb-4 text-sm">{assessment.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{assessment.questions.length} questions</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assessment.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800'
                      : assessment.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assessment.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 font-medium">
                  <Play size={16} />
                  <span>{isCompleted ? 'Retake Assessment' : 'Start Assessment'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onViewProgress}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            View Progress Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const isPassing = score >= 70;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isPassing ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isPassing ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <Clock className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h3>
          <p className="text-gray-600">You have completed {currentAssessment.title}</p>
        </div>

        <div className={`bg-gradient-to-r rounded-xl p-6 text-white mb-6 inline-block ${
          isPassing ? 'from-green-500 to-emerald-600' : 'from-red-500 to-orange-600'
        }`}>
          <div className="text-4xl font-bold mb-2">{score.toFixed(1)}%</div>
          <div className="opacity-90">Your Score</div>
        </div>

        <div className="space-y-4 max-w-sm mx-auto">
          <button
            onClick={() => setCurrentAssessment(null)}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Take Another Assessment
          </button>
          <button
            onClick={onViewProgress}
            className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            View Progress Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{currentAssessment.title}</h3>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {currentAssessment.questions.length}
          </p>
        </div>
        <button
          onClick={() => setCurrentAssessment(null)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Exit Assessment
        </button>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {currentQuestion?.type === 'multiple-choice' && (
        <MCQQuestion
          question={currentQuestion}
          userAnswer={userAnswers[currentQuestion.id]}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        />
      )}

      {currentQuestion?.type === 'audio-response' && (
        <AudioQuestion
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        />
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Previous
        </button>
        
        {currentQuestionIndex < currentAssessment.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Complete Assessment
          </button>
        )}
      </div>
    </div>
  );
}