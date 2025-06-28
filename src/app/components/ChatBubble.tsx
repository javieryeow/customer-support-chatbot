import React from "react";

interface ChatBubbleProps {
  text: string;
  sender: "user" | "bot";
  isTyping?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, sender, isTyping }) => {
  return (
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      } my-2`}
    >
      <div
        className={`px-4 py-2 mb-3 rounded-lg text-white w-fit ${
          sender === "user" ? "bg-blue-500 ml-auto" : "bg-gray-500"
        }`}
      >
        {isTyping ? ( // display typing animation
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : sender === "bot" ? (
          text
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
