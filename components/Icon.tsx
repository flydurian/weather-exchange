
import React from 'react';
import {
    Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy, CloudRain,
    CloudDrizzle, CloudLightning, Snowflake, Wind, HelpCircle, Search, MapPin, RotateCw, X, Star, BarChart2, CalendarDays
} from 'lucide-react';
import { ICON_MAP } from '../constants';

type IconName = keyof typeof iconComponents;

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
}

const iconComponents = {
    Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy, CloudRain,
    CloudDrizzle, CloudLightning, Snowflake, Wind, HelpCircle, Search, MapPin, RotateCw, X, Star, BarChart2, CalendarDays
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
    const LucideIcon = iconComponents[name as IconName] || HelpCircle;
    return <LucideIcon {...props} />;
};

export const WeatherIcon: React.FC<{ code: string; className?: string }> = ({ code, className }) => {
    const iconName = ICON_MAP[code] || 'HelpCircle';
    return <Icon name={iconName} className={className} />;
};
