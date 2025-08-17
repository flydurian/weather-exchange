
import React from 'react';

export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
    </div>
);
