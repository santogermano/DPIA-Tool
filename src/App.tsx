import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { DPIAEditor } from "./pages/DPIAEditor";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./components/ui/button";

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("dpia.theme") === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("dpia.theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <Button variant="ghost" size="icon" className="fixed top-2 right-2 z-50" onClick={() => setDark(d => !d)}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dpia/:id" element={<DPIAEditor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
