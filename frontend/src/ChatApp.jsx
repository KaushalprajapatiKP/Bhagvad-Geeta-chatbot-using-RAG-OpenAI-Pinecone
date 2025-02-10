import { useState } from "react";
import Sidebar from "./components/SideBar";
import ChatScreen from "./components/ChatScreen";

export default function ChatApp() {
  const [apiSettings, setApiSettings] = useState({
    apiKey: "",
    temperature: 0.7,
    tokenLimit: 150,
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar - Can update API settings */}
      <Sidebar apiSettings={apiSettings} setApiSettings={setApiSettings} />

      {/* ChatScreen - Uses API settings */}
      <ChatScreen apiSettings={apiSettings} />
    </div>
  );
}


