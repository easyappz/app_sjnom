import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { login as apiLogin, register as apiRegister, me as apiMe } from './api/auth';

export const AuthContext = React.createContext({ user: null });
export const useAuth = () => React.useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');
    (async () => {
      if (token) {
        try {
          const data = await apiMe();
          if (isMounted) setUser(data);
        } catch (e) {
          localStorage.removeItem('token');
        }
      }
      if (isMounted) setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ username, password }) => {
    const res = await apiLogin({ username, password });
    const token = res?.token;
    if (token) localStorage.setItem('token', token);
    setUser(res?.user || null);
  };

  const register = async ({ username, password }) => {
    const res = await apiRegister({ username, password });
    const token = res?.token;
    if (token) localStorage.setItem('token', token);
    setUser(res?.user || null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, loading, login, register, logout };
  return (
    <AuthContext.Provider value={value}>
      <div data-easytag="id1-react/src/index.js" className="min-h-screen">{children}</div>
    </AuthContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

if (typeof window !== 'undefined') {
  const pages = ['/', '/listing/:id', '/404'];
  if (typeof window.handleRoutes === 'function') {
    try {
      window.handleRoutes(pages);
    } catch (e) {
      // noop
    }
  } else {
    // expose for potential later call
    window.__EASYAPPZ_ROUTES__ = pages;
  }
}

reportWebVitals();
