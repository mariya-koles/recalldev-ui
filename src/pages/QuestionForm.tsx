import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Question, Tag, CreateQuestionRequest, DifficultyLevel } from '../types';
import { apiService } from '../services/api';
import { Save, ArrowLeft, X, Plus } from 'lucide-react';

const QuestionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateQuestionRequest>({
    questionText: '',
    questionAnswer: '',
    difficulty: 'MEDIUM',
  });
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
    if (isEditing && id) {
      loadQuestion(parseInt(id));
    }
  }, [isEditing, id]);

  const loadTags = async () => {
    try {
      const tags = await apiService.getTags();
      setAvailableTags(tags);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const loadQuestion = async (questionId: number) => {
    try {
      const question = await apiService.getQuestion(questionId, true);
      setFormData({
        questionText: question.questionText,
        questionAnswer: question.questionAnswer,
        difficulty: question.difficulty,
      });
      setSelectedTags(question.tags?.map(tag => tag.name) || []);
    } catch (err) {
      setError('Failed to load question');
      console.error('Error loading question:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText.trim() || !formData.questionAnswer.trim()) {
      setError('Question text and answer are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let question: Question;
      if (isEditing && id) {
        question = await apiService.updateQuestion(parseInt(id), formData);
      } else {
        question = await apiService.createQuestion(formData);
      }

      // Update tags if any are selected
      if (selectedTags.length > 0) {
        await apiService.setQuestionTags(question.id, selectedTags);
      }

      navigate('/');
    } catch (err) {
      setError(isEditing ? 'Failed to update question' : 'Failed to create question');
      console.error('Error saving question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      // Check if tag already exists
      const existingTag = availableTags.find(tag => 
        tag.name.toLowerCase() === newTagName.toLowerCase()
      );

      if (existingTag) {
        if (!selectedTags.includes(existingTag.name)) {
          setSelectedTags([...selectedTags, existingTag.name]);
        }
      } else {
        // Create new tag
        const newTag = await apiService.createTag({ name: newTagName });
        setAvailableTags([...availableTags, newTag]);
        setSelectedTags([...selectedTags, newTag.name]);
      }

      setNewTagName('');
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(name => name !== tagName));
  };

  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Question' : 'Create New Question'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card">
          <div className="space-y-6">
            <div>
              <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                id="questionText"
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                className="input-field h-32 resize-vertical"
                placeholder="Enter your interview question..."
                required
              />
            </div>

            <div>
              <label htmlFor="questionAnswer" className="block text-sm font-medium text-gray-700 mb-2">
                Answer *
              </label>
              <textarea
                id="questionAnswer"
                value={formData.questionAnswer}
                onChange={(e) => setFormData({ ...formData, questionAnswer: e.target.value })}
                className="input-field h-40 resize-vertical"
                placeholder="Enter the detailed answer..."
                required
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
                className="input-field w-auto"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
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
                        type="button"
                        onClick={() => handleRemoveTag(tagName)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add New Tag */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Add a new tag..."
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary inline-flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Available Tags */}
              {availableTags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Or select from existing tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags
                      .filter(tag => !selectedTags.includes(tag.name))
                      .map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagSelect(tag.name)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {tag.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (isEditing ? 'Update Question' : 'Create Question')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm; 