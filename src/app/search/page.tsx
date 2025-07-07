import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import React, { useState } from "react";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";

function getAllContent() {
  const types = [
    { dir: "thoughts", type: "Thought" },
    { dir: "posts", type: "Post" },
  ];
  let all = [];
  for (const { dir, type } of types) {
    const fullDir = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullDir)) continue;
    const files = fs.readdirSync(fullDir);
    for (const file of files) {
      const filePath = path.join(fullDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      all.push({
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        date: data.date,
        author: data.author,
        type,
        excerpt: content.slice(0, 120) + (content.length > 120 ? "..." : ""),
      });
    }
  }
  return all;
}

export default function SearchPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [query, setQuery] = useState("");
  const allContent = getAllContent();
  const results = query
    ? allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className={darkMode ? "min-h-screen bg-[#18191a] text-white font-sans" : "min-h-screen bg-white text-black font-sans"}>
      <header className="flex justify-between items-center py-6 px-4 max-w-4xl mx-auto">
        <div className="text-2xl font-bold flex items-center gap-2 cursor-pointer" onClick={() => setDarkMode((prev) => !prev)} title="Toggle dark mode">
          Aaron Zhang {darkMode ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
        </div>
        <nav className="space-x-6 text-lg font-medium">
          <Link href="/posts" className="hover:underline">Posts</Link>
          <Link href="/thoughts" className="hover:underline">Thoughts</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
        </nav>
      </header>
      <section className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className={darkMode ? "bg-[#232425]" : "bg-gray-100"} style={{ borderRadius: 16, boxShadow: "0 4px 32px rgba(0,0,0,0.15)", padding: 32, minWidth: 400, maxWidth: "90%" }}>
          <div className="flex items-center gap-3 mb-4">
            <FaSearch className="text-2xl text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search all content..."
              className={darkMode ? "bg-[#232425] text-white placeholder-gray-400 outline-none w-full text-lg" : "bg-gray-100 text-black placeholder-gray-500 outline-none w-full text-lg"}
              style={{ border: "none" }}
              autoFocus
            />
          </div>
          <div className="mt-4">
            {results.length === 0 && query && (
              <div className="text-gray-400 text-center">No results found.</div>
            )}
            {results.map((item) => (
              <Link
                key={item.type + item.slug}
                href={`/${item.type === "Post" ? "posts" : "thoughts"}/${item.slug}`}
                className={darkMode ? "block p-4 rounded-lg hover:bg-[#333] mb-2" : "block p-4 rounded-lg hover:bg-gray-200 mb-2"}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{item.title}</span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-600 text-white ml-2">{item.type}</span>
                </div>
                <div className="text-sm text-gray-400 mb-1">Date: {item.date} | Author: {item.author}</div>
                <div className="text-gray-300 text-sm">{item.excerpt}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 