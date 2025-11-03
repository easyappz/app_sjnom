import React from 'react';
import { toggleLike } from '../api/comments';
import { useAuth } from '../index';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return String(iso || '');
  }
}

function CommentItem({ comment, onLikeChanged }) {
  const auth = useAuth();
  const [localLikes, setLocalLikes] = React.useState(comment.likes_count || 0);
  const [busy, setBusy] = React.useState(false);
  const [hint, setHint] = React.useState('');

  React.useEffect(() => {
    setLocalLikes(comment.likes_count || 0);
  }, [comment.likes_count]);

  const handleLike = async () => {
    if (!auth.user) {
      setHint('Чтобы поставить лайк, войдите или зарегистрируйтесь');
      return;
    }
    setHint('');
    setBusy(true);
    try {
      const res = await toggleLike({ commentId: comment.id });
      setLocalLikes(res.likes_count);
      if (onLikeChanged) onLikeChanged(comment.id, res);
    } catch (e) {
      setHint('Не удалось изменить лайк');
    } finally {
      setBusy(false);
    }
  };

  return (
    <li data-easytag="id1-react/src/components/CommentItem.jsx" className="flex flex-col gap-1 border-b border-gray-200 pb-4">
      <div data-easytag="id2-react/src/components/CommentItem.jsx" className="flex items-center justify-between">
        <div data-easytag="id3-react/src/components/CommentItem.jsx" className="text-sm text-gray-700">
          <span data-easytag="id4-react/src/components/CommentItem.jsx" className="font-medium">{comment.user?.username}</span>
          <span data-easytag="id5-react/src/components/CommentItem.jsx" className="text-gray-400"> · {formatDate(comment.created_at)}</span>
        </div>
        <div data-easytag="id6-react/src/components/CommentItem.jsx" className="flex items-center gap-2">
          <button
            data-easytag="id7-react/src/components/CommentItem.jsx"
            onClick={handleLike}
            disabled={busy}
            className="px-2 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            ❤ Лайк
          </button>
          <span data-easytag="id8-react/src/components/CommentItem.jsx" className="text-sm text-gray-600">{localLikes}</span>
        </div>
      </div>
      <p data-easytag="id9-react/src/components/CommentItem.jsx" className="text-gray-800 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
      {hint ? <span data-easytag="id10-react/src/components/CommentItem.jsx" className="text-xs text-gray-500">{hint}</span> : null}
    </li>
  );
}

export default CommentItem;
