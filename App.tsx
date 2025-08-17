
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { FavoritesBar } from './components/FavoritesBar';
import { Welcome } from './components/Welcome';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { WeatherDisplay } from './components/WeatherDisplay';
import { Notification } from './components/Notification';
import { getWeatherDataByCity, getReverseGeoData, getExchangeRateData } from './services/api';
import type { WeatherData, ExchangeData, NotificationState } from './types';
import { FAVORITES_KEY, MAX_FAVORITES } from './constants';

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentCity, setCurrentCity] = useState<{ name: string; country: string } | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [exchangeData, setExchangeData] = useState<ExchangeData | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<NotificationState>({ message: '', type: 'info', visible: false });

    const touchStartX = useRef<number>(0);

    const showNotification = (message: string, type: 'info' | 'error' = 'info') => {
        setNotification({ message, type, visible: true });
        setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
    };

    const fetchCityData = useCallback(async (identifier: string) => {
        setIsLoading(true);
        setError(null);
        setWeatherData(null);
        setExchangeData(null);

        try {
            const [weather, exchange] = await Promise.all([
                getWeatherDataByCity(identifier),
                getExchangeRateData(),
            ]);

            if (!weather || !weather.city || !weather.city.name) {
                throw new Error(`Could not find city information for '${identifier}'.`);
            }
            
            setCurrentCity({ name: weather.city.name, country: weather.city.country });
            setWeatherData(weather);
            setExchangeData(exchange);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
            showNotification(message, 'error');
            setCurrentCity(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            const items = localStorage.getItem(FAVORITES_KEY);
            const loadedFavorites = items ? JSON.parse(items) : ["Seoul", "Tokyo", "New York"];
            setFavorites(loadedFavorites);
            if (loadedFavorites.length > 0) {
                fetchCityData(loadedFavorites[0]);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error reading favorites from localStorage", error);
            const defaultFavorites = ["Seoul", "Tokyo", "New York"];
            setFavorites(defaultFavorites);
            fetchCityData(defaultFavorites[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchCityData]);

    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error("Error saving favorites to localStorage", error);
        }
    }, [favorites]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            fetchCityData(searchQuery.trim());
            setSearchQuery('');
        }
    };
    
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            showNotification("Geolocation is not supported by your browser.", "error");
            return;
        }
        showNotification("Fetching your current location...");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const geoData = await getReverseGeoData(latitude, longitude);
                    if (geoData) {
                        fetchCityData(geoData.name);
                    } else {
                        throw new Error("Could not determine city from your location.");
                    }
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Failed to get location.';
                    showNotification(errorMessage, 'error');
                }
            },
            () => showNotification("Please allow access to your location.", 'error')
        );
    };

    const toggleFavorite = (cityName: string) => {
        const capitalizedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        setFavorites(prev => {
            const isFav = prev.some(fav => fav.toLowerCase() === capitalizedCity.toLowerCase());
            if (isFav) {
                return prev.filter(fav => fav.toLowerCase() !== capitalizedCity.toLowerCase());
            } else {
                if (prev.length >= MAX_FAVORITES) {
                    showNotification(`You can only have up to ${MAX_FAVORITES} favorites.`, 'error');
                    return prev;
                }
                return [...prev, capitalizedCity];
            }
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (!currentCity || favorites.length < 2) return;
        
        const favIndex = favorites.findIndex(fav => fav.toLowerCase() === currentCity.name.toLowerCase());
        if (favIndex === -1) return; 

        const swipeDistance = touchEndX - touchStartX.current;
        if (Math.abs(swipeDistance) < 50) return; 

        if (swipeDistance < 0) { // Swiped left
            const nextIndex = (favIndex + 1) % favorites.length;
            fetchCityData(favorites[nextIndex]);
        } else { // Swiped right
            const prevIndex = (favIndex - 1 + favorites.length) % favorites.length;
            fetchCityData(favorites[prevIndex]);
        }
    };

    const renderMainContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorDisplay message={error} />;
        if (weatherData && exchangeData && currentCity) {
            const isFav = favorites.some(fav => fav.toLowerCase() === currentCity.name.toLowerCase());
            return (
                <WeatherDisplay 
                    weatherData={weatherData}
                    exchangeData={exchangeData}
                    isFavorite={isFav}
                    onToggleFavorite={() => toggleFavorite(currentCity.name)}
                />
            );
        }
        return <Welcome />;
    };
    
    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <SearchBar 
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onSearch={handleSearch}
                onGetCurrentLocation={handleGetCurrentLocation}
                onRefresh={() => currentCity && fetchCityData(currentCity.name)}
            />

            <FavoritesBar 
                favorites={favorites}
                currentCityName={currentCity?.name}
                onSelectFavorite={fetchCityData}
                onRemoveFavorite={toggleFavorite}
            />

            <div 
                className="space-y-4 sm:space-y-6 transition-opacity duration-300"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {renderMainContent()}
            </div>
            
            <Notification
                message={notification.message}
                type={notification.type}
                visible={notification.visible}
            />
        </div>
    );
}

export default App;
