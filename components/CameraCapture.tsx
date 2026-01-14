
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { classifyImage } from '../services/mlService';
import { Prediction } from '../types';

interface CameraCaptureProps {
  onPredict: (predictions: Prediction[]) => void;
  isActive: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPredict, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access denied or not available. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    let interval: number;

    const runInference = async () => {
      if (videoRef.current && !isPaused && isActive && stream) {
        try {
          const results = await classifyImage(videoRef.current);
          onPredict(results);
        } catch (err) {
          console.error("Inference error:", err);
        }
      }
    };

    if (isActive && !isPaused) {
      interval = window.setInterval(runInference, 1000); // 1 FPS for balance of performance and UX
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, stream, onPredict]);

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
        <i className="fas fa-triangle-exclamation text-red-500 text-3xl mb-3"></i>
        <p className="text-red-700 font-medium">{error}</p>
        <button 
          onClick={startCamera}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${isPaused ? 'opacity-50' : 'opacity-100'}`}
      />
      
      {/* Overlay controls */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
        <div className="flex justify-between items-start">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${isPaused ? 'bg-amber-500/80 text-white' : 'bg-green-500/80 text-white animate-pulse'}`}>
            {isPaused ? 'Paused' : 'Live Scanning'}
          </span>
          <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/20 text-white pointer-events-auto">
            <i className="fas fa-expand text-sm opacity-80"></i>
          </div>
        </div>

        <div className="flex justify-center mb-4 pointer-events-auto">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all transform active:scale-95 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30'}`}
          >
            <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
            {isPaused ? 'Resume Scan' : 'Pause Scan'}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
