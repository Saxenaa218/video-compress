import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  message: string;
}

const responses: Record<string, string[]> = {
  greeting: [
    "Hello! How can I assist you today?",
    "Hi there! What can I help you with?",
    "Hey! Great to hear from you. How can I help?",
  ],
  farewell: [
    "Goodbye! Have a great day!",
    "See you later! Take care!",
    "Bye! Feel free to come back anytime!",
  ],
  thanks: [
    "You're welcome! Is there anything else I can help with?",
    "Happy to help! Let me know if you need anything else.",
    "No problem! I'm here if you have more questions.",
  ],
  help: [
    "I'm here to help! You can ask me about anything, and I'll do my best to assist you.",
    "I can answer questions, provide information, or just chat. What would you like to know?",
    "I'm your friendly chatbot assistant. Feel free to ask me anything!",
  ],
  default: [
    "That's an interesting question! While I'm a simple chatbot, I'm here to help with basic queries.",
    "I understand you're asking about that. As a demo chatbot, I have limited knowledge but I'm happy to chat!",
    "Thanks for your message! I'm a simple chatbot demo, so my responses are limited, but I'm learning!",
    "Great question! This is a demo chatbot, so I can only provide basic responses for now.",
  ],
};

function getRandomResponse(category: keyof typeof responses): string {
  const options = responses[category];
  return options[Math.floor(Math.random() * options.length)];
}

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return getRandomResponse("greeting");
  }

  if (
    lowerMessage.includes("bye") ||
    lowerMessage.includes("goodbye") ||
    lowerMessage.includes("see you")
  ) {
    return getRandomResponse("farewell");
  }

  if (
    lowerMessage.includes("thank") ||
    lowerMessage.includes("thanks") ||
    lowerMessage.includes("appreciate")
  ) {
    return getRandomResponse("thanks");
  }

  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("what can you do") ||
    lowerMessage.includes("how do you work")
  ) {
    return getRandomResponse("help");
  }

  return getRandomResponse("default");
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Simulate a small delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = generateResponse(message);

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
