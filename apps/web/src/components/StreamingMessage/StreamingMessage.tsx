import { useEffect, useState } from "react";

export function StreamingMessage({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 10); 

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}