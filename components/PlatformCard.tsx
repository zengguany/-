import React from 'react';
import { PlatformContent, Platform } from '../types';
import { Copy, Check, RefreshCw, Linkedin, Twitter, Instagram, Image as ImageIcon } from 'lucide-react';

interface PlatformCardProps {
  platform: Platform;
  content: PlatformContent;
  onRegenerateImage: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, content, onRegenerateImage }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case Platform.LinkedIn: return <Linkedin className="w-5 h-5 text-[#0077b5]" />;
      case Platform.Twitter: return <Twitter className="w-5 h-5 text-black" />;
      case Platform.Instagram: return <Instagram className="w-5 h-5 text-[#E1306C]" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case Platform.LinkedIn: return 'LinkedIn (领英)';
      case Platform.Twitter: return 'Twitter (X)';
      case Platform.Instagram: return 'Instagram';
    }
  };

  const getAspectRatioLabel = (ratio: string) => {
     switch(ratio) {
         case '16:9': return 'Landscape (16:9)';
         case '3:4': return 'Portrait (3:4)';
         case '1:1': return 'Square (1:1)';
         default: return ratio;
     }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 flex flex-col h-full transform transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          {getPlatformIcon()}
          <span>{getPlatformName()}</span>
        </div>
        <div className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
           {getAspectRatioLabel(content.aspectRatio)}
        </div>
      </div>

      {/* Image Section */}
      <div className={`relative w-full bg-slate-100 overflow-hidden flex items-center justify-center ${
        content.aspectRatio === '16:9' ? 'aspect-video' : content.aspectRatio === '3:4' ? 'aspect-[3/4]' : 'aspect-square'
      }`}>
        {content.isImageLoading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 animate-pulse">
             <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
             <span className="text-sm font-medium">正在生成配图...</span>
          </div>
        ) : content.imageUrl ? (
          <div className="relative group w-full h-full">
            <img src={content.imageUrl} alt="Generated content" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button
                    onClick={onRegenerateImage}
                    className="px-4 py-2 bg-white text-slate-900 rounded-full text-sm font-bold flex items-center hover:bg-slate-100"
                 >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重绘
                 </button>
            </div>
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                <p className="text-sm">图片生成失败</p>
                 <button
                    onClick={onRegenerateImage}
                    className="mt-2 px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                 >
                    重试
                 </button>
            </div>
        )}
      </div>

      {/* Text Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1 mb-4">
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-normal">
            {content.text}
          </p>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono">
                {content.text.length} 字符
            </span>
            <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                copied
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制文案'}
            </button>
        </div>
      </div>
    </div>
  );
};