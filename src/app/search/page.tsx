"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Search, X } from "lucide-react";

interface User {
  id: string;
  username: string;
  name?: string;
  image?: string;
  followersCount: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRecent, setShowRecent] = useState(true);

  const searchUsers = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        searchUsers(query);
        setShowRecent(false);
      } else {
        setUsers([]);
        setShowRecent(true);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchUsers]);

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Search</h1>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg text-sm outline-none focus:bg-gray-200 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : showRecent ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent</h2>
              <button className="text-blue-500 text-sm font-semibold">Clear all</button>
            </div>
            <p className="text-gray-500 text-sm text-center py-8">No recent searches.</p>
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-500">
                      {user.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.username}</p>
                  <p className="text-gray-500 text-sm truncate">
                    {user.name || user.username} • {user.followersCount} followers
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : query.length >= 2 ? (
          <p className="text-gray-500 text-sm text-center py-8">No results found.</p>
        ) : null}
      </div>
    </MainLayout>
  );
}
