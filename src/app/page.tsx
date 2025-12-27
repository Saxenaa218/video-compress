import ChatBot from "@/components/ChatBot";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-3xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            ChatBot
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your friendly AI assistant
          </p>
        </div>
        <ChatBot />
      </main>
    </div>
  );
}
