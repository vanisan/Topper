
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0ZM12 14.25a.75.75 0 0 1 .75-.75V3.75a.75.75 0 0 0-1.5 0v9.75a.75.75 0 0 1 .75.75Zm-3.75 0a.75.75 0 0 1 .75-.75V8.25a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 1 .75.75Zm7.5 0a.75.75 0 0 1 .75-.75V8.25a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 1 .75.75Z" />
    </svg>
);

export default TrophyIcon;
