import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { PlatformCard } from './components/PlatformCard';
import { Platform, Tone, GeneratedContent } from './types';
import { generateSocialText, generateSocialImage } from './services/gemini';
import { LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.Professional);
  const [status, setStatus] = useState<'idle' | 'generating' | 'complete'>('idle');
  const [results, setResults] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setStatus('generating');
    setError(null);
    setResults(null);

    try {
      // 1. Generate Text Content
      const textData = await generateSocialText(idea, tone);
      
      // Initialize results with text and loading state for images
      const initialResults: GeneratedContent = {
        [Platform.LinkedIn]: {
          text: textData.linkedin.text,
          imagePrompt: textData.linkedin.imagePrompt,
          aspectRatio: '16:9',
          isImageLoading: true
        },
        [Platform.Twitter]: {
          text: textData.twitter.text,
          imagePrompt: textData.twitter.imagePrompt,
          aspectRatio: '16:9',
          isImageLoading: true
        },
        [Platform.Instagram]: {
          text: textData.instagram.text,
          imagePrompt: textData.instagram.imagePrompt,
          aspectRatio: '3:4',
          isImageLoading: true
        }
      };
      
      setResults(initialResults);
      setStatus('complete'); // UI is now visible with skeletons

      // 2. Trigger Image Generation in Parallel
      const platforms = [Platform.LinkedIn, Platform.Twitter, Platform.Instagram] as Platform[];
      
      platforms.forEach(platform => {
        const content = initialResults[platform];
        generateSocialImage(content.imagePrompt, content.aspectRatio)
          .then(imageUrl => {
            setResults(prev => {
              if (!prev) return null;
              return {
                ...prev,
                [platform]: {
                  ...prev[platform],
                  imageUrl,
                  isImageLoading: false
                }
              };
            });
          })
          .catch(err => {
            console.error(`Failed to generate image for ${platform}`, err);
            setResults(prev => {
              if (!prev) return null;
              return {
                ...prev,
                [platform]: {
                  ...prev[platform],
                  isImageLoading: false // Stop loading even on error
                }
              };
            });
          });
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "生成内容时出错，请检查 API Key 或重试。");
      setStatus('idle');
    }
  };

  const regenerateImage = useCallback((platform: Platform) => {
    if (!results) return;
    const content = results[platform];
    
    // Update state to loading
    setResults(prev => {
        if (!prev) return null;
        return {
            ...prev,
            [platform]: { ...prev[platform], isImageLoading: true }
        };
    });

    generateSocialImage(content.imagePrompt, content.aspectRatio)
        .then(imageUrl => {
            setResults(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    [platform]: {
                        ...prev[platform],
                        imageUrl,
                        isImageLoading: false
                    }
                };
            });
        })
        .catch(err => {
             setResults(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    [platform]: { ...prev[platform], isImageLoading: false }
                };
            });
        });
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
               <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
              SocialGen <span className="text-slate-400 font-normal text-sm hidden sm:inline">| 全平台内容生成</span>
            </h1>
          </div>
          <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
             Powered by Gemini & Imagen
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Hero & Form Section */}
        <section className="flex flex-col items-center space-y-8">
          <div className="text-center max-w-2xl space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              一站式搞定社交媒体营销
            </h2>
            <p className="text-slate-600 text-lg">
              输入一个创意，自动生成适配 LinkedIn, Twitter 和 Instagram 的文案与专属配图。
            </p>
          </div>

          <InputForm 
            idea={idea}
            setIdea={setIdea}
            tone={tone}
            setTone={setTone}
            onGenerate={handleGenerate}
            isGenerating={status === 'generating'}
          />
          
          {error && (
            <div className="w-full max-w-4xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </section>

        {/* Results Grid */}
        {results && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <PlatformCard 
                platform={Platform.LinkedIn} 
                content={results[Platform.LinkedIn]} 
                onRegenerateImage={() => regenerateImage(Platform.LinkedIn)}
            />
            <PlatformCard 
                platform={Platform.Twitter} 
                content={results[Platform.Twitter]} 
                onRegenerateImage={() => regenerateImage(Platform.Twitter)}
            />
            <PlatformCard 
                platform={Platform.Instagram} 
                content={results[Platform.Instagram]} 
                onRegenerateImage={() => regenerateImage(Platform.Instagram)}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default App;