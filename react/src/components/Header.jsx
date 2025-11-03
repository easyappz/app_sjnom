import React from 'react';
import { useAuth } from '../index';

function Header() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const auth = useAuth();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await auth.login({ username, password });
      setUsername('');
      setPassword('');
    } catch (e) {
      setError(e?.response?.data?.detail || 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await auth.register({ username, password });
      setUsername('');
      setPassword('');
    } catch (e) {
      const details = e?.response?.data?.detail || e?.response?.data;
      setError(details?.username || details?.password || details || 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header data-easytag="id1-react/src/components/Header.jsx" className="w-full bg-white/80 backdrop-blur shadow-subtle sticky top-0 z-40">
      <div data-easytag="id2-react/src/components/Header.jsx" className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div data-easytag="id3-react/src/components/Header.jsx" className="flex items-center gap-3">
          <a data-easytag="id4-react/src/components/Header.jsx" href="/" className="text-xl font-semibold tracking-tight text-gray-900">Авитолог</a>
          <span data-easytag="id5-react/src/components/Header.jsx" className="text-xs text-gray-500 hidden sm:inline">сервис комментариев к объявлениям</span>
        </div>
        <div data-easytag="id6-react/src/components/Header.jsx" className="flex items-center gap-3">
          {auth.user ? (
            <div data-easytag="id7-react/src/components/Header.jsx" className="flex items-center gap-3">
              <span data-easytag="id8-react/src/components/Header.jsx" className="text-sm text-gray-700">Привет, <strong data-easytag="id9-react/src/components/Header.jsx" className="font-medium">{auth.user.username}</strong></span>
              <button data-easytag="id10-react/src/components/Header.jsx" onClick={auth.logout} className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800">Выйти</button>
            </div>
          ) : (
            <form data-easytag="id11-react/src/components/Header.jsx" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                data-easytag="id12-react/src/components/Header.jsx"
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
              <input
                data-easytag="id13-react/src/components/Header.jsx"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
              <button data-easytag="id14-react/src/components/Header.jsx" type="button" onClick={handleLogin} disabled={loading} className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-60">Войти</button>
              <button data-easytag="id15-react/src/components/Header.jsx" type="button" onClick={handleRegister} disabled={loading} className="px-3 py-1.5 rounded-md border border-gray-900 text-gray-900 text-sm hover:bg-gray-900 hover:text-white disabled:opacity-60">Зарегистрироваться</button>
              {error ? (
                <span data-easytag="id16-react/src/components/Header.jsx" className="text-xs text-red-600 ml-2">{String(error)}</span>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
