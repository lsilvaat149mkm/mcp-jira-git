import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Image } from "antd"
import { useTranslation } from "react-i18next";
import TypingAnimation from "./TypingAnimation";
import "./ai-assistant-drawer.css"

const ChatMessageRenderer = ({ message, messageIndex, onTypingComplete }) => {
  const { t } = useTranslation("ai")
  const { role, answer_type, answer, isTyping = false } = message

  const containerClass = `chat-message ${
    role === "user" ? "chat-message--user" : "chat-message--assistant"
  }`

  const bubbleClass = `chat-message__bubble ${
    role === "user"
      ? "chat-message__bubble--user"
      : "chat-message__bubble--assistant"
  }`

  const handleTypingComplete = () => {
    if (onTypingComplete && messageIndex !== undefined) {
      onTypingComplete(messageIndex);
    }
  };

  let inner
  
  // Only apply typing animation to assistant messages with text or markdown content
  if (role === 'assistant' && isTyping && (answer_type === 'text' || answer_type === 'markdown')) {
    inner = (
      <TypingAnimation
        text={answer}
        onComplete={handleTypingComplete}
        renderAs={answer_type}
      />
    );
  } else {
    // Regular rendering for completed messages or non-text content
    switch (answer_type) {
      case "text":
        inner = <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>
        break

      case "markdown":
        inner = (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        )
        break

      case "image":
        inner = (
          <Image
            src={answer}
            alt="AI generated"
            style={{ maxWidth: "100%", margin: "16px 0" }}
          />
        )
        break

      case "file":
        inner = (
          <a href={answer.url} download={answer.name}>
            {t("Download")} {answer.name}
          </a>
        )
        break

      default:
        inner = <div>{t("Unsupported message type:")} {answer_type}</div>
    }
  }

  return (
    <div className={containerClass}>
      <div className={bubbleClass}>{inner}</div>
    </div>
  )
}

export default ChatMessageRenderer