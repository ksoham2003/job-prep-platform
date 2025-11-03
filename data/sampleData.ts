// data/sampleData.ts
import { Assessment } from '../types';

export const sampleAssessments: Assessment[] = [
  {
    id: 'mcq-tech',
    type: 'technical',
    title: 'Technical Skills Assessment',
    description: 'Test your knowledge of core technical concepts and programming fundamentals',
    difficulty: 'medium',
    category: ['programming', 'fundamentals'],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is the time complexity of binary search in the worst case?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 'O(log n)',
        explanation: 'Binary search divides the search space in half each time, resulting in logarithmic time complexity O(log n).',
        points: 1
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which React hook is used for performing side effects?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 'useEffect',
        explanation: 'useEffect is designed for side effects like data fetching, subscriptions, or manually changing the DOM.',
        points: 1
      }
    ],
    duration: 30,
    passingScore: 70,
    isActive: true,
    tags: ['javascript', 'react', 'algorithms']
  },
  {
    id: 'audio-behavioral',
    type: 'behavioral',
    title: 'Behavioral Interview Practice',
    description: 'Practice answering common behavioral questions with audio responses',
    difficulty: 'easy',
    category: ['behavioral', 'communication'],
    questions: [
      {
        id: 'a1',
        type: 'audio-response',
        question: 'Tell me about a time you faced a significant challenge at work and how you handled it.',
        audioPrompt: 'Describe the situation, your action, and the result. Focus on your problem-solving process and what you learned.',
        points: 1
      }
    ],
    duration: 15,
    passingScore: 70,
    isActive: true,
    tags: ['behavioral', 'communication', 'problem-solving']
  }
];