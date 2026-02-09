
import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Sparkles, BookOpen, Star, Info, ChevronRight, AlertCircle, 
  CheckCircle2, Play, ChevronLeft, Award, HelpCircle, GraduationCap, X, 
  RotateCcw, Trophy, Trash2, Bookmark, BookmarkPlus, BookmarkCheck,
  ChevronDown, ChevronUp, Languages
} from 'lucide-react';
import { IQRO_DATA, HIJAIYAH_LETTERS } from '../constants';
import { speakText } from '../services/geminiService';

type ViewMode = 'study' | 'practice' | 'quiz' | 'tajwid' | 'bookmarks' | 'hijaiyah';

const IqroModule: React.FC<{t: any}> = ({ t }) => {
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('study');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [readingItemId, setReadingItemId] = useState<string | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<{
    index: number;
    score: number;
    showResult: boolean;
    feedback: 'correct' | 'wrong' | null;
  }>({ index: 0, score: 0, showResult: false, feedback: null });

  const activeLevel = IQRO_DATA.find(l => l.id === activeLevelId) || IQRO_DATA[0];
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('iqro-progress');
    const savedBookmarks = localStorage.getItem('iqro-bookmarks');
    if (savedProgress) setCompletedItems(new Set(JSON.parse(savedProgress)));
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)));
  }, []);

  const toggleItemCompletion = (itemId: string) => {
    const newSet = new Set(completedItems);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setCompletedItems(newSet);
    localStorage.setItem('iqro-progress', JSON.stringify(Array.from(newSet)));
  };

  const toggleBookmark = (itemId: string) => {
    const newSet = new Set(bookmarks);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setBookmarks(newSet);
    localStorage.setItem('iqro-bookmarks', JSON.stringify(Array.from(newSet)));
  };

  const resetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua kemajuan belajar Anda?')) {
      setCompletedItems(new Set());
      localStorage.removeItem('iqro-progress');
    }
  };

  const playQuizSound = (type: 'correct' | 'wrong') => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2); // A2
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  };

  const calculateProgress = (levelId: number) => {
    const level = IQRO_DATA.find(l => l.id === levelId);
    if (!level) return 0;
    const completedInLevel = level.items.filter((_, idx) => completedItems.has(`${levelId}-${idx}`)).length;
    return Math.round((completedInLevel / level.items.length) * 100);
  };

  const handleSpeak = (text: string, itemId: string | null = null) => {
    if (itemId) setReadingItemId(itemId);
    const prompt = `Bacakan potongan ayat iqro berikut dengan tartil, makhroj yang benar, dan jelas: ${text}`;
    speakText(prompt, 'Kore');
    // Clear highlight after estimated duration
    setTimeout(() => setReadingItemId(null), 3000);
  };

  const handleQuizAnswer = (answerIdx: number) => {
    const currentQuiz = activeLevel.quiz?.[quizState.index];
    if (!currentQuiz) return;

    if (answerIdx === currentQuiz.correctAnswer) {
      playQuizSound('correct');
      setQuizState(prev => ({ ...prev, score: prev.score + 1, feedback: 'correct' }));
    } else {
      playQuizSound('wrong');
      setQuizState(prev => ({ ...prev, feedback: 'wrong' }));
    }

    setTimeout(() => {
      if (quizState.index + 1 < (activeLevel.quiz?.length || 0)) {
        setQuizState(prev => ({ ...prev, index: prev.index + 1, feedback: null }));
      } else {
        setQuizState(prev => ({ ...prev, showResult: true }));
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizState({ index: 0, score: 0, showResult: false, feedback: null });
  };

  const navigateToNextLesson = (currentIndex: number) => {
    const currentId = `${activeLevelId}-${currentIndex}`;
    if (!completedItems.has(currentId)) {
      toggleItemCompletion(currentId);
    }
    if (currentIndex < activeLevel.items.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextItem = activeLevel.items[nextIndex];
      handleSpeak(nextItem.arabic, `${activeLevelId}-${nextIndex}`);
      // If we are in practice mode, update index
      if (viewMode === 'practice') setPracticeIndex(nextIndex);
    } else if (activeLevelId < 6) {
      // Move to next level if possible
      setActiveLevelId(activeLevelId + 1);
      setPracticeIndex(0);
    }
  };

  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-600 border-emerald-500 shadow-emerald-600/30 text-white',
    blue: 'bg-blue-600 border-blue-500 shadow-blue-600/30 text-white',
    amber: 'bg-amber-600 border-amber-500 shadow-amber-600/30 text-white',
    indigo: 'bg-indigo-600 border-indigo-500 shadow-indigo-600/30 text-white',
    purple: 'bg-purple-600 border-purple-500 shadow-purple-600/30 text-white',
    rose: 'bg-rose-600 border-rose-500 shadow-rose-600/30 text-white',
  };

  const lightColorClasses: Record<string, string> = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tighter text-emerald-700 dark:text-emerald-400 drop-shadow-sm flex items-center justify-center gap-4">
          <GraduationCap size={56} className="text-amber-500 animate-bounce" />
          IQRO Learning Center
        </h1>
        <p className="text-slate-500 text-xl font-bold max-w-2xl mx-auto">
          Mari belajar Al-Quran dengan cara yang asyik dan menyenangkan!
        </p>
      </div>

      {/* Level Selector with Progress */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 snap-x snap-mandatory">
          {IQRO_DATA.map((lvl) => {
            const progress = calculateProgress(lvl.id);
            return (
              <div key={lvl.id} className="flex-shrink-0 w-36 snap-center">
                <button
                  onClick={() => { setActiveLevelId(lvl.id); setViewMode('study'); }}
                  className={`relative flex flex-col items-center justify-between h-full gap-2 p-4 rounded-3xl border-2 transition-all group active:scale-95 shadow-lg w-full ${activeLevelId === lvl.id && viewMode !== 'hijaiyah' ? colorClasses[lvl.color] + ' -translate-y-1' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-400'}`}
                >
                  <div className="flex-grow flex flex-col items-center justify-center gap-2">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${activeLevelId === lvl.id && viewMode !== 'hijaiyah' ? 'bg-white/20' : lightColorClasses[lvl.color]}`}>
                          {lvl.id}
                      </div>
                      <span className={`font-black text-sm text-center ${activeLevelId === lvl.id && viewMode !== 'hijaiyah' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{lvl.title}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${activeLevelId === lvl.id && viewMode !== 'hijaiyah' ? 'bg-white' : 'bg-emerald-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {progress === 100 && (
                    <div className="absolute -top-2 -right-2 p-1.5 bg-amber-400 text-white rounded-full shadow-md">
                      <Trophy size={16} />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {[
          { id: 'study', label: t.study, icon: <BookOpen size={20} /> },
          { id: 'practice', label: t.practice, icon: <Play size={20} /> },
          { id: 'quiz', label: t.quiz, icon: <HelpCircle size={20} /> },
          { id: 'tajwid', label: 'Tajwid', icon: <Award size={20} /> },
          { id: 'bookmarks', label: t.bookmarks, icon: <Bookmark size={20} /> },
          { id: 'hijaiyah', label: t.hijaiyah, icon: <Languages size={20} /> },
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => { setViewMode(mode.id as ViewMode); resetQuiz(); }}
            className={`flex items-center gap-3 px-6 sm:px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 ${viewMode === mode.id ? colorClasses[activeLevel.color] : 'bg-white dark:bg-slate-800 text-slate-500 border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500'}`}
          >
            {mode.icon} {mode.label}
          </button>
        ))}
        <button 
          onClick={resetProgress}
          className="flex items-center gap-3 px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm bg-rose-100 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-lg active:scale-95"
        >
          <Trash2 size={20} /> {t.reset}
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#0b1121] rounded-[5rem] p-10 md:p-16 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.2)] border-4 border-slate-50 dark:border-slate-800 relative overflow-hidden transition-colors duration-500">
        
        {/* Hijaiyah Mode */}
        {viewMode === 'hijaiyah' && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="text-center mb-16 space-y-4">
               <h2 className="text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t.hijaiyah}</h2>
               <p className="text-slate-500 text-xl font-bold">Mengenal bentuk dan bunyi huruf dasar Al-Quran.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
               {HIJAIYAH_LETTERS.map((letter, idx) => (
                 <div 
                  key={idx}
                  className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 border-slate-50 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-xl group"
                 >
                    <div className="font-quran text-7xl font-bold text-slate-950 dark:text-white mb-4 group-hover:scale-125 transition-transform" dir="rtl">
                      {letter.letter}
                    </div>
                    <div className="text-center">
                       <p className="latin-reading text-lg text-emerald-600">{letter.name}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Study Mode */}
        {viewMode === 'study' && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
              <div className="flex items-center gap-10">
                <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl scale-110 ${colorClasses[activeLevel.color].split(' ')[0]}`}>
                   <Star size={40} className="animate-pulse" />
                </div>
                <div className="text-center md:text-left">
                   <h2 className="text-5xl font-black mb-2 tracking-tighter text-slate-950 dark:text-white uppercase">{activeLevel.title}</h2>
                   <p className="text-slate-500 text-xl font-bold max-w-xl">{activeLevel.desc}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {activeLevel.items.map((item, idx) => {
                const itemId = `${activeLevelId}-${idx}`;
                const isCompleted = completedItems.has(itemId);
                const isBookmarked = bookmarks.has(itemId);
                const isReading = readingItemId === itemId;

                return (
                  <div key={idx} className="relative group">
                    <div 
                      className={`w-full p-12 rounded-[4rem] border-4 transition-all flex flex-col items-center gap-8 group hover:shadow-2xl shadow-xl relative overflow-hidden ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'} ${isReading ? 'ring-8 ring-emerald-400 ring-offset-4 dark:ring-offset-slate-950' : ''}`}
                    >
                      {isBookmarked && (
                        <div className="absolute top-12 left-12 text-amber-500 animate-in fade-in zoom-in">
                          <Bookmark size={32} fill="currentColor" />
                        </div>
                      )}

                      <div className={`font-quran text-7xl font-bold text-slate-950 dark:text-slate-100 transition-all duration-500 ${isReading ? 'reading-highlight text-emerald-600 dark:text-emerald-400' : ''}`} dir="rtl">
                        {item.arabic}
                      </div>
                      <div className="text-center space-y-6">
                        <p className={`latin-reading text-2xl font-black italic transition-opacity ${isReading ? 'opacity-100' : 'opacity-80'} text-slate-950 dark:text-emerald-400`}>{item.latin}</p>
                        <div className="flex items-center gap-4 justify-center">
                          <button 
                            onClick={() => handleSpeak(item.arabic, itemId)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner border border-slate-100 dark:border-slate-700 ${isReading ? 'bg-emerald-600 text-white' : lightColorClasses[activeLevel.color]}`}
                          >
                            <Volume2 size={28} />
                          </button>
                          <button 
                            onClick={() => navigateToNextLesson(idx)}
                            className={`px-6 py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-lg active:scale-95 ${colorClasses[activeLevel.color]}`}
                          >
                            {t.nextLesson}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                       <button 
                        onClick={() => toggleItemCompletion(itemId)}
                        className={`p-4 rounded-3xl transition-all shadow-lg active:scale-90 ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-emerald-500'}`}
                      >
                        <CheckCircle2 size={24} />
                      </button>
                      <button 
                        onClick={() => toggleBookmark(itemId)}
                        className={`p-4 rounded-3xl transition-all shadow-lg active:scale-90 ${isBookmarked ? 'bg-amber-400 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-amber-500'}`}
                      >
                        {isBookmarked ? <BookmarkCheck size={24} /> : <BookmarkPlus size={24} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Practice Mode */}
        {viewMode === 'practice' && (
          <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Latihan Mandiri</h3>
               <p className="text-slate-500 font-bold italic">Fokus pada satu bacaan untuk kefasihan maksimal.</p>
            </div>
            
            <div className={`bg-slate-50 dark:bg-slate-900/50 rounded-[5rem] p-16 md:p-24 border-4 border-dashed border-slate-200 dark:border-slate-800 text-center relative transition-all duration-500 ${readingItemId === `${activeLevelId}-${practiceIndex}` ? 'ring-8 ring-emerald-500 ring-offset-8 dark:ring-offset-slate-950' : ''}`}>
              {bookmarks.has(`${activeLevelId}-${practiceIndex}`) && (
                <div className="absolute top-12 left-12 text-amber-500 animate-in fade-in slide-in-from-top">
                   <Bookmark size={48} fill="currentColor" />
                </div>
              )}

              <div className="absolute top-10 left-10 text-slate-300 dark:text-slate-700 font-black text-8xl opacity-20 select-none">
                {practiceIndex + 1}
              </div>
              <div className={`font-quran text-9xl md:text-[12rem] font-black text-slate-950 dark:text-white mb-12 transition-transform duration-500 ${readingItemId === `${activeLevelId}-${practiceIndex}` ? 'reading-highlight text-emerald-600' : ''}`} dir="rtl">
                {activeLevel.items[practiceIndex].arabic}
              </div>
              <p className="latin-reading text-4xl font-black mb-12">{activeLevel.items[practiceIndex].latin}</p>
              
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={() => handleSpeak(activeLevel.items[practiceIndex].arabic, `${activeLevelId}-${practiceIndex}`)}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-90 ${String(colorClasses[activeLevel.color]).split(' ')[0]}`}
                >
                  <Volume2 size={40} />
                </button>
                <button 
                  onClick={() => navigateToNextLesson(practiceIndex)}
                  className={`px-10 py-6 rounded-[2rem] font-black text-xl uppercase transition-all shadow-2xl active:scale-95 ${colorClasses[activeLevel.color]}`}
                >
                  {t.nextLesson}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button 
                disabled={practiceIndex === 0}
                onClick={() => setPracticeIndex(Math.max(0, practiceIndex - 1))}
                className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border-2 border-slate-100 dark:border-slate-800 disabled:opacity-30 active:scale-90 transition-all"
              >
                <ChevronLeft size={32} />
              </button>
              <div className="font-black text-2xl text-slate-400">
                {practiceIndex + 1} / {activeLevel.items.length}
              </div>
              <button 
                disabled={practiceIndex === activeLevel.items.length - 1}
                onClick={() => setPracticeIndex(Math.min(activeLevel.items.length - 1, practiceIndex + 1))}
                className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border-2 border-slate-100 dark:border-slate-800 disabled:opacity-30 active:scale-90 transition-all"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        )}

        {/* Tajwid Rules Mode */}
        {viewMode === 'tajwid' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Hukum Tajwid {activeLevel.title}</h3>
                <p className="text-slate-500 font-bold italic">Belajar aturan membaca agar tartil dan indah. Klik kartu untuk detail.</p>
             </div>

             <div className="space-y-6">
                {!activeLevel.tajwid || activeLevel.tajwid.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem]">
                    <p className="text-xl font-bold text-slate-400">Belum ada aturan tajwid khusus di level ini.</p>
                  </div>
                ) : activeLevel.tajwid.map(rule => {
                  const isExpanded = expandedRuleId === rule.id;
                  return (
                    <div 
                      key={rule.id} 
                      className={`bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border-4 transition-all duration-300 overflow-hidden ${isExpanded ? 'border-emerald-500 scale-[1.02]' : 'border-slate-50 dark:border-slate-800 hover:border-emerald-200'}`}
                    >
                       <button 
                        onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                        className="w-full p-8 flex items-center justify-between gap-6 group"
                       >
                          <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner ${lightColorClasses[activeLevel.color]}`}>
                               <Award size={28} />
                            </div>
                            <div className="text-left">
                               <h4 className="text-2xl font-black text-slate-900 dark:text-white">{rule.name}</h4>
                               <div className="font-quran text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1" dir="rtl">{rule.example}</div>
                            </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-slate-400 group-hover:text-emerald-500 transition-colors">
                            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                          </div>
                       </button>

                       {isExpanded && (
                        <div className="px-8 pb-10 space-y-8 animate-in slide-in-from-top-4 duration-300 border-t-2 border-slate-50 dark:border-slate-800 pt-8">
                           <div className="space-y-4">
                              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Penjelasan</h5>
                              <p className="text-lg font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{rule.explanation}</p>
                           </div>
                           
                           <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
                              <div className="text-center md:text-left space-y-2">
                                <h5 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Cara Baca (Latin)</h5>
                                <p className="latin-reading text-2xl font-black">{rule.exampleLatin}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => handleSpeak(rule.example, `tajwid-${rule.id}`)}
                                  className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                  <Volume2 size={24} /> Read Aloud
                                </button>
                              </div>
                           </div>
                        </div>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {/* Quiz Mode */}
        {viewMode === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-10 animate-in zoom-in duration-500">
             {!activeLevel.quiz ? (
               <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem]">
                  <AlertCircle size={64} className="mx-auto text-amber-500 mb-6" />
                  <p className="text-2xl font-black">Kuis belum tersedia untuk level ini.</p>
               </div>
             ) : quizState.showResult ? (
               <div className="text-center p-16 space-y-10 bg-emerald-50 dark:bg-emerald-900/10 rounded-[4rem] border-4 border-emerald-200 dark:border-emerald-800">
                  <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl animate-bounce">
                    <Trophy size={64} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-emerald-700 dark:text-emerald-400 tracking-tighter">Masha Allah! Hebat Sekali!</h3>
                    <p className="text-2xl font-bold text-slate-500">Skor Kamu: {quizState.score} / {activeLevel.quiz.length}</p>
                  </div>
                  <button 
                    onClick={resetQuiz}
                    className="px-12 py-5 bg-emerald-600 text-white font-black text-xl rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto"
                  >
                    <RotateCcw size={28} /> Ulangi Kuis
                  </button>
               </div>
             ) : (
               <div className="space-y-10">
                  <div className="flex items-center justify-between mb-4">
                     <span className="bg-slate-100 dark:bg-slate-800 px-6 py-2 rounded-full font-black text-sm uppercase">Soal {quizState.index + 1} / {activeLevel.quiz.length}</span>
                     <span className="text-emerald-600 font-black">Skor: {quizState.score}</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] border-4 border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-8">
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white">{activeLevel.quiz[quizState.index].question}</h4>
                    {activeLevel.quiz[quizState.index].arabic && (
                      <div className="font-quran text-8xl font-black py-4" dir="rtl">
                        {activeLevel.quiz[quizState.index].arabic}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-4 pt-6">
                       {activeLevel.quiz[quizState.index].options.map((opt, i) => (
                         <button 
                          key={i}
                          onClick={() => handleQuizAnswer(i)}
                          className={`w-full p-6 rounded-3xl font-black text-xl border-4 transition-all active:scale-95 ${quizState.feedback === 'correct' && i === activeLevel.quiz?.[quizState.index].correctAnswer ? 'bg-emerald-500 border-emerald-400 text-white scale-105 shadow-xl' : quizState.feedback === 'wrong' && i !== activeLevel.quiz?.[quizState.index].correctAnswer ? 'opacity-40 border-slate-100 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 hover:border-emerald-500'}`}
                         >
                            {opt}
                         </button>
                       ))}
                    </div>
                  </div>

                  {quizState.feedback && (
                    <div className={`text-center py-4 rounded-2xl font-black text-xl animate-in fade-in slide-in-from-top-4 ${quizState.feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {quizState.feedback === 'correct' ? 'MANTAP! JAWABAN BENAR ✨' : 'UPS! COBA LAGI YA 💔'}
                    </div>
                  )}
               </div>
             )}
          </div>
        )}

        {/* Bookmarks Mode */}
        {viewMode === 'bookmarks' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Halaman Penanda</h3>
                <p className="text-slate-500 font-bold italic">Kumpulan bacaan yang Anda tandai untuk dipelajari kembali.</p>
             </div>

             {bookmarks.size === 0 ? (
               <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
                  <BookmarkPlus size={64} className="mx-auto text-slate-300 mb-6" />
                  <p className="text-2xl font-black text-slate-400">Belum ada item yang ditandai.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                 {Array.from(bookmarks).map((id: string) => {
                    const [lvlId, itemIdx] = String(id).split('-').map(Number);
                    const level = IQRO_DATA.find(l => l.id === lvlId);
                    const item = level?.items[itemIdx];
                    if (!item) return null;

                    return (
                      <div key={id} className="relative group">
                        <div 
                          className={`w-full p-12 rounded-[4rem] border-4 transition-all flex flex-col items-center gap-8 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-amber-400 shadow-xl ${readingItemId === id ? 'ring-8 ring-amber-400 ring-offset-4 dark:ring-offset-slate-950' : ''}`}
                        >
                          <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-[-1.5rem]">{level?.title}</div>
                          <div className={`font-quran text-7xl font-bold text-slate-950 dark:text-slate-100 transition-all ${readingItemId === id ? 'reading-highlight text-amber-600' : ''}`} dir="rtl">
                            {(item as any).arabic}
                          </div>
                          <div className="text-center space-y-4">
                            <p className="latin-reading text-2xl font-black italic">{(item as any).latin}</p>
                            <button 
                              onClick={() => handleSpeak((item as any).arabic, id)}
                              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner border border-slate-100 dark:border-slate-700 bg-amber-50 text-amber-600"
                            >
                              <Volume2 size={28} />
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleBookmark(id)}
                          className="absolute top-4 right-4 p-4 rounded-3xl bg-amber-400 text-white shadow-lg active:scale-90"
                        >
                          <BookmarkCheck size={24} />
                        </button>
                      </div>
                    );
                 })}
               </div>
             )}
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-slate-100 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 flex gap-6 items-start">
         <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl shrink-0">
           <AlertCircle size={28} />
         </div>
         <div className="space-y-2">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">Catatan Penting:</h4>
            <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic">
              Informasi baik berupa text maupun audio yang di sajikan di WebApp ini menggunakan AI, di tujukan untuk informasi dan pembelajaran, bukan sebagai fatwa atau ahlinya, untuk lebih afdhol di sarankan untuk belajar kepada guru agama atau ahli di bidangnya.
            </p>
         </div>
      </div>
    </div>
  );
};

export default IqroModule;