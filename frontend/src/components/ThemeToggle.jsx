import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
 <button
  className="theme-toggle"
  onClick={toggleTheme}
>
  {theme === "dark"
    ? <FiSun />
    : <FiMoon />}
</button>
  );
}

export default ThemeToggle;