import React from 'react';
import { createComment } from '../api/comments';
import { useAuth } from '../index';

function CommentForm({ listingId, onSubmitted }) {
  const auth = useAuth();
  const [text, setText] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.user) {
      setMessage('Войдите, чтобы оставить комментарий');
      return;
    }
    if (!text.trim()) {
      setError('Введите текст комментария');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await createComment({ listingId, text: text.trim() });
      setText('');
      setMessage('Комментарий отправлен на модерацию');
      if (onSubmitted) onSubmitted();
    } catch (e) {
      setError('Не удалось отправить комментарий');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form data-easytag="id1-react/src/components/CommentForm.jsx" onSubmit={handleSubmit} className="mt-4">
      <label data-easytag="id2-react/src/components/CommentForm.jsx" className="block text-sm text-gray-700 mb-2">Ваш комментарий</label>
      <textarea
        data-easytag="id3-react/src/components/CommentForm.jsx"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={auth.user ? 'Напишите, что вы думаете об объявлении...' : 'Войдите, чтобы комментировать'}
        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
        disabled={!auth.user || busy}
      />
      <div data-easytag="id4-react/src/components/CommentForm.jsx" className="flex items-center justify-between mt-2">
        <button data-easytag="id5-react/src/components/CommentForm.jsx" type="submit" disabled={!auth.user || busy} className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-60">Отправить</button>
        <div data-easytag="id6-react/src/components/CommentForm.jsx" className="text-xs">
          {error ? <span data-easytag="id7-react/src/components/CommentForm.jsx" className="text-red-600">{error}</span> : null}
          {message ? <span data-easytag="id8-react/src/components/CommentForm.jsx" className="text-gray-600">{message}</span> : null}
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
