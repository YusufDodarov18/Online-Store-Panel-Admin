import "./loading.css"
import { useEffect, useState } from "react";
import fastCartDark from "./img1.png"
import fastCartLight from "./img2.png";
import { useTheme } from "../theme/themeContext";

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const { theme } = useTheme()

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotInterval);
    };
  }, []);

  return (
    <div className={`loading-screen ${theme=="dark"?"dark":""}`}>
      <div className="relative mb-10">
        <div className="loading-glow absolute -inset-10 rounded-full" />
          <div className="relative loading-cart-group">
            <svg width="90" height="80" viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L16 6L18 12L26 48H66L76 18H24" className="loading-cart-path"/>
              <path d="M26 48L22 18" className="loading-cart-path" style={{ animationDelay: "0.3s" }}/>
              <line x1="32" y1="26" x2="48" y2="26" className="loading-speed-line loading-speed-1" />
              <line x1="30" y1="33" x2="52" y2="33" className="loading-speed-line loading-speed-2" />
              <line x1="34" y1="40" x2="44" y2="40" className="loading-speed-line loading-speed-3" />
              <circle cx="32" cy="60" r="7" className="loading-wheel" style={{ transformOrigin: "32px 60px" }} />
              <circle cx="60" cy="60" r="7" className="loading-wheel" style={{ transformOrigin: "60px 60px" }} />
              <circle cx="32" cy="60" r="2.5" className="loading-wheel-center" />
              <circle cx="60" cy="60" r="2.5" className="loading-wheel-center" />
          </svg>
        </div>
        <div className="loading-sparkle loading-sparkle-1 absolute -top-1 -right-1 w-2 h-2 rounded-full" />
        <div className="loading-sparkle loading-sparkle-2 absolute top-6 -right-4 w-1.5 h-1.5 rounded-full" />
        <div className="loading-sparkle loading-sparkle-3 absolute -top-2 right-8 w-1 h-1 rounded-full" />
      </div>
      <h2 className="loading-brand-text mb-8 mt-5">FATS CARD</h2>
      <div className="loading-track">
        <div className="loading-bar" style={{ width: `${progress}%` }}/>
      </div>
      <p className="loading-status-text mt-4">Загрузка{".".repeat(dotCount)}</p>
    </div>
  );
};

export default Loading;