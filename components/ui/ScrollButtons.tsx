
import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollButtons: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    // Use any to avoid NodeJS namespace issues in browser environment where NodeJS types might conflict
    const timerRef = useRef<any>(null);

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsVisible(true);
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 6000);
    };

    const handleScroll = () => {
        if (window.pageYOffset > 300) {
            resetTimer();
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        resetTimer();
    };
    
    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        resetTimer();
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className={`fixed bottom-24 right-4 z-30 flex flex-col gap-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <button
                onClick={scrollToTop}
                aria-label="Scroll ke atas"
                className="bg-emerald-dark/80 backdrop-blur-sm text-white rounded-full p-3 shadow-lg hover:bg-emerald-dark transition active:scale-90"
            >
                <ChevronUp size={24} />
            </button>
            <button
                onClick={scrollToBottom}
                aria-label="Scroll ke bawah"
                className="bg-emerald-dark/80 backdrop-blur-sm text-white rounded-full p-3 shadow-lg hover:bg-emerald-dark transition active:scale-90"
            >
                <ChevronDown size={24} />
            </button>
        </div>
    );
};

export default ScrollButtons;
