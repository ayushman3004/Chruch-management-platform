import { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
    const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
    const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);
    const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);

    const confirm = useCallback((message) => {
        return new Promise((resolve) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type: 'confirm', resolve }]);
        });
    }, []);

    return (
        <ToastContext.Provider value={{ success, error, info, warning, confirm }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { id, message, type, resolve } = toast;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FiCheckCircle className="text-emerald-400" size={20} />;
            case 'error':
                return <FiAlertCircle className="text-rose-400" size={20} />;
            case 'warning':
                return <FiAlertCircle className="text-amber-400" size={20} />;
            case 'info':
                return <FiInfo className="text-blue-400" size={20} />;
            default:
                return <FiInfo className="text-blue-400" size={20} />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'error':
                return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
            case 'warning':
                return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'info':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'confirm':
                return 'bg-slate-900/95 border-white/10 text-white';
            default:
                return 'bg-slate-900/95 border-white/10 text-white';
        }
    };

    const handleConfirm = (value) => {
        if (resolve) {
            resolve(value);
        }
        onClose();
    };

    if (type === 'confirm') {
        return (
            <div className={`pointer-events-auto backdrop-blur-xl border rounded-xl p-4 shadow-2xl animate-slide-in-right min-w-[320px] ${getStyles()}`}>
                <div className="flex items-start gap-3 mb-4">
                    <FiAlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-medium flex-1">{message}</p>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => handleConfirm(false)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleConfirm(true)}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-sm font-medium text-white transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`pointer-events-auto backdrop-blur-xl border rounded-xl p-4 shadow-2xl animate-slide-in-right min-w-[320px] max-w-md ${getStyles()}`}>
            <div className="flex items-start gap-3">
                {getIcon()}
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                >
                    <FiX size={18} />
                </button>
            </div>
        </div>
    );
};
