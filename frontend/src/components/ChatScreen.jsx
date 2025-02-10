import { useState } from "react";
import ChatMessage from "./ChatMessage";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ChatScreen({ apiSettings }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");

  async function sendMessage() {
    if (!apiSettings.openAIapiKey) {
      alert("Please enter an OpenAI API key.");
      return;
    }

    const newMessage = { role: "user", content: `You🙏: ${input}` };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/ask_krishna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: localStorage.getItem("session_id") || null,
          message: input,
          language: language,
          apiKey: apiSettings.openAIapiKey,
          temperature: apiSettings.temperature,
          max_tokens: apiSettings.tokenLimit,
          model: apiSettings.selectedModel,
        }),
      });

      const data = await response.json();
      if (data.session_id) {
        localStorage.setItem("session_id", data.session_id);
      }

      if (data.response) {
        const botReply = { role: "assistant", content: `✨Krishna✨: ${data.response}` };
        setMessages([...updatedMessages, botReply]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen p-2 bg-gray-900 text-white overflow-y-auto">
      {/* Animated Heading (Now Scrollable) */}
      <motion.div 
        className=" text-center py-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex justify-center space-x-4 text-5xl">
          <span>🤖</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text drop-shadow-lg mt-2">
          KaushalAI 
        </h1>
        <h2 className="text-2xl font-semibold text-gray-300">Bhagavad Gita Chatbot</h2>
        <p className="text-sm text-gray-400 italic mt-2">"Chat with Krishna, Anytime."</p>
      </motion.div>

      {/* Language Selector (Right-aligned) */}
      <div className="absolute top-2 right-4">
        <label className="text-gray-300 mr-2">🌍</label>
        <select
          className="bg-gray-700 text-white p-2 rounded-lg"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">EN English</option>
          <option value="hi">🇮🇳 हिन्दी</option>
          <option value="bn">🇧🇩 বাংলা</option>
          <option value="mr">🇮🇳 मराठी</option>
          <option value="te">🇮🇳 తెలుగు</option>
          <option value="ta">🇮🇳 தமிழ்</option>
          <option value="gu">🇮🇳 ગુજરાતી</option>
          <option value="ur">🇵🇰 اردو</option>
          <option value="kn">🇮🇳 ಕನ್ನಡ</option>
          <option value="or">🇮🇳 ଓଡ଼ିଆ</option>
          <option value="pa">🇮🇳 ਪੰਜਾਬੀ</option>
          <option value="zh">🇨🇳 中文</option>
          <option value="es">🇪🇸 Español</option>
          <option value="pt">🇵🇹 Português</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="ja">🇯🇵 日本語</option>
          <option value="ko">🇰🇷 한국어</option>
          <option value="ar">🇸🇦 العربية</option>
        </select>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.length === 0 && <p className="text-gray-500 text-center">Start a conversation!</p>}
        {messages.map((msg, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatMessage message={msg} />
          </motion.div>
        ))}
      </div>

      {/* Input Box & Send Button */}
      <div className="flex mt-4 p-2 bg-gray-800 rounded-lg shadow-md">
        <motion.input
          type="text"
          className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          onClick={sendMessage}
          className="ml-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none transition flex items-center"
          whileTap={{ scale: 0.9 }}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
