import { useContext } from 'react';
import { ToastContext } from './context';
import { ToastType } from '@/shared/ui/molecules/Toast';

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, toasts } = context;

  const toast = (message: string, type: ToastType = 'info', duration = 3000): string => {
    return addToast({ message, type, duration });
  };

  return {
    toast,
    success: (message: string, duration?: number) => toast(message, 'success', duration),
    error: (message: string, duration?: number) => toast(message, 'error', duration),
    warning: (message: string, duration?: number) => toast(message, 'warning', duration),
    info: (message: string, duration?: number) => toast(message, 'info', duration),
    removeToast,
    toasts,
  };
}
