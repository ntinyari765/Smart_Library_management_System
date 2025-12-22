import { createContext, useContext, useCallback, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type, hiding: false }]);

    // schedule hide animation slightly before removal
    const hideDelay = Math.max(200, duration - 250);
    setTimeout(() => {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, hiding: true } : x)));
    }, hideDelay);

    // Remove after full duration
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    // play hide animation then remove
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, hiding: true } : x)));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 220);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-sm font-medium flex items-center justify-between transition-transform transform-gpu ${
              (t.hiding ? 'toast-out' : 'toast-in') + ' '
            }${
              t.type === "success"
                ? "bg-green-500 text-white"
                : t.type === "error"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-white"
            }`}
            role="status"
          >
            <div className="flex items-center">
              <span className="toast-icon" aria-hidden>
                {t.type === 'success' ? (
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : t.type === 'error' ? (
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16.5" r=".5" fill="currentColor"/></svg>
                )}
              </span>
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 opacity-90 hover:opacity-100"
              aria-label="dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastContext;