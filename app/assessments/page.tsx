// app/assessments/page.tsx
import Header from '../../components/ui/Header';
import { sampleAssessments } from '../../data/sampleData';
import { Play, Award, Clock } from 'lucide-react';

export default function Assessments() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Practice Assessments</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Test your skills with our comprehensive assessment library
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleAssessments.map(assessment => (
              <div 
                key={assessment.id}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assessment.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800'
                      : assessment.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assessment.difficulty}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{assessment.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Award size={14} />
                    <span>{assessment.questions.length} questions</span>
                  </div>
                  {assessment.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{assessment.duration} min</span>
                    </div>
                  )}
                </div>

                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2">
                  <Play size={16} />
                  <span>Start Assessment</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Skills</h3>
                <p className="text-gray-600 text-sm">
                  Programming languages, frameworks, system design, algorithms, and data structures.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Behavioral Interviews</h3>
                <p className="text-gray-600 text-sm">
                  Situational questions, teamwork, leadership, and problem-solving scenarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}