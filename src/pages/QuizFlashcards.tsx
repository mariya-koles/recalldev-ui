import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Question } from '../types';

const QuizFlashcards: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions: Question[] = location.state?.questions || [];
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">No questions found for selected tags.</h2>
        <button className="btn-primary" onClick={() => navigate('/quiz')}>Back to Quiz Start</button>
      </div>
    );
  }

  const question = questions[current];

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow text-center">
      <div className="mb-4 text-gray-500">Question {current + 1} of {questions.length}</div>
      <div className="text-lg font-semibold mb-6">{question.questionText}</div>
      {showAnswer ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
          <span className="font-bold">Answer:</span> <span className="text-gray-700 whitespace-pre-wrap">{question.questionAnswer}</span>
        </div>
      ) : (
        <button className="btn-secondary mb-6" onClick={() => setShowAnswer(true)}>Show Answer</button>
      )}
      <div className="flex justify-between">
        <button
          className="btn-secondary"
          onClick={() => { setCurrent((c) => c - 1); setShowAnswer(false); }}
          disabled={current === 0}
        >
          Previous
        </button>
        <button
          className="btn-secondary"
          onClick={() => { setCurrent((c) => c + 1); setShowAnswer(false); }}
          disabled={current === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizFlashcards; 