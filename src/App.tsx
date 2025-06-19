import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Questions from './pages/Questions';
import QuestionForm from './pages/QuestionForm';
import Search from './pages/Search';
import Tags from './pages/Tags';
import QuizStart from './pages/QuizStart';
import QuizFlashcards from './pages/QuizFlashcards';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Questions />} />
          <Route path="/questions/new" element={<QuestionForm />} />
          <Route path="/questions/:id/edit" element={<QuestionForm />} />
          <Route path="/search" element={<Search />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/quiz" element={<QuizStart />} />
          <Route path="/quiz/flashcards" element={<QuizFlashcards />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
