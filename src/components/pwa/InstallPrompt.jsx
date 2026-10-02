import React, { useEffect, useState } from 'react';
import { X, Share, Download } from 'lucide-react';

export const InstallPrompt = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('ledgerly_install_dismissed');
    if (dismissed === 'true') return;

    // Detect iOS
    const isIosDevice = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      setShowPrompt(true);
    }

    // Android/Desktop install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('ledgerly_install_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-dark" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-bold text-dark">Install Ledgerly</h4>
          
          {isIOS ? (
            <div className="mt-1 text-xs text-gray-600 space-y-1">
              <p>1. Tap the <Share className="w-3 h-3 inline mx-1" /> button below.</p>
              <p>2. Select "Add to Home Screen".</p>
              <p>3. Tap "Add".</p>
            </div>
          ) : (
            <>
              <p className="mt-1 text-xs text-gray-600 mb-3">Install for quick access and a better experience.</p>
              <button 
                onClick={handleInstall}
                className="w-full btn-primary py-1.5 text-xs flex justify-center"
              >
                Install App
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
