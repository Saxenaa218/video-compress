"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { PenSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  partner: {
    id: string;
    username: string;
    name?: string;
    image?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Messages</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <PenSquare size={24} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-48 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <Link
                key={conv.partner.id}
                href={`/messages/${conv.partner.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {conv.partner.image ? (
                    <img
                      src={conv.partner.image}
                      alt={conv.partner.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-gray-500">
                      {conv.partner.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold" : ""}`}>
                    {conv.partner.username}
                  </p>
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-black" : "text-gray-500"}`}>
                    {conv.lastMessage.content} ·{" "}
                    {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
              <PenSquare size={40} />
            </div>
            <h3 className="text-xl font-light mb-2">Your messages</h3>
            <p className="text-gray-500 mb-4">
              Send private photos and messages to a friend or group
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors">
              Send message
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
