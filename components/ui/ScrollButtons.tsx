import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollButtons: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showButtons = useCallback(() => {
        setIsScrolling(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 6000); // Hide after 6 seconds
    }, []);

    const handleScroll = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show only after scrolling more than half of the page
        if (scrollTop > (scrollHeight - clientHeight) / 2) {
            setIsVisible(true);
            showButtons();
        } else {
            setIsVisible(false);
        }
    }, [showButtons]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showButtons();
    };
    
    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        showButtons();
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [handleScroll]);

    return (
        <div className={`fixed bottom-24 right-4 z-30 flex flex-col gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <button
                onClick={scrollToTop}
                className={`bg-white/20 dark:bg-black/20 backdrop-blur-md text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full p-2.5 shadow-lg hover:bg-emerald-500 hover:text-white transition-all active:scale-90 ${isScrolling ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}
                aria-label="Scroll Top"
            >
                <ChevronUp size={20} />
            </button>
            <button
                onClick={scrollToBottom}
                className={`bg-white/20 dark:bg-black/20 backdrop-blur-md text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full p-2.5 shadow-lg hover:bg-emerald-500 hover:text-white transition-all active:scale-90 ${isScrolling ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}
                aria-label="Scroll Bottom"
            >
                <ChevronDown size={20} />
            </button>
        </div>
    );
};

export default ScrollButtons;