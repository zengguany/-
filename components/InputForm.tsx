import React from 'react';
import { Tone, TONE_LABELS } from '../types';
import { Sparkles, PenTool } from 'lucide-react';

interface InputFormProps {
  idea: string;
  setIdea: (val: string) => void;
  tone: Tone;
  setTone: (val: Tone) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  idea,
  setIdea,
  tone,
  setTone,
  onGenerate,
  isGenerating
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="space-y-6">
        {/* Idea Input */}
        <div className="space-y-2">
          <label htmlFor="idea" className="flex items-center text-sm font-bold text-slate-700">
            <PenTool className="w-4 h-4 mr-2 text-indigo-600" />
            创意 / 主题 (Idea)
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="例如：我们要推出一款新的 AI 咖啡机，主打早晨高效生活..."
            className="w-full h-32 p-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none outline-none"
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-slate-700">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
            语气风格 (Tone)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(TONE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTone(key as Tone)}
                className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 border ${
                  tone === key
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !idea.trim()}
          className={`w-full py-4 mt-4 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center ${
            isGenerating || !idea.trim()
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成中 (Generating)...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              一键生成文案与配图
            </>
          )}
        </button>
      </div>
    </div>
  );
};