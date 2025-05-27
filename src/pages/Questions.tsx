import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../types';
import { apiService } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { Filter, Loader } from 'lucide-react';

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'ALL'>('ALL');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await apiService.getQuestions(true); // Include tags
      setQuestions(data);
    } catch (err) {
      setError('Failed to load questions');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question: Question) => {
    navigate(`/questions/${question.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      setError('Failed to delete question');
      console.error('Error deleting question:', err);
    }
  };

  const filteredQuestions = selectedDifficulty === 'ALL' 
    ? questions 
    : questions.filter(q => q.difficulty === selectedDifficulty);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={loadQuestions}
          className="mt-2 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'ALL')}
              className="input-field w-auto"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <span className="text-sm text-gray-500">
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {selectedDifficulty === 'ALL' 
              ? 'No questions found. Create your first question to get started!'
              : `No ${selectedDifficulty.toLowerCase()} questions found.`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions; 