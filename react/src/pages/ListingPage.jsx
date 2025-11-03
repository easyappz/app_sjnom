import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing } from '../api/listings';
import { getComments } from '../api/comments';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';

function ListingPage() {
  const { id } = useParams();
  const [listing, setListing] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [ordering, setOrdering] = React.useState('-likes');
  const [commentsError, setCommentsError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getListing({ id });
        if (isMounted) setListing(data);
      } catch (e) {
        if (isMounted) setError('Объявление не найдено');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const loadComments = React.useCallback(async () => {
    setCommentsError('');
    try {
      const data = await getComments({ listingId: id, ordering });
      setComments(data?.results || []);
    } catch (e) {
      setCommentsError('Не удалось загрузить комментарии');
    }
  }, [id, ordering]);

  React.useEffect(() => {
    if (!id) return;
    loadComments();
  }, [id, ordering, loadComments]);

  return (
    <main data-easytag="id1-react/src/pages/ListingPage.jsx" className="max-w-4xl mx-auto px-4 py-8">
      {loading ? (
        <p data-easytag="id2-react/src/pages/ListingPage.jsx" className="text-gray-600">Загрузка...</p>
      ) : error ? (
        <div data-easytag="id3-react/src/pages/ListingPage.jsx" className="text-center">
          <p data-easytag="id4-react/src/pages/ListingPage.jsx" className="text-gray-700 mb-4">{error}</p>
          <Link data-easytag="id5-react/src/pages/ListingPage.jsx" className="text-gray-900 underline" to="/">На главную</Link>
        </div>
      ) : listing ? (
        <div data-easytag="id6-react/src/pages/ListingPage.jsx" className="flex flex-col gap-6">
          <section data-easytag="id7-react/src/pages/ListingPage.jsx">
            <h1 data-easytag="id8-react/src/pages/ListingPage.jsx" className="text-2xl font-semibold text-gray-900">{listing.title || 'Без названия'}</h1>
            <p data-easytag="id9-react/src/pages/ListingPage.jsx" className="text-sm text-gray-500 mt-1">Просмотры: {listing.view_count}</p>
            <div data-easytag="id10-react/src/pages/ListingPage.jsx" className="mt-4 bg-gray-100 aspect-[16/9] w-full flex items-center justify-center rounded-soft overflow-hidden">
              {listing.image_url ? (
                <img data-easytag="id11-react/src/pages/ListingPage.jsx" src={listing.image_url} alt={listing.title || 'Объявление'} className="h-full w-full object-cover" />
              ) : (
                <div data-easytag="id12-react/src/pages/ListingPage.jsx" className="text-gray-400 text-sm">Здесь будет изображение</div>
              )}
            </div>
          </section>

          <section data-easytag="id13-react/src/pages/ListingPage.jsx">
            <div data-easytag="id14-react/src/pages/ListingPage.jsx" className="flex items-center justify-between mb-3">
              <h2 data-easytag="id15-react/src/pages/ListingPage.jsx" className="text-lg font-medium text-gray-900">Комментарии</h2>
              <div data-easytag="id16-react/src/pages/ListingPage.jsx" className="flex items-center gap-2">
                <label data-easytag="id17-react/src/pages/ListingPage.jsx" className="text-sm text-gray-700">Сортировка</label>
                <select
                  data-easytag="id18-react/src/pages/ListingPage.jsx"
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                >
                  <option data-easytag="id19-react/src/pages/ListingPage.jsx" value="-likes">Сначала популярные</option>
                  <option data-easytag="id20-react/src/pages/ListingPage.jsx" value="-created_at">Сначала новые</option>
                  <option data-easytag="id21-react/src/pages/ListingPage.jsx" value="created_at">Сначала старые</option>
                </select>
              </div>
            </div>

            {commentsError ? (
              <p data-easytag="id22-react/src/pages/ListingPage.jsx" className="text-sm text-red-600 mb-2">{commentsError}</p>
            ) : null}

            <ul data-easytag="id23-react/src/pages/ListingPage.jsx" className="flex flex-col gap-4">
              {comments.map((c) => (
                <CommentItem data-easytag="id24-react/src/pages/ListingPage.jsx" key={c.id} comment={c} onLikeChanged={() => {}} />
              ))}
            </ul>

            <CommentForm data-easytag="id25-react/src/pages/ListingPage.jsx" listingId={id} onSubmitted={() => {}} />
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default ListingPage;
