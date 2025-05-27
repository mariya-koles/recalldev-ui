import React, { useState } from 'react';
import { Question, DIFFICULTY_COLORS } from '../types';
import { Edit, Trash2, Eye, EyeOff, Tag } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onEdit, onDelete }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(question.id);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                DIFFICULTY_COLORS[question.difficulty]
              }`}
            >
              {question.difficulty}
            </span>
            {question.tags && question.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-gray-400" />
                <div className="flex gap-1">
                  {question.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            {question.questionText}
          </h3>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(question)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit question"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-3"
        >
          {showAnswer ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Answer
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Answer
            </>
          )}
        </button>

        {showAnswer && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {question.questionAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard; 