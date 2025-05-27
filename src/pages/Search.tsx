import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, Tag, DifficultyLevel } from '../types';
import { apiService } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { Search as SearchIcon, X } from 'lucide-react';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search filters
  const [keyword, setKeyword] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await apiService.getTags();
      setAllTags(tags);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim() && !selectedDifficulty && selectedTags.length === 0) {
      setError('Please enter a search keyword or select filters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      let results: Question[] = [];

      if (keyword.trim()) {
        // Search by keyword
        results = await apiService.searchQuestions(keyword);
      } else if (selectedTags.length > 0) {
        // Search by tags
        results = await apiService.getQuestionsByTags(selectedTags);
      } else if (selectedDifficulty) {
        // Search by difficulty
        results = await apiService.getQuestionsByDifficulty(selectedDifficulty);
      }

      // Apply additional filters
      if (selectedDifficulty && keyword.trim()) {
        results = results.filter(q => q.difficulty === selectedDifficulty);
      }

      if (selectedTags.length > 0 && keyword.trim()) {
        results = results.filter(q => 
          q.tags?.some(tag => selectedTags.includes(tag.name))
        );
      }

      setQuestions(results);
    } catch (err) {
      setError('Failed to search questions');
      console.error('Error searching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedDifficulty('');
    setSelectedTags([]);
    setQuestions([]);
    setHasSearched(false);
    setError(null);
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

  const addTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const removeTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(name => name !== tagName));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Questions</h1>

      {/* Search Form */}
      <div className="card mb-6">
        <div className="space-y-4">
          {/* Keyword Search */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
              Search by keyword
            </label>
            <div className="flex gap-2">
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search questions and answers..."
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn-primary inline-flex items-center"
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | '')}
                className="input-field w-auto"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(keyword || selectedDifficulty || selectedTags.length > 0) && (
              <button
                onClick={handleClearFilters}
                className="btn-secondary inline-flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </button>
            )}
          </div>

          {/* Tag Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by tags
            </label>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tagName) => (
                  <span
                    key={tagName}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tagName}
                    <button
                      onClick={() => removeTag(tagName)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Available Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags
                  .filter(tag => !selectedTags.includes(tag.name))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => addTag(tag.name)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <span className="text-sm text-gray-500">
              {questions.length} question{questions.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No questions found matching your search criteria.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {questions.map((question) => (
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
      )}

      {/* Initial State */}
      {!hasSearched && (
        <div className="text-center py-12">
          <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Enter a search term or select filters to find questions.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search; 