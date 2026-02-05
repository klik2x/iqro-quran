
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const texts = ["Assalamualaikum", "Warahmatullahi", "Wabarakatuh", "Ahlan wa Sahlan"];
    const [currentText, setCurrentText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('hasSeenWelcome', 'true');
        const navigateTimer = setTimeout(() => {
            onFinish();
            navigate('/login');
        }, 6000);

        return () => clearTimeout(navigateTimer);
    }, [navigate, onFinish]);
    
    useEffect(() => {
        if (textIndex >= texts.length) return;

        const typingTimer = setTimeout(() => {
            if (charIndex < texts[textIndex].length) {
                setCurrentText(prev => prev + texts[textIndex][charIndex]);
                setCharIndex(prev => prev + 1);
            } else {
                // Move to next line
                setCurrentText(prev => prev + '\n');
                setTextIndex(prev => prev + 1);
                setCharIndex(0);
            }
        }, 100); // Typing speed

        return () => clearTimeout(typingTimer);
    }, [charIndex, textIndex, texts]);

    return (
        <div className="flex items-center justify-center h-screen bg-soft-white dark:bg-dark-blue">
            <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-emerald-dark dark:text-emerald-light whitespace-pre-wrap font-arabic">
                    {currentText}
                    <span className="animate-ping">|</span>
                </h1>
            </div>
        </div>
    );
};

export default Welcome;
