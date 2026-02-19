import { useState, useEffect, useCallback } from 'react';
import { iqroData } from '../data/iqroData';

const PROGRESS_KEY = 'iqro_progress';

export const useIqroProgress = () => {
    const [progress, setProgress] = useState<Record<string, boolean>>(() => {
        try {
            const savedProgress = localStorage.getItem(PROGRESS_KEY);
            return savedProgress ? JSON.parse(savedProgress) : {};
        } catch (error) {
            console.error("Failed to parse Iqro progress from localStorage", error);
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error("Failed to save Iqro progress to localStorage", error);
        }
    }, [progress]);
    
    const markAsCompleted = useCallback((id: string) => {
        setProgress(prev => ({...prev, [id]: true}));
    }, []);
    
    const resetProgress = useCallback(() => {
        setProgress({});
        localStorage.removeItem(PROGRESS_KEY);
    }, []);

    const calculateLevelCompletion = useCallback((level: number, sections: any[]) => {
        if (!sections) return { percentage: 0, completedItems: 0, totalItems: 0 };

        const totalItemsInLevel = sections.reduce((acc, section) => acc + section.items.length, 0);
        if (totalItemsInLevel === 0) return { percentage: 0, completedItems: 0, totalItems: 0 };

        let completedItems = 0;
        sections.forEach((section, sectionIndex) => {
            section.items.forEach((_, itemIndex) => {
                const id = `${level}-${sectionIndex}-${itemIndex}`;
                if (progress[id]) {
                    completedItems++;
                }
            });
        });
        
        return {
            percentage: (completedItems / totalItemsInLevel) * 100,
            completedItems: completedItems,
            totalItems: totalItemsInLevel
        };
    }, [progress]);

    return { progress, markAsCompleted, resetProgress, calculateLevelCompletion };
};