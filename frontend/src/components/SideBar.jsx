export default function Sidebar({ apiSettings, setApiSettings }) {
  return (
    <div className="w-72 bg-gray-800 text-white p-6 flex flex-col space-y-4">
  
      {/* OpenAI API Key */}
      <label className="block text-sm">OpenAI API Key:</label>
      <input
  type="password"
  className="w-full p-2 rounded bg-gray-700"
  placeholder="Enter API Key"
  value={apiSettings.openAIapiKey || ""}  // ✅ Ensure consistent key name
  onChange={(e) => setApiSettings({ ...apiSettings, openAIapiKey: e.target.value })}  // ✅ Correct key name
/>

      {/* Temperature */}
      <label className="block text-sm">Temperature: {apiSettings.temperature}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        className="w-full cursor-pointer"
        value={apiSettings.temperature || 0.7}
        onChange={(e) => setApiSettings({ ...apiSettings, temperature: parseFloat(e.target.value) || 0.7 })}
      />

      {/* Token Limit */}
      <label className="block text-sm">Max Tokens:</label>
      <input
        type="number"
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Enter max tokens"
        value={apiSettings.maxTokens || 150}
        onChange={(e) => setApiSettings({ ...apiSettings, maxTokens: parseInt(e.target.value) || 150 })}
      />

      {/* Model Selection Dropdown */}
      <label className="block text-sm">Select Model:</label>
      <select
        className="w-full p-2 rounded bg-gray-700"
        value={apiSettings.selectedModel || "gpt-4"}
        onChange={(e) => setApiSettings({ ...apiSettings, selectedModel: e.target.value })}
      >
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        <option value="gpt-4-32k">GPT-4 32k Tokens</option>
        <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16k Tokens</option>
        <option value="gpt-3.5-turbo-instruct">GPT-3.5 Turbo (Instruct)</option>
        <option value="gpt-4-instruct">GPT-4 (Instruct)</option>
        <option value="gpt-4-vision">GPT-4 with Vision</option>
      </select>
    </div>
  );
}
