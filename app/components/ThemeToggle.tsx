"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    const body = document.body;
    
    if (dark) {
      html.classList.add("dark");
      body.classList.add("dark");
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dark = e.target.checked;
    setIsDark(dark);
    applyTheme(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <label className="switch">
        <input
          className="cb"
          type="checkbox"
          checked={isDark}
          onChange={handleToggle}
          aria-label="Toggle dark mode"
        />
        <span className="toggle">
          <span className="left">off</span>
          <span className="right">on</span>
        </span>
      </label>
    </div>
  );
}

