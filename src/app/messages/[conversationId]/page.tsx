"use client";

import { useState, useEffect, useRef, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Send, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    image?: string;
  };
}

interface Partner {
  id: string;
  username: string;
  name?: string;
  image?: string;
}

export default function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId: partnerId } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchPartner();
  }, [partnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPartner = async () => {
    try {
      // Get partner info from users who we have messages with
      const response = await fetch(`/api/messages`);
      if (response.ok) {
        const conversations = await response.json();
        const conv = conversations.find((c: { partner: Partner }) => c.partner.id === partnerId);
        if (conv) {
          setPartner(conv.partner);
        }
      }
    } catch (error) {
      console.error("Failed to fetch partner:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${partnerId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/messages/${partnerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto h-[calc(100vh-3.5rem)] md:h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
          <Link href="/messages" className="p-1 md:hidden">
            <ArrowLeft size={24} />
          </Link>
          {partner && (
            <Link href={`/profile/${partner.username}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {partner.image ? (
                  <img
                    src={partner.image}
                    alt={partner.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-500">
                    {partner.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{partner.username}</p>
                <p className="text-gray-500 text-xs">Active now</p>
              </div>
            </Link>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <div className="max-w-[70%] animate-pulse">
                    <div className="w-48 h-10 bg-gray-200 rounded-2xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => {
              const isOwn = message.sender.id === session?.user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? "" : "flex gap-2"}`}>
                    {!isOwn && (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 self-end">
                        {message.sender.image ? (
                          <img
                            src={message.sender.image}
                            alt={message.sender.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-500">
                            {message.sender.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {message.imageUrl && (
                        <img
                          src={message.imageUrl}
                          alt="Shared image"
                          className="max-w-full rounded-lg mb-2"
                        />
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages yet. Start a conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 p-4 border-t border-gray-200 bg-white"
        >
          <button type="button" className="text-gray-500 hover:text-gray-700">
            <ImageIcon size={24} />
          </button>
          <input
            type="text"
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="text-blue-500 font-semibold disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
