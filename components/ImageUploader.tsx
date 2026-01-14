
import React, { useState, useRef } from 'react';
import { classifyImage } from '../services/mlService';
import { Prediction } from '../types';

interface ImageUploaderProps {
  onPredict: (predictions: Prediction[]) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onPredict, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (imgRef.current) {
      setIsProcessing(true);
      try {
        const results = await classifyImage(imgRef.current);
        onPredict(results);
      } catch (err) {
        console.error("Classification error:", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleReset = () => {
    setPreview(null);
    onPredict([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-6">
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full aspect-square md:aspect-video border-2 border-dashed border-slate-300 rounded-3xl cursor-pointer bg-white hover:bg-slate-50 transition-all hover:border-green-400 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <i className="fas fa-cloud-arrow-up text-slate-400 text-2xl group-hover:text-green-600"></i>
            </div>
            <p className="mb-2 text-sm text-slate-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">JPG or PNG (max. 5MB)</p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="relative group overflow-hidden rounded-3xl shadow-xl">
          <img
            ref={imgRef}
            src={preview}
            alt="Preview"
            onLoad={handleProcess}
            className="w-full h-auto object-cover max-h-[400px]"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleReset}
              className="p-2 bg-white/90 backdrop-blur rounded-xl text-slate-700 hover:text-red-600 shadow-sm transition-colors"
              title="Remove image"
            >
              <i className="fas fa-trash-can"></i>
            </button>
          </div>
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
                <p className="text-white font-medium">Analyzing...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {preview && !isProcessing && (
        <button
          onClick={handleProcess}
          disabled={isLoading}
          className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
        >
          Re-analyze Image
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
