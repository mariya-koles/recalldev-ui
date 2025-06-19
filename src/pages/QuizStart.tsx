import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Tag, Question } from '../types';

const QuizStart: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await apiService.getTags();
        setTags(tags);
      } catch (err) {
        setError('Failed to load tags');
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, []);

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const startQuiz = async () => {
    setFetchingQuestions(true);
    setError(null);
    try {
      const questions: Question[] = await apiService.getQuestionsByTags(selectedTags);
      // Randomize questions
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      navigate('/quiz/flashcards', { state: { questions: shuffled } });
    } catch (err) {
      setError('Failed to fetch questions for selected tags');
    } finally {
      setFetchingQuestions(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Start a Quiz</h1>
      <p className="mb-4">Select tags to begin your quiz.</p>
      {loading ? (
        <div className="text-center py-8">Loading tags...</div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag.name)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            disabled={selectedTags.length === 0 || fetchingQuestions}
            onClick={startQuiz}
          >
            {fetchingQuestions ? 'Loading...' : 'Start Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizStart; 