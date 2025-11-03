import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopListings, resolveListing } from '../api/listings';

function HomePage() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [resolving, setResolving] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getTopListings({ limit: 20, offset: 0, ordering: '-view_count' });
        if (isMounted) setItems(data?.results || []);
      } catch (e) {
        if (isMounted) setError('Не удалось загрузить объявления');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const onOpen = async (e) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) {
      setError('Вставьте ссылку на объявление Авито');
      return;
    }
    setResolving(true);
    try {
      const data = await resolveListing({ url: url.trim() });
      if (data?.id) {
        navigate(`/listing/${data.id}`);
      } else {
        setError('Не удалось определить объявление');
      }
    } catch (e) {
      setError('Не удалось открыть объявление');
    } finally {
      setResolving(false);
    }
  };

  return (
    <main data-easytag="id1-react/src/pages/HomePage.jsx" className="max-w-6xl mx-auto px-4 py-8">
      <section data-easytag="id2-react/src/pages/HomePage.jsx" className="mb-8">
        <h1 data-easytag="id3-react/src/pages/HomePage.jsx" className="text-2xl font-semibold text-gray-900 mb-3">Самые просматриваемые объявления</h1>
        <form data-easytag="id4-react/src/pages/HomePage.jsx" onSubmit={onOpen} className="flex flex-col sm:flex-row gap-2">
          <input
            data-easytag="id5-react/src/pages/HomePage.jsx"
            type="url"
            placeholder="Вставьте ссылку на объявление Авито"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
          <button data-easytag="id6-react/src/pages/HomePage.jsx" type="submit" disabled={resolving} className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60">Открыть</button>
        </form>
        {error ? <p data-easytag="id7-react/src/pages/HomePage.jsx" className="text-sm text-red-600 mt-2">{error}</p> : null}
      </section>

      <section data-easytag="id8-react/src/pages/HomePage.jsx">
        {loading ? (
          <p data-easytag="id9-react/src/pages/HomePage.jsx" className="text-gray-600">Загрузка...</p>
        ) : (
          <ul data-easytag="id10-react/src/pages/HomePage.jsx" className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li data-easytag="id11-react/src/pages/HomePage.jsx" key={item.id} className="border border-gray-200 rounded-soft overflow-hidden hover:shadow-subtle transition">
                <a data-easytag="id12-react/src/pages/HomePage.jsx" href={`/listing/${item.id}`} className="block">
                  <div data-easytag="id13-react/src/pages/HomePage.jsx" className="bg-gray-100 aspect-[16/9] w-full flex items-center justify-center">
                    {item.image_url ? (
                      <img data-easytag="id14-react/src/pages/HomePage.jsx" src={item.image_url} alt={item.title || 'Объявление'} className="h-full w-full object-cover" />
                    ) : (
                      <div data-easytag="id15-react/src/pages/HomePage.jsx" className="text-gray-400 text-sm">Изображение недоступно</div>
                    )}
                  </div>
                  <div data-easytag="id16-react/src/pages/HomePage.jsx" className="p-3">
                    <h2 data-easytag="id17-react/src/pages/HomePage.jsx" className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">{item.title || 'Без названия'}</h2>
                    <p data-easytag="id18-react/src/pages/HomePage.jsx" className="text-xs text-gray-500 mt-2">Просмотры: {item.view_count}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default HomePage;
