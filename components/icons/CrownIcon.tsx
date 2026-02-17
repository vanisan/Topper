
import React from 'react';

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M13.28 3.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06l7.5-7.5a.75.75 0 011.06 0zm-3.53 3.53a.75.75 0 011.06 0l2.5 2.5a.75.75 0 01-1.06 1.06l-2.5-2.5a.75.75 0 010-1.06zm4.95-3.53a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 01-1.06-1.06l2.5-2.5a.75.75 0 011.06 0z"
    />
    <path d="M4.5 9.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zm15 0a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zm-6.75 0a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75A.75.75 0 0112.75 9.75z" />
    <path
      fillRule="evenodd"
      d="M3 13.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
    />
  </svg>
);

export default CrownIcon;
