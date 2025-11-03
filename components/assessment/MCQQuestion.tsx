// components/assessment/MCQQuestion.tsx
'use client';

import { Question } from '../../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface MCQQuestionProps {
  question: Question;
  userAnswer: string | undefined;
  onAnswer: (answer: string) => void;
}

export default function MCQQuestion({ question, userAnswer, onAnswer }: MCQQuestionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 border">
        <h4 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h4>
        
        {question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = userAnswer === option;
              
              return (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => onAnswer(option)}
                    className="hidden"
                  />
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="h-6 w-6 text-blue-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <span className="flex-1 text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {userAnswer && question.explanation && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
          <p className="text-blue-700 text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}