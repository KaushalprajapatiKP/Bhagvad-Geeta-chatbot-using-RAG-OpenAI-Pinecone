export default function ChatMessage({ message }) {
    return (
      <div className={`p-3 rounded-lg max-w-lg ${message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"}`}>
        <p>{message.content}</p>
      </div>
    );
  }
  