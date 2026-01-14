
import React from 'react';
import { Prediction, WasteCategory } from '../types';
import { DISPOSAL_DATA } from '../constants';

interface PredictionDisplayProps {
  predictions: Prediction[];
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ predictions }) => {
  if (predictions.length === 0) return null;

  const topPrediction = predictions[0];
  const disposalInfo = DISPOSAL_DATA[topPrediction.category];

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Prediction Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`${disposalInfo.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`fas ${disposalInfo.icon} text-2xl`}></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{topPrediction.category}</h3>
              <p className="text-slate-500 text-sm flex items-center gap-1">
                Detected: <span className="font-medium italic text-slate-700">{topPrediction.originalLabel}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-3xl font-black text-green-600">{Math.round(topPrediction.confidence * 100)}%</span>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Confidence</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <i className="fas fa-circle-info text-blue-500"></i>
            How to Dispose:
          </h4>
          <ul className="space-y-3">
            {disposalInfo.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 mt-0.5">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alternative Predictions */}
      {predictions.length > 1 && (
        <div className="grid grid-cols-2 gap-4">
          {predictions.slice(1).map((pred, idx) => {
            const altInfo = DISPOSAL_DATA[pred.category];
            return (
              <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${altInfo.color} w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs`}>
                    <i className={`fas ${altInfo.icon}`}></i>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{pred.category}</span>
                </div>
                <span className="text-sm font-bold text-slate-400">{Math.round(pred.confidence * 100)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;
