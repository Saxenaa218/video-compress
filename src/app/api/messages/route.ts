import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type MessageWithUsers = {
  id: string;
  content: string;
  imageUrl: string | null;
  read: boolean;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
  receiver: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all conversations (unique users the current user has messaged or received messages from)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Group by conversation partner
    const conversationsMap = new Map<string, { partner: MessageWithUsers["sender"]; lastMessage: MessageWithUsers; unreadCount: number }>();
    
    messages.forEach((message: MessageWithUsers) => {
      const partnerId = message.senderId === session.user.id
        ? message.receiverId
        : message.senderId;
      const partner = message.senderId === session.user.id
        ? message.receiver
        : message.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (message.receiverId === session.user.id && !message.read) {
        const conv = conversationsMap.get(partnerId);
        if (conv) {
          conv.unreadCount += 1;
        }
      }
    });

    return NextResponse.json(Array.from(conversationsMap.values()));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
