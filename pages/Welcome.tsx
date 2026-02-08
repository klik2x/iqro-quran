
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuranLogoFuturistic = () => (
    <div className="relative w-32 h-32 mx-auto mb-8 animate-fade-in">
        {/* Background Geometric Pattern */}
        <div className="absolute inset-0 bg-emerald-dark/20 dark:bg-emerald-light/10 rounded-3xl rotate-45 animate-pulse"></div>
        <div className="absolute inset-2 bg-emerald-dark/10 dark:bg-emerald-light/5 rounded-3xl -rotate-12"></div>
        
        {/* Main Logo Container */}
        <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-2xl">
                <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#036666', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#D4AF37', stopOpacity:1}} />
                    </linearGradient>
                </defs>
                {/* Book Shape */}
                <path d="M20,30 Q50,20 80,30 L80,70 Q50,80 20,70 Z" fill="url(#logoGrad)" stroke="#fff" strokeWidth="2" />
                <path d="M50,25 L50,75" stroke="#fff" strokeWidth="2" strokeDasharray="4 2" />
                {/* Futuristic Dots */}
                <circle cx="20" cy="30" r="2" fill="#FFD700" />
                <circle cx="80" cy="30" r="2" fill="#FFD700" />
                <circle cx="50" cy="50" r="3" fill="#fff" className="animate-ping" />
            </svg>
        </div>
    </div>
);

const Welcome: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const texts = ["Assalamualaikum", "Warahmatullahi", "Wabarakatuh", "Ahlan wa Sahlan"];
    const [currentText, setCurrentText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('hasSeenWelcome', 'true');
        const typingSpeed = 100;
        const totalTypingDuration = 5500;

        const navigateTimer = setTimeout(() => {
            onFinish();
            navigate('/login');
        }, totalTypingDuration);

        return () => clearTimeout(navigateTimer);
    }, [navigate, onFinish]);
    
    useEffect(() => {
        if (textIndex >= texts.length) return;
        const typingTimer = setTimeout(() => {
            if (charIndex < texts[textIndex].length) {
                setCurrentText(prev => prev + texts[textIndex][charIndex]);
                setCharIndex(prev => prev + 1);
            } else {
                if (textIndex < texts.length -1) setCurrentText(prev => prev + '\n');
                setTextIndex(prev => prev + 1);
                setCharIndex(0);
            }
        }, 80);
        return () => clearTimeout(typingTimer);
    }, [charIndex, textIndex, texts]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-soft-white dark:bg-dark-blue p-6">
            <QuranLogoFuturistic />
            <div className="text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-emerald-dark dark:text-emerald-light whitespace-pre-wrap font-arabic leading-relaxed">
                    {currentText}
                    <span className="inline-block w-1 h-8 bg-gold-dark ml-1 animate-pulse"></span>
                </h1>
            </div>
        </div>
    );
};

export default Welcome;
