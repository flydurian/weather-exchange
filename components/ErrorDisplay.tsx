
import React from 'react';

interface ErrorDisplayProps {
    message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
    <div className="card rounded-2xl p-6 text-center text-red-400 font-bold">
        {message}
    </div>
);
