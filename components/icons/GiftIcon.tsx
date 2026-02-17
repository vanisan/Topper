
import React from 'react';

const GiftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 006.375 8.25v2.25c0 .921.39 1.766 1.033 2.386l3.6 3.023a.75.75 0 00.934 0l3.6-3.023A3.75 3.75 0 0017.625 10.5v-2.25A3.375 3.375 0 0012 4.875z"
        />
    </svg>
);

export default GiftIcon;
