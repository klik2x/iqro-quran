import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollButtons: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showButtons = () => {
        setIsScrolling(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 4000); // Hide after 4 seconds for less obstruction
    };

    const handleScroll = useCallback(() => {
        if (window.pageYOffset > 200) {
            setIsVisible(true);
            showButtons();
        } else {
            setIsVisible(false);
        }
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showButtons();
    };
    
    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        showButtons();
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [handleScroll]);

    return (
        <div className={`fixed bottom-28 right-3 z-30 flex flex-col gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
            <button
                onClick={scrollToTop}
                className={`bg-white/10 dark:bg-black/10 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full p-2 shadow-sm hover:bg-emerald-500 hover:text-white transition-all active:scale-90 ${isScrolling ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`}
                aria-label="Scroll Top"
            >
                <ChevronUp size={18} />
            </button>
            <button
                onClick={scrollToBottom}
                className={`bg-white/10 dark:bg-black/10 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full p-2 shadow-sm hover:bg-emerald-500 hover:text-white transition-all active:scale-90 ${isScrolling ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`}
                aria-label="Scroll Bottom"
            >
                <ChevronDown size={18} />
            </button>
        </div>
    );
};

export default ScrollButtons;