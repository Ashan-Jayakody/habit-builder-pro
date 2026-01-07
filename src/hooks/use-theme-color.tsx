import * as React from "react";

export type ThemeColor = "coral" | "amber" | "green" | "purple" | "blue";

interface ThemeContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const themeColors: Record<ThemeColor, { primary: string; ring: string }> = {
  coral: { primary: "16 85% 60%", ring: "16 85% 60%" },
  amber: { primary: "28 95% 65%", ring: "28 95% 65%" },
  green: { primary: "142 70% 45%", ring: "142 70% 45%" },
  purple: { primary: "280 60% 65%", ring: "280 60% 65%" },
  blue: { primary: "210 80% 55%", ring: "210 80% 55%" },
};

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = React.useState<ThemeColor>(() => {
    const saved = localStorage.getItem("theme-color");
    return (saved as ThemeColor) || "coral";
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    const colors = themeColors[themeColor];
    
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--ring", colors.ring);
    
    localStorage.setItem("theme-color", themeColor);
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeColor = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useThemeColor must be used within ThemeColorProvider");
  return context;
};
