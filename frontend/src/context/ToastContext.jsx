import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

const addToast = (message, type) => {
  // Prevent duplicate toast
  const exists = toasts.some(t => t.message === message && t.type === type);
  if (exists) return;

  const id = Date.now();
  setToasts(prev => [...prev, { id, message, type }]);

  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, 3000);
};


  const success = (msg, id) => addToast(msg, 'success', id);
  const error = (msg, id) => addToast(msg, 'error', id);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`
              animate-fadeIn shadow-lg rounded-xl px-4 py-3 min-w-[240px] flex items-center gap-3 backdrop-blur-md border border-white/10
              ${t.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}
            `}
          >
            <i className={`fa-solid ${t.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span className="font-medium text-sm">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
