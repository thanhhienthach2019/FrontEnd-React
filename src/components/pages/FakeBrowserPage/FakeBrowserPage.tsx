import React from 'react';

interface FakeBrowserPageProps {
    height?: number;  
    className?: string; 
    children: React.ReactNode; 
}

const FakeBrowserPage: React.FC<FakeBrowserPageProps> = ({ height, className = '', children }) => {
    return (
        <div className={`fake-browser ${className}`} style={{ height: height || '100%' }}>
            <div className="fake-browser-header">
                <div className="fake-browser-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                </div>
            </div>
            <div className="fake-browser-content">
                {children}
            </div>
        </div>
    );
};

export default FakeBrowserPage;
