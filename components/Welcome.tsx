
import React from 'react';

export const Welcome: React.FC = () => (
    <div className="card rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
        <p>Search for a city or click a favorite to check the weather.</p>
        <p className="text-sm mt-4 opacity-70">Please ensure API keys are configured correctly in the application.</p>
    </div>
);
