import React, { useEffect, useRef, useState } from "react";

interface TypingTextProps {
  text: string;
  preDelay?: number; // ms to show a typing indicator before starting
  speed?: number; // ms per character
  className?: string;
  onDone?: () => void;
  clickToSkip?: boolean;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  preDelay = 0,
  speed = 30,
  className,
  onDone,
  clickToSkip = true,
}) => {
  const [phase, setPhase] = useState<"pre" | "typing" | "done">(
    preDelay > 0 ? "pre" : "typing"
  );
  const [display, setDisplay] = useState<string>("");
  const timerRef = useRef<number | null>(null);
  const idxRef = useRef<number>(0);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Reset when the text changes
  useEffect(() => {
    clearTimer();
    setDisplay("");
    idxRef.current = 0;
    setPhase(preDelay > 0 ? "pre" : "typing");

    if (preDelay > 0) {
      timerRef.current = window.setTimeout(() => setPhase("typing"), preDelay);
    }

    return () => clearTimer();
  }, [text, preDelay]);

  // Typing loop
  useEffect(() => {
    if (phase !== "typing") return;

    const tick = () => {
      const i = idxRef.current;
      if (i >= text.length) {
        setPhase("done");
        onDone?.();
        return;
      }
      setDisplay((prev) => prev + text.charAt(i));
      idxRef.current = i + 1;
      timerRef.current = window.setTimeout(tick, speed);
    };

    timerRef.current = window.setTimeout(tick, speed);
    return () => clearTimer();
  }, [phase, speed, text, onDone]);

  const handleClick = () => {
    if (!clickToSkip) return;
    if (phase !== "done") {
      clearTimer();
      setDisplay(text);
      setPhase("done");
      onDone?.();
    }
  };

  return (
    <div
      className={className}
      onClick={handleClick}
      role={clickToSkip ? "button" : undefined}
      aria-label={clickToSkip ? "Skip typing" : undefined}
    >
      <span>{display}</span>
    </div>
  );
};

export default TypingText;
