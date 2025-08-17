
import React from 'react';
import type { WeatherData, ExchangeData } from '../types';
import { CURRENCY_MAP } from '../constants';
import { Icon, WeatherIcon } from './Icon';

interface WeatherDisplayProps {
    weatherData: WeatherData;
    exchangeData: ExchangeData;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

const HourlyForecast: React.FC<{ list: WeatherData['list'] }> = ({ list }) => (
    <div className="flex justify-around text-center">
        {list.slice(0, 4).map((item, index) => (
            <div key={index} className="flex-1">
                <p className="text-sm font-bold opacity-80">
                    {new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                </p>
                <WeatherIcon code={item.weather[0].icon} className="w-7 h-7 mx-auto my-1.5 text-white/90" />
                <p className="font-semibold">{Math.round(item.main.temp)}°</p>
            </div>
        ))}
    </div>
);

const DailyForecast: React.FC<{ list: WeatherData['list'] }> = ({ list }) => {
    const dailyForecasts: { [key: string]: { temps: number[]; icons: string[] } } = {};

    list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('ko-KR', { weekday: 'short', month: 'numeric', day: 'numeric' });
        if (!dailyForecasts[date]) dailyForecasts[date] = { temps: [], icons: [] };
        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].icons.push(item.weather[0].icon);
    });

    return (
        <div className="grid grid-cols-5 gap-1 text-center">
            {Object.entries(dailyForecasts).slice(0, 5).map(([day, data]) => {
                const high = Math.round(Math.max(...data.temps));
                const low = Math.round(Math.min(...data.temps));
                const representativeIcon = data.icons[Math.floor(data.icons.length / 2)] || data.icons[0];
                return (
                    <div key={day} className="forecast-day rounded-lg p-2 flex flex-col items-center gap-1">
                        <p className="font-bold text-sm">{day.split(' ')[0]} {day.split(' ')[1]}</p>
                        <WeatherIcon code={representativeIcon} className="w-7 h-7 my-1 text-white/90" />
                        <p className="text-sm"><span className="font-bold">{high}°</span> / {low}°</p>
                    </div>
                );
            })}
        </div>
    );
};

const ExchangeRate: React.FC<{ country: string; data: ExchangeData }> = ({ country, data }) => {
    const currency = CURRENCY_MAP[country];
    const exchangeRate = currency ? data.conversion_rates[currency] : null;

    if (!currency || currency === 'KRW' || !exchangeRate) {
        return null;
    }

    const rateInKRW = 1 / exchangeRate;
    const flagCode = currency === 'EUR' ? 'eu' : country.toLowerCase();

    return (
        <div className="card rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Icon name="BarChart2" className="w-6 h-6 text-sky-400" />
                <span>Exchange Rate ({currency}/KRW)</span>
            </h2>
            <div className="flex items-center justify-center gap-4 text-xl sm:text-2xl font-bold">
                <span className="flex items-center gap-2">
                    <span>1 {currency}</span>
                    <img src={`https://flagcdn.com/h20/${flagCode}.png`} alt={`${currency} flag`} className="h-6 w-auto rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </span>
                <span>=</span>
                <span className="flex items-center gap-2">
                    <span>{rateInKRW.toFixed(2)} KRW</span>
                    <img src="https://flagcdn.com/h20/kr.png" alt="South Korea flag" className="h-6 w-auto rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </span>
            </div>
            <p className="text-right text-xs mt-3 opacity-70">Last Updated: {new Date(data.time_last_update_utc).toLocaleString()}</p>
        </div>
    );
};

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, exchangeData, isFavorite, onToggleFavorite }) => {
    const current = weatherData.list[0];

    return (
        <>
            <div className="card rounded-2xl p-4 sm:p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <img src={`https://flagcdn.com/w40/${weatherData.city.country.toLowerCase()}.png`} alt={`${weatherData.city.country} flag`} className="w-10 h-auto rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <h1 className="text-2xl sm:text-3xl font-bold">{weatherData.city.name}</h1>
                        <button onClick={onToggleFavorite} title="Toggle Favorite" className="p-2 rounded-full hover:bg-white/20 transition-colors">
                            <Icon name="Star" className={`w-6 h-6 transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/80'}`} />
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-5xl sm:text-6xl font-bold">{Math.round(current.main.temp)}°C</p>
                        <p className="text-lg sm:text-xl opacity-90 mt-1 capitalize">{current.weather[0].description}</p>
                    </div>
                </div>
                <div className="mt-4 border-t border-white/20 pt-3">
                    <HourlyForecast list={weatherData.list} />
                </div>
            </div>

            <div className="card rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Icon name="CalendarDays" className="w-6 h-6 text-sky-400" />
                    <span>5-Day Forecast</span>
                </h2>
                <DailyForecast list={weatherData.list} />
            </div>
            
            <ExchangeRate country={weatherData.city.country} data={exchangeData} />
        </>
    );
};
