import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main data-easytag="id1-react/src/pages/NotFoundPage.jsx" className="min-h-[60vh] max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 data-easytag="id2-react/src/pages/NotFoundPage.jsx" className="text-3xl font-semibold text-gray-900 mb-3">Страница не найдена</h1>
      <p data-easytag="id3-react/src/pages/NotFoundPage.jsx" className="text-gray-600 mb-6">Кажется, такой страницы не существует.</p>
      <Link data-easytag="id4-react/src/pages/NotFoundPage.jsx" to="/" className="inline-block px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">На главную</Link>
    </main>
  );
}

export default NotFoundPage;
