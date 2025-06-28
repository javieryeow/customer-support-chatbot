"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot"; isTyping?: boolean }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // auto-scroll down to latest message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: input, sender: "user", isTyping: false },
    ]); // add user query to chat
    setMessages((prev) => [
      ...prev,
      { text: "typing...", sender: "bot", isTyping: true }, // adds the typing animation while waiting for bot response
    ]);
    setInput(""); // clear textbox after sending message
    setLoading(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: input }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const token = decoder.decode(value, { stream: true });
        fullText += token;

        // append streamed tokens to bot response
        setMessages((prev) => {
          const updatedMessages = [...prev];

          const lastBotIndex = [...updatedMessages] // manage indexing of bot messages to prevent removing user message
            .reverse()
            .findIndex((msg) => msg.sender === "bot");

          const botIndex =
            lastBotIndex !== -1
              ? updatedMessages.length - 1 - lastBotIndex
              : -1;

          if (botIndex !== -1) {
            updatedMessages[botIndex] = {
              ...updatedMessages[botIndex],
              text: fullText,
              sender: "bot",
              isTyping: false,
            };
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      // error catching
      console.error("Error:", error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const botIndex = updatedMessages.findIndex(
          (msg) => msg.sender === "bot" && msg.isTyping
        );
        if (botIndex !== -1) {
          updatedMessages[botIndex] = {
            text: "Error fetching response",
            sender: "bot",
            isTyping: false,
          };
        }

        return updatedMessages;
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-screen p-10 bg-white">
      <header className="text-center text-xl font-semibold py-4 border-b bg-blue-500 rounded-lg text-white shadow-md">
        DeviceCare Customer Support
      </header>

      {/* chat container */}
      <div
        ref={chatContainerRef}
        className="flex flex-col flex-grow overflow-y-auto border border-gray-300 p-6 rounded-lg bg-gray-100"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            What would you like to know about DeviceCare?
          </div>
        ) : (
          messages.map((message, idx) => (
            <ChatBubble
              key={idx}
              text={message.text}
              sender={message.sender}
              isTyping={message.isTyping}
            />
          ))
        )}
      </div>

      {/* text box */}
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow border p-2 rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query..."
        />
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
