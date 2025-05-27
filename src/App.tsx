import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Questions from './pages/Questions';
import QuestionForm from './pages/QuestionForm';
import Search from './pages/Search';
import Tags from './pages/Tags';
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
