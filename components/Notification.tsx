
import React from 'react';

interface NotificationProps {
    message: string;
    type: 'info' | 'error';
    visible: boolean;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, visible }) => {
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    const visibilityClasses = visible ? 'bottom-5 opacity-100' : '-bottom-20 opacity-0';

    return (
        <div className={`fixed left-1/2 -translate-x-1/2 text-white px-5 py-3 rounded-lg shadow-lg transition-all duration-500 ${bgColor} ${visibilityClasses}`}>
            {message}
        </div>
    );
};
