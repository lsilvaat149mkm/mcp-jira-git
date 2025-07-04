
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const TypingAnimation = ({ text, onComplete, renderAs = 'text' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      intervalRef.current = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // Adjust speed here (lower = faster)
    } else if (onComplete) {
      onComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentIndex, text, onComplete]);

  // Render based on the specified type
  switch (renderAs) {
    case 'markdown':
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {displayedText}
        </ReactMarkdown>
      );
    case 'text':
    default:
      return <div style={{ whiteSpace: "pre-wrap" }}>{displayedText}</div>;
  }
};

export default TypingAnimation;