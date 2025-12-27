import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all conversations for current user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: req.userId },
          { user2Id: req.userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            publicKey: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            publicKey: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Format response to show the other user in each conversation
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1Id === req.userId ? conv.user2 : conv.user1;
      return {
        id: conv.id,
        otherUser,
        lastMessage: conv.messages[0] || null,
        updatedAt: conv.updatedAt
      };
    });

    res.json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Create or get existing conversation with another user
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { userId: otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    if (otherUserId === req.userId) {
      res.status(400).json({ error: 'Cannot create conversation with yourself' });
      return;
    }

    // Check if other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        username: true,
        publicKey: true
      }
    });

    if (!otherUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Normalize user IDs to ensure consistent ordering
    const [user1Id, user2Id] = [req.userId!, otherUserId].sort();

    // Check for existing conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: { user1Id, user2Id }
      }
    });

    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { user1Id, user2Id }
      });
    }

    res.status(201).json({
      conversation: {
        id: conversation.id,
        otherUser
      }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get single conversation by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            publicKey: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            publicKey: true
          }
        }
      }
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    // Check if user is part of this conversation
    if (conversation.user1Id !== req.userId && conversation.user2Id !== req.userId) {
      res.status(403).json({ error: 'Not authorized to view this conversation' });
      return;
    }

    const otherUser = conversation.user1Id === req.userId ? conversation.user2 : conversation.user1;

    res.json({
      conversation: {
        id: conversation.id,
        otherUser
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

export default router;
