import { useState, useRef, useEffect } from "react";
import { commandsData } from "@/data/commands";
import LetterGlitch from "./ui/LetterGlitch";

interface TerminalLine {
  type: "input" | "output";
  content: string;
}

export const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "output", content: "welcome" },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Touch gesture state
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    handleCommand("startup");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeOutput = (text: string) => {
    return new Promise<string>((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        setHistory((prev) => {
          const newHistory = [...prev];
          const last = newHistory[newHistory.length - 1];
          if (last && last.type === "output") {
            last.content = text.slice(0, i + 1);
          }
          return newHistory;
        });
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve(text);
        }
      }, 25);
    });
  };

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    const newHistory: TerminalLine[] = [
      ...history,
      { type: "input", content: cmd },
    ];

    if (trimmedCmd === "clear") {
      setHistory([]);
      return;
    }

    const command = commandsData[trimmedCmd];
    if (command) {
      newHistory.push({ type: "output", content: "" });
      setHistory(newHistory);
      await typeOutput(command);
    } else {
      const errorMsg = `❌ Command not found: ${trimmedCmd}\n👉 Type 'help' to see available commands.`;
      newHistory.push({ type: "output", content: "" });
      setHistory(newHistory);
      await typeOutput(errorMsg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      handleCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory("down");
    }
  };

  // Function for navigating command history
  const navigateHistory = (direction: "up" | "down") => {
    if (commandHistory.length === 0) return;

    if (direction === "up") {
      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (direction === "down") {
      if (historyIndex !== -1) {
        const newIndex = Math.min(
          commandHistory.length - 1,
          historyIndex + 1
        );
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  // Touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY.current - touchEndY;

    if (Math.abs(diffY) > 40) {
      // swipe up
      if (diffY > 0) {
        navigateHistory("up");
      } else {
        navigateHistory("down");
      }
    }
    touchStartY.current = null;
  };

  return (
    <div
      className="relative w-full h-[70vh] md:h-[80vh] font-mono text-xs sm:text-sm md:text-base 
      cursor-text rounded-xl overflow-hidden border border-terminal-glow/30 
      shadow-[0_0_40px_rgba(0,255,0,0.2)] bg-terminal-bg/80 backdrop-blur-sm"
      onClick={() => inputRef.current?.focus()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-terminal-border/40 bg-terminal-bg/60">
        <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(255,0,0,0.8)]"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(255,255,0,0.8)]"></span>
        <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(0,255,0,0.8)]"></span>
        <span className="ml-3 text-xs sm:text-sm text-terminal-text/70">
          minhal@portfolio
        </span>
      </div>

      {/* Glitch Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <LetterGlitch
          glitchSpeed={40}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          glitchColors={["#00FF00", "#FF00FF", "#00FFFF"]}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        />
      </div>

      {/* Scrollable Area */}
      <div className="relative z-10 h-full overflow-y-auto p-3 sm:p-4 custom-scroll">
        <div className="max-w-4xl space-y-2">
          {/* Quick Help Bar */}
          <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs text-terminal-text/70 pb-3 border-b border-terminal-border/40">
            {["help", "about", "projects", "skills", "contact", "education", "sudo", "clear"].map((cmd) => (
              <span
                key={cmd}
                className="px-2 py-1 bg-terminal-border/10 rounded cursor-pointer hover:bg-terminal-border/20 transition"
                onClick={() => handleCommand(cmd)}
              >
                {cmd}
              </span>
            ))}
          </div>

          {/* History */}
          {history.map((line, index) => (
            <div key={index}>
              {line.type === "input" ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-green-400 font-bold drop-shadow-[0_0_6px_rgba(0,255,0,0.8)]">
                    minhal@portfolio:~$
                  </span>
                  <span className="text-terminal-text break-words">{line.content}</span>
                </div>
              ) : (
                <pre className="text-terminal-text whitespace-pre-wrap pl-4 break-words">
                  {line.content}
                </pre>
              )}
            </div>
          ))}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
            <span className="text-green-400 font-bold drop-shadow-[0_0_6px_rgba(0,255,0,0.8)]">
              minhal@portfolio:~$
            </span>
            <div className="relative flex-1 min-w-[120px]">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute left-0 top-0 w-full h-full opacity-0"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <span className="text-terminal-text break-words">
                {input}
                <span className="animate-pulse">▊</span>
              </span>
            </div>
          </form>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
