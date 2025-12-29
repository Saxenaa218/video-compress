"use client";

import { useState } from "react";

interface VoteItem {
  id: number;
  name: string;
  votes: number;
}

const initialItems: VoteItem[] = [
  { id: 1, name: "React", votes: 0 },
  { id: 2, name: "Vue", votes: 0 },
  { id: 3, name: "Angular", votes: 0 },
  { id: 4, name: "Svelte", votes: 0 },
];

export default function Home() {
  const [items, setItems] = useState<VoteItem[]>(initialItems);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
    setHasVoted(true);
  };

  const totalVotes = items.reduce((sum, item) => sum + item.votes, 0);

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <main className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🗳️ Voting App
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Vote for your favorite JavaScript framework!
        </p>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative bg-gray-100 rounded-lg overflow-hidden"
            >
              {hasVoted && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-30 transition-all duration-500"
                  style={{ width: `${getPercentage(item.votes)}%` }}
                />
              )}
              <div className="relative flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-800">
                    {item.name}
                  </span>
                  {hasVoted && (
                    <span className="text-sm text-gray-600">
                      {item.votes} votes ({getPercentage(item.votes)}%)
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleVote(item.id)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasVoted && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-center text-gray-700 font-medium">
              Total Votes: {totalVotes}
            </p>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          Click on any item to cast your vote
        </p>
      </main>
    </div>
  );
}
