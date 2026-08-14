"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark"); // Default premium dark
  const pathname = usePathname();

  // If we are on /music, force spotify theme, else respect user's toggle
  useEffect(() => {
    if (pathname && pathname.startsWith("/music")) {
      document.documentElement.setAttribute("data-theme", "spotify");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
