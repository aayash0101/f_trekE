import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <button
      className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}
