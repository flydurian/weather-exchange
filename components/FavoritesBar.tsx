
import React from 'react';
import { Icon } from './Icon';

interface FavoritesBarProps {
    favorites: string[];
    currentCityName?: string | null;
    onSelectFavorite: (city: string) => void;
    onRemoveFavorite: (city: string) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({ favorites, currentCityName, onSelectFavorite, onRemoveFavorite }) => {
    if (favorites.length === 0) return null;

    return (
        <div className="favorites-container mt-4 flex gap-2 overflow-x-auto">
            {favorites.map(city => (
                <div key={city} className="flex-shrink-0 flex items-center bg-white/10 rounded-full group">
                    <button 
                        onClick={() => onSelectFavorite(city)}
                        className={`favorite-btn text-sm sm:text-base px-3 py-1.5 rounded-l-full hover:bg-white/20 transition-colors ${currentCityName && city.toLowerCase() === currentCityName.toLowerCase() ? 'active' : ''}`}
                    >
                        {city}
                    </button>
                    <button 
                        onClick={() => onRemoveFavorite(city)}
                        title={`Remove ${city}`} 
                        className="p-2 hover:bg-red-500/50 rounded-r-full transition-colors"
                    >
                        <Icon name="X" className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
