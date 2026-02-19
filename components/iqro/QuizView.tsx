
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { correctSound, incorrectSound } from '../../assets/sounds';
import { useTranslation, TranslationKeys } from '../../contexts/LanguageContext';
import { HijaiyahCard } from './HijaiyahCard';
import { IqroLevelData } from '../../types';
import { speakText } from '../../services/geminiService'; // Import speakText

interface QuizViewProps {
    levelData: IqroLevelData;
}

const QuizView: React.FC<QuizViewProps> = ({ levelData }) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const { t } = useTranslation();

    // Flatten all items from all sections into a single array for quiz generation
    // FIX: Add 'id' property to each item when flattening
    const allItems = useMemo(() =>
        levelData.sections.flatMap((section, sectionIndex) =>
            section.items.map((item, itemIndex) => ({
                ...item,
                id: `${levelData.level}-${sectionIndex}-${itemIndex}`, // Add unique ID
            }))
        ),
    [levelData]);
    
    // Function to generate quiz questions
    const generateQuestions = useCallback(() => {
        // Ensure there are enough unique items to create meaningful questions and options
        if (allItems.length < 4) { // Need at least 4 items for 1 question with 3 distractor options
            setQuestions([]);
            return;
        }

        const numberOfQuestions = Math.min(10, allItems.length); // Max 10 questions or less if not enough items
        const newQuestions = [];
        const usedItems = new Set<string>(); // To prevent duplicate questions

        while (newQuestions.length < numberOfQuestions) {
            // Select a random item for the question
            const questionItem = allItems[Math.floor(Math.random() * allItems.length)];
            
            // Ensure this item hasn't been used as a question before
            if (usedItems.has(questionItem.id)) { // FIX: Use the 'id' property
                continue;
            }
            usedItems.add(questionItem.id); // FIX: Use the 'id' property

            const correctAnswer = questionItem.latin;
            let options = [correctAnswer];
            
            // Generate 3 unique incorrect options
            while (options.length < 4) {
                const randomDistractor = allItems[Math.floor(Math.random() * allItems.length)];
                // Ensure distractor is not the correct answer and not already in options
                if (randomDistractor.latin !== correctAnswer && !options.includes(randomDistractor.latin)) {
                    options.push(randomDistractor.latin);
                }
            }
            
            // Shuffle options
            options = options.sort(() => 0.5 - Math.random());

            newQuestions.push({
                char: questionItem.char,
                latin: questionItem.latin, // This is the actual correct Latin
                options: options,
                correctAnswer: correctAnswer,
            });
        }
        setQuestions(newQuestions);
    }, [allItems]);
    
    useEffect(() => {
        resetQuiz();
    }, [levelData]); // Regenerate questions if level data changes

    const resetQuiz = useCallback(() => {
        generateQuestions();
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setQuizFinished(false);
    }, [generateQuestions]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return; // Prevent multiple answers
        setSelectedAnswer(answer);
        const correct = answer === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);
        
        // Play sound feedback
        const audio = new Audio(correct ? correctSound : incorrectSound);
        audio.play().catch(() => {});

        if (correct) setScore(s => s + 1);

        // Move to next question after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setQuizFinished(true); // End quiz
            }
        }, 1500);
    };

    if (questions.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 dark:bg-dark-blue-card rounded-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('quizNotAvailable' as TranslationKeys)}</h3>
                <p className="text-slate-500 mt-2 text-sm">Pastikan ada cukup materi untuk membuat kuis.</p>
            </div>
        );
    }
    
    if (quizFinished) {
        return (
            <div className="text-center p-8 space-y-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl">
                <h3 className="text-3xl font-black text-emerald-dark dark:text-white uppercase tracking-tight">{t('quizComplete' as TranslationKeys)}</h3>
                <p className="text-xl font-bold">{t('yourScore' as TranslationKeys)}: <span className="text-gold-dark text-4xl">{score}</span> / {questions.length}</p>
                <button onClick={resetQuiz} className="bg-emerald-dark text-white px-10 py-3 rounded-2xl font-black shadow-lg hover:bg-opacity-90 active:scale-95 transition">
                    {t('tryAgain' as TranslationKeys)}
                </button>
            </div>
        );
    }
    
    const currentQ = questions[currentQuestionIndex];

    const handlePlayQuestionAudio = useCallback(async (char: string, latin?: string) => {
        try {
            // ALWAYS use Web Speech API for Iqro quiz questions
            // Play Arabic char first, then Latin pronunciation
            await speakText(char, 'Kore', 'Arabic', true, latin, true).then(pb => pb.play());
        } catch (error) {
            console.error("Error playing quiz question audio:", error);
        }
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('question' as TranslationKeys)} {currentQuestionIndex + 1} / {questions.length}</span>
                <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-white">{t('whatIsTheReading' as TranslationKeys)}</h3>
            </div>

            {/* Quiz Card - Arabic TOP, Latin BOTTOM (handled by prop) */}
            <div className="max-w-[240px] mx-auto">
                <HijaiyahCard 
                    id={`quiz-card-${currentQuestionIndex}`} // Unique ID for each question
                    item={{ char: currentQ.char, latin: currentQ.latin }} // Pass correct latin for display
                    level={levelData.level}
                    sectionTitle=""
                    isLoading={false}
                    isPlaying={false}
                    onPlay={() => handlePlayQuestionAudio(currentQ.char, currentQ.latin)} // Play both Arabic and Latin
                    isLarge={true}
                    showLatinText={true}
                    isQuizMode={true} // Triggers top-bottom layout in HijaiyahCard
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {currentQ.options.map((opt: string) => (
                    <button 
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        disabled={!!selectedAnswer} // Disable buttons once an answer is selected
                        className={`p-5 rounded-2xl font-black text-lg shadow-md transition-all border-2
                            ${selectedAnswer === opt 
                                ? (isCorrect ? 'bg-emerald-600 border-emerald-500 text-white scale-105' : 'bg-red-500 border-red-400 text-white animate-shake') 
                                : (selectedAnswer && opt === currentQ.correctAnswer ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-white dark:bg-dark-blue border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200')}
                            disabled:cursor-not-allowed min-h-[64px]`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuizView;