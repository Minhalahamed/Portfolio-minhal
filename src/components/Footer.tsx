import { useEffect, useState } from 'react';

export const Footer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  return (
    <footer className="border-t border-terminal-border bg-card/50 backdrop-blur-sm px-4 md:px-6 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto text-xs md:text-sm">
        <div className="text-terminal-text">
          <span className=" text-terminal-text terminal-glow"> minhal@portfolio:~$</span>
        </div>
        <div className="text-terminal-text terminal-glow">
          {formatTime(time)}
        </div>
      </div>
    </footer>
  );
};
