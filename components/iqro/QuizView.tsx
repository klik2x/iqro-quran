
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { iqroData } from '../../data/iqroData';
import { correctSound, incorrectSound } from '../../assets/sounds';
import { useTranslation } from '../../contexts/LanguageContext';

interface QuizViewProps {
    levelData: typeof iqroData[0];
}

interface Question {
    char: string;
    latin: string;
    options: string[];
    correctAnswer: string;
}

const QuizView: React.FC<QuizViewProps> = ({ levelData }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const { t } = useTranslation();

    const allItems = useMemo(() => 
        levelData.sections.flatMap(section => section.items), 
    [levelData]);
    
    const generateQuestions = useCallback(() => {
        if (allItems.length < 4) { 
            setQuestions([]);
            return;
        };

        const shuffledItems = [...allItems].sort(() => 0.5 - Math.random());
        const quizItems = shuffledItems.slice(0, 10); // Max 10 questions

        const newQuestions = quizItems.map(item => {
            const correctAnswer = item.latin;
            let options = [correctAnswer];
            while (options.length < 4) {
                const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
                if (!options.includes(randomItem.latin)) {
                    options.push(randomItem.latin);
                }
            }
            return {
                char: item.char,
                latin: item.latin,
                options: options.sort(() => 0.5 - Math.random()),
                correctAnswer,
            };
        });
        setQuestions(newQuestions);
    }, [allItems]);
    
    useEffect(() => {
        resetQuiz();
    }, [levelData]);

    const playSound = (sound: string) => {
        try {
            const audio = new Audio(sound);
            audio.play().catch(e => console.error("Audio play failed:", e));
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        
        setSelectedAnswer(answer);
        const correct = answer === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(s => s + 1);
            playSound(correctSound);
        } else {
            playSound(incorrectSound);
        }

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setQuizFinished(true);
            }
        }, 1500);
    };

    const resetQuiz = useCallback(() => {
        generateQuestions();
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setQuizFinished(false);
    }, [generateQuestions]);

    if (questions.length === 0) {
        return <div className="text-center p-8">{t('quizNotAvailable')}</div>;
    }
    
    if (quizFinished) {
        return (
            <div className="text-center p-8 space-y-4">
                <h3 className="text-2xl font-bold text-emerald-dark dark:text-white">{t('quizComplete')}</h3>
                <p className="text-lg">{t('yourScore')} <span className="font-bold text-gold-dark">{score}</span> / {questions.length}</p>
                <button onClick={resetQuiz} className="bg-emerald-dark text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90">
                    {t('tryAgain')}
                </button>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="p-4 space-y-6">
            <div className="text-center">
                <p>{t('question')} {currentQuestionIndex + 1} {t('of')} {questions.length}</p>
                <h3 className="text-xl font-semibold mt-2">{t('whatIsTheReading')}</h3>
            </div>
            <div className="flex justify-center items-center bg-gray-100 dark:bg-dark-blue h-48 rounded-lg">
                <p className="font-arabic text-8xl">{currentQuestion.char}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map(option => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = option === currentQuestion.correctAnswer;
                    
                    let buttonClass = "bg-white dark:bg-dark-blue-card hover:bg-gray-100 dark:hover:bg-gray-700";
                    if (isSelected) {
                        buttonClass = isCorrect ? "bg-green-500 text-white animate-pulse" : "bg-red-500 text-white animate-shake";
                    } else if (selectedAnswer && isCorrectAnswer) {
                        buttonClass = "bg-green-500 text-white";
                    }

                    return (
                        <button 
                            key={option}
                            onClick={() => handleAnswer(option)}
                            disabled={!!selectedAnswer}
                            className={`p-4 rounded-lg text-lg font-semibold transition ${buttonClass} disabled:cursor-not-allowed`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default QuizView;
