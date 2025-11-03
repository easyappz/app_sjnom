import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div data-easytag="id1-react/src/App.js" className="min-h-screen bg-white text-gray-900">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage data-easytag="id2-react/src/App.js" />} />
            <Route path="/listing/:id" element={<ListingPage data-easytag="id3-react/src/App.js" />} />
            <Route path="/404" element={<NotFoundPage data-easytag="id4-react/src/App.js" />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
