import { createContext, useContext, useCallback, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);

    // Auto remove
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-sm font-medium flex items-center justify-between transition-transform transform-gpu toast-in ${
              t.type === "success"
                ? "bg-green-500 text-white"
                : t.type === "error"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-white"
            }`}
            role="status"
          >
            <span>{t.message}</span>
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