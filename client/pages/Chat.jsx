import { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory } from '../src/api/chatApi';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    getChatHistory()
      .then((res) => setMessages(res.data))
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    // Show the user's message immediately, don't wait for the AI reply
    const userMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const res = await sendMessage(trimmed);
      const aiMessage = { role: 'assistant', content: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  if (loadingHistory) {
    return <div className="p-8 text-center text-gray-500">Loading conversation...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-2xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-lg font-medium">Career Assistant</p>
            <p className="text-sm mt-1">Ask me about your skills, roadmap, or job matches.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 px-4 py-2 rounded-2xl rounded-bl-sm shadow text-sm">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t bg-white p-4 flex gap-2 max-w-2xl w-full mx-auto"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your career..."
          disabled={sending}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;