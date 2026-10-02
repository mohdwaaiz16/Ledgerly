import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-in slide-in-from-bottom-2">
      <button 
        onClick={close}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
          <RefreshCw className="w-5 h-5 text-dark" />
        </div>
        
        <div className="flex-1 pr-4">
          <h4 className="text-sm font-bold text-dark">Update Available</h4>
          <p className="mt-1 text-xs text-gray-600 mb-3">
            A new version of Ledgerly is available. Update now to get the latest features.
          </p>
          <button 
            onClick={() => updateServiceWorker(true)}
            className="w-full btn-primary py-1.5 text-xs flex justify-center"
          >
            Update & Reload
          </button>
        </div>
      </div>
    </div>
  );
};
