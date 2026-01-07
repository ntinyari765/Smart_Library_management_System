import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Layout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminBorrowHistory() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [errorHistory, setErrorHistory] = useState(null);
  const [errorCurrent, setErrorCurrent] = useState(null);
  const { showToast } = useToast();

  const { user, loading: authLoading } = useAuth();

  const fetchHistory = async () => {
    setLoadingHistory(true);
    setErrorHistory(null);
    try {
      const res = await API.get('/books/borrow-history');
      console.debug('borrow-history response:', res); // log full response for debugging
      setHistory(res.data || []);
    } catch (err) {
      console.error('Error fetching borrow history:', err);
      const status = err.response?.status;
      const data = err.response?.data;
      const msg = data?.message || data || 'Error fetching borrow history';
      setErrorHistory(`${status || ''} ${msg}`);
      showToast(`${status || ''} ${msg}`, 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchCurrent = async () => {
    setLoadingCurrent(true);
    setErrorCurrent(null);
    try {
      const res = await API.get('/books/current-borrows');
      console.debug('current-borrows response:', res);
      setCurrent(res.data || []);
    } catch (err) {
      console.error('Error fetching current borrows:', err);
      const status = err.response?.status;
      const data = err.response?.data;
      const msg = data?.message || data || 'Error fetching current borrows';
      setErrorCurrent(`${status || ''} ${msg}`);
      showToast(`${status || ''} ${msg}`, 'error');
    } finally {
      setLoadingCurrent(false);
    }
  };

  useEffect(() => {
    // Only fetch when we know the auth state and it's an admin
    if (!authLoading && user?.isAdmin) {
      fetchHistory();
      fetchCurrent();
    }
  }, [authLoading, user]);
  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Borrow History</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchCurrent(); fetchHistory(); }}
              className="px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* CURRENTLY BORROWED */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Currently Borrowed</h2>

          {loadingCurrent ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : errorCurrent ? (
            <p className="text-sm text-red-500">{errorCurrent}</p>
          ) : current.length === 0 ? (
            <p className="text-sm text-gray-500">No books are currently borrowed.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {current.map((b) => (
                <div key={b._id} className="p-4 border rounded bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{b.title}</div>
                      <div className="text-sm text-gray-600">by {b.author}</div>
                      <div className="text-xs text-gray-500 mt-2">Borrowed at: {b.borrowedAt ? new Date(b.borrowedAt).toLocaleString() : '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{b.borrowedBy?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{b.borrowedBy?.email || '—'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FULL HISTORY */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Full Borrow History</h2>

          {loadingHistory ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : errorHistory ? (
            <p className="text-sm text-red-500">{errorHistory}</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500">No borrow history yet.</p>
          ) : (
            <div className="space-y-6">
              {history.map((b) => (
                <div key={b._id} className="p-4 border rounded bg-white">
                  <h3 className="font-semibold">{b.title}</h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    {b.borrowHistory && b.borrowHistory.length > 0 ? (
                      b.borrowHistory.map((h, i) => (
                        <div key={i} className="p-2 border rounded">
                          <div className="text-sm font-medium">{h.user?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">Borrowed: {new Date(h.borrowedAt).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Returned: {h.returnedAt ? new Date(h.returnedAt).toLocaleString() : '—'}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 col-span-full">No history for this book.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}