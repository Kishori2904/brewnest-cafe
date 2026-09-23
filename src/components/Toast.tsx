import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div
      className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
      role="alert"
    >
      {getIcon()}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-xs font-bold text-stone-900 leading-tight">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
