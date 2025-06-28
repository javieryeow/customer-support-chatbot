import React from "react";

interface MessageInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  sendMessage,
  loading,
}) => {
  return (
    <div className="p-4 bg-white border-t border-gray-300 w-full">
      <div className="flex items-center gap-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg bg-white text-black border border-gray-400 focus:outline-none focus:border-blue-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query here..."
          disabled={loading}
        />
        <button
          className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
