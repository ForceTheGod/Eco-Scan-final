
import React, { useState, useEffect } from 'react';
import { AppMode, ModelStatus, Prediction } from './types';
import { loadModel } from './services/mlService';
import Header from './components/Header';
import CameraCapture from './components/CameraCapture';
import ImageUploader from './components/ImageUploader';
import PredictionDisplay from './components/PredictionDisplay';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('CAMERA');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus>({
    loaded: false,
    loading: true,
    error: null,
    progress: 0
  });

  useEffect(() => {
    const initModel = async () => {
      try {
        // Simulate progress for smoother UX since mobilenet.load is opaque
        const interval = setInterval(() => {
          setModelStatus(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 5, 90)
          }));
        }, 150);

        await loadModel();
        
        clearInterval(interval);
        setModelStatus({
          loaded: true,
          loading: false,
          error: null,
          progress: 100
        });
      } catch (err) {
        console.error("Model load failed:", err);
        setModelStatus({
          loaded: false,
          loading: false,
          error: "Failed to load model. Check your internet connection.",
          progress: 0
        });
      }
    };

    initModel();
  }, []);

  if (modelStatus.loading) {
    return <LoadingScreen progress={modelStatus.progress} />;
  }

  return (
    <div className="min-h-screen pb-20 max-w-2xl mx-auto px-4">
      <Header />

      <main className="space-y-8">
        {/* Mode Toggle */}
        <div className="glass-morphism rounded-2xl p-1.5 flex gap-1">
          <button
            onClick={() => { setMode('CAMERA'); setPredictions([]); }}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              mode === 'CAMERA' 
              ? 'bg-green-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <i className="fas fa-camera"></i>
            Live Camera
          </button>
          <button
            onClick={() => { setMode('UPLOAD'); setPredictions([]); }}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              mode === 'UPLOAD' 
              ? 'bg-green-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <i className="fas fa-image"></i>
            Upload Image
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[300px]">
          {mode === 'CAMERA' ? (
            <CameraCapture 
              isActive={mode === 'CAMERA'} 
              onPredict={setPredictions} 
            />
          ) : (
            <ImageUploader 
              onPredict={setPredictions} 
              isLoading={!modelStatus.loaded}
            />
          )}

          <PredictionDisplay predictions={predictions} />
          
          {predictions.length === 0 && (
            <div className="text-center py-12 opacity-30 select-none">
              <i className="fas fa-magnifying-glass text-4xl mb-3 block"></i>
              <p className="font-medium text-slate-900">
                {mode === 'CAMERA' 
                  ? 'Point camera at waste item' 
                  : 'Upload an image to start'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Stats bar */}
      <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-medium tracking-wide">
        <p className="uppercase mb-2">System Status</p>
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            TF.JS Engine Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            MobileNet V2
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
