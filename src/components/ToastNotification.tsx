import React from 'react';
import { ToastNotice } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  toasts: ToastNotice[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          let bgClass = 'bg-slate-900 text-white border-slate-700';
          let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-900/95 text-emerald-50 border-emerald-700';
            icon = <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
          } else if (toast.type === 'error') {
            bgClass = 'bg-rose-900/95 text-rose-50 border-rose-700';
            icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-900/95 text-amber-50 border-amber-700';
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${bgClass}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
                <p className="text-xs mt-1 text-slate-200 opacity-90 leading-normal">{toast.message}</p>
                <span className="text-[10px] text-slate-400 block mt-1.5">{toast.timestamp}</span>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
