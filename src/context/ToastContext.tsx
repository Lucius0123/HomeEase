import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(toast => {
          let icon = <Info size={18} className="text-info" />;
          let bgStyle = 'border-l-4 border-info';
          if (toast.type === 'success') {
            icon = <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />;
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />;
          } else if (toast.type === 'error') {
            icon = <AlertCircle size={18} style={{ color: 'var(--danger)' }} />;
          }

          return (
            <div
              key={toast.id}
              className="toast glass"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${
                  toast.type === 'success' ? 'var(--success)' :
                  toast.type === 'warning' ? 'var(--warning)' :
                  toast.type === 'error' ? 'var(--danger)' : 'var(--primary)'
                }`
              }}
            >
              <div style={{ flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{toast.title}</div>
                {toast.message && (
                  <div style={{ fontSize: '13px', color: 'var(--ink-2)', marginTop: 2 }}>{toast.message}</div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-3)',
                  padding: 4
                }}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
