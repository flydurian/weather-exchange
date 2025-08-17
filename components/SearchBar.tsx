
import React from 'react';
import { Icon } from './Icon';

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: () => void;
    onGetCurrentLocation: () => void;
    onRefresh: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange, onSearch, onGetCurrentLocation, onRefresh }) => {
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="card rounded-2xl p-4">
            <div className="flex flex-row gap-2 items-center">
                <div className="relative flex-grow">
                    <Icon name="Search" className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80 pointer-events-none" />
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search city name (e.g., London)" 
                        className="w-full bg-transparent border-b-2 border-white/50 focus:border-white focus:outline-none py-2 pl-10 pr-4 placeholder-white/70" 
                        inputMode="search"
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={onSearch} className="bg-sky-500 hover:bg-sky-600 transition-colors rounded-lg py-2 font-bold flex items-center justify-center gap-2 px-2.5 sm:px-4">
                        <Icon name="Search" className="w-5 h-5" />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                    <button onClick={onGetCurrentLocation} title="Current Location" className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-2.5 font-bold flex items-center justify-center">
                        <Icon name="MapPin" className="w-5 h-5" />
                    </button>
                    <button onClick={onRefresh} title="Refresh" className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-2.5 font-bold flex items-center justify-center">
                        <Icon name="RotateCw" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
