
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollButtons: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={`fixed bottom-24 right-4 z-30 flex flex-col gap-2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button
                onClick={scrollToTop}
                aria-label="Scroll ke atas"
                className="bg-emerald-dark/80 backdrop-blur-sm text-white rounded-full p-3 shadow-lg hover:bg-emerald-dark transition"
            >
                <ChevronUp size={24} />
            </button>
            <button
                onClick={scrollToBottom}
                aria-label="Scroll ke bawah"
                className="bg-emerald-dark/80 backdrop-blur-sm text-white rounded-full p-3 shadow-lg hover:bg-emerald-dark transition"
            >
                <ChevronDown size={24} />
            </button>
        </div>
    );
};

export default ScrollButtons;
