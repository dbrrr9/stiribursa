import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("ms_theme", next ? "dark" : "light");
    } catch {}
  };

  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Activează modul luminos" : "Activează modul întunecat"}
      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
