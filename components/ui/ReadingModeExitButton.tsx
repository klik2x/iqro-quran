
import React from 'react';
import { useUI } from '../../contexts/UIContext';
import { X } from 'lucide-react';

const ReadingModeExitButton: React.FC = () => {
    const { setReadingMode } = useUI();

    return (
        <button
            onClick={() => setReadingMode(false)}
            aria-label="Keluar dari Mode Baca"
            className="fixed top-4 right-4 z-50 bg-black/50 text-white rounded-full p-3 shadow-lg hover:bg-black/70 transition"
        >
            <X size={24} />
        </button>
    );
};

export default ReadingModeExitButton;
