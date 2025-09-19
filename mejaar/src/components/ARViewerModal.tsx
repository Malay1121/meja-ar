import React, { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';

interface ARViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelSrc: string;
  itemName: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const ARViewerModal: React.FC<ARViewerModalProps> = ({ isOpen, onClose, modelSrc, itemName }) => {
  const [isModelLoading, setIsModelLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset loading state when modal opens
      setIsModelLoading(true);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, modelSrc, itemName]);

  const handleModelLoad = () => {
    console.log('Model loaded successfully');
    setIsModelLoading(false);
  };

  const handleModelError = (e: any) => {
    console.log('Model loading error:', e);
    setIsModelLoading(false);
    
    // Fallback to default model if current model fails to load
    const modelViewer = e.target;
    if (modelViewer.src !== 'https://modelviewer.dev/shared-assets/models/Astronaut.glb') {
      console.log('Falling back to default model');
      setIsModelLoading(true);
      modelViewer.src = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
    }
  };

  // Add a timeout fallback to stop infinite loading
  useEffect(() => {
    if (isOpen && isModelLoading) {
      const timeout = setTimeout(() => {
        console.log('Model loading timeout - stopping loader');
        setIsModelLoading(  false);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isOpen, isModelLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
      
      {/* Modal - Much larger on mobile */}
      <div className="relative bg-white rounded-lg sm:rounded-2xl shadow-modal w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-hidden flex flex-col">
        {/* Header - Compact on mobile */}
        <div className="flex items-center justify-between p-3 sm:p-6 bg-gradient-to-r from-primary-600 to-accent-600 text-white flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1 truncate">{itemName}</h2>
            <p className="text-xs sm:text-sm opacity-80 hidden sm:block">
              Powered by MejaAR - Look for the AR button to view in your space
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors ml-2 flex-shrink-0"
            aria-label="Close AR viewer"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* 3D Model Viewer - Full height on mobile */}
        <div className="relative flex-1 bg-neutral-50 min-h-0 overflow-hidden" style={{ minHeight: '400px' }}>
          {/* Fallback image while model loads */}
          {!modelSrc && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center p-4 sm:p-8">
                <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🍽️</div>
                <p className="text-sm sm:text-base text-neutral-600">No 3D model available for this item</p>
              </div>
            </div>
          )}
          
          {modelSrc && (
            <>
              {/* Loading overlay */}
              {isModelLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 z-20">
                  <div className="text-center">
                    <Loader className="animate-spin h-8 w-8 text-red-500 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 font-medium">Loading 3D model...</p>
                    <p className="text-xs text-neutral-500 mt-1">Preparing AR experience</p>
                  </div>
                </div>
              )}
              
              <model-viewer
                src={modelSrc || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
                alt={`3D model of ${itemName}`}
                poster="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center"
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="fixed"
                ar-placement="floor"
                camera-controls
                auto-rotate
                auto-rotate-delay="0"
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1"
                tone-mapping="neutral"
                interaction-policy="always-allow"
                touch-action="pan-y"
                loading="eager"
                reveal="auto"
                disable-zoom
                ref={(el: any) => {
                  if (el) {
                    // Remove existing listeners
                    el.removeEventListener('load', handleModelLoad);
                    el.removeEventListener('error', handleModelError);
                    
                    // Add new listeners
                    el.addEventListener('load', handleModelLoad);
                    el.addEventListener('error', handleModelError);
                    
                    // Also listen for model-ready event which is more reliable
                    el.addEventListener('model-ready', () => {
                      console.log('Model ready event fired');
                      setIsModelLoading(false);
                    });
                  }
                }}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  minHeight: '400px',
                  backgroundColor: '#f5f5f5',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  border: 'none',
                  outline: 'none'
                }}
              >
                {/* Remove default progress bar */}
                <div slot="progress-bar" style={{ display: 'none' }}></div>
              </model-viewer>
              
              {/* Custom AR Button */}
              <button
                className="ar-button-custom absolute bottom-20 sm:bottom-24 right-4 sm:right-6 z-30 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                onClick={() => {
                  const modelViewer = document.querySelector('model-viewer');
                  if (modelViewer && (modelViewer as any).activateAR) {
                    (modelViewer as any).activateAR();
                  }
                }}
                aria-label="View in Augmented Reality"
              >
                <span className="text-lg sm:text-xl">📱</span>
                <span className="text-sm sm:text-base font-bold">View AR</span>
              </button>
            </>
          )}
          
          {/* Instructions overlay - Better positioning and layering */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-2 sm:p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-t-lg sm:rounded-lg p-3 sm:p-4 shadow-lg border-t sm:border border-neutral-200">
              <div className="flex items-start space-x-2 sm:space-x-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 sm:mb-2">How to use MejaAR:</h3>
                  <ul className="text-xs text-neutral-700 space-y-0.5 sm:space-y-1">
                    <li>• Drag to rotate • Pinch to zoom</li>
                    <li className="font-bold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded text-xs">• Tap AR button to place in real space</li>
                    <li className="text-xs text-neutral-500">*Requires compatible mobile device</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARViewerModal;
