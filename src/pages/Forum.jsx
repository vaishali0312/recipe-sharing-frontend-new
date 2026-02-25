import { useState } from "react";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const addPost = () => {
    if (!text) return;
    setPosts([{ text, date: new Date() }, ...posts]);
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Community Forum</h1>

      <textarea
        className="w-full border p-3 rounded"
        placeholder="Share tips or ask questions..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={addPost}
        className="bg-primary text-white px-6 py-2 mt-3 rounded"
      >
        Post
      </button>

      <div className="mt-6 space-y-4">
        {posts.map((p, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <p>{p.text}</p>
            <span className="text-sm opacity-60">
              {p.date.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}