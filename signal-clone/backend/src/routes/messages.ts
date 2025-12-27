import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get messages for a conversation
router.get('/conversation/:conversationId', async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { cursor, limit = '50' } = req.query;

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.user1Id !== req.userId && conversation.user2Id !== req.userId) {
      res.status(403).json({ error: 'Not authorized to view these messages' });
      return;
    }

    const take = Math.min(parseInt(limit as string, 10), 100);

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor as string }
      }),
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            publicKey: true
          }
        }
      }
    });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      nextCursor: messages.length === take ? messages[0]?.id : null
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message (encrypted)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, encryptedContent, nonce, receiverId } = req.body;

    if (!conversationId || !encryptedContent || !nonce || !receiverId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.user1Id !== req.userId && conversation.user2Id !== req.userId) {
      res.status(403).json({ error: 'Not authorized to send messages in this conversation' });
      return;
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.userId!,
        receiverId,
        encryptedContent,
        nonce
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            publicKey: true
          }
        }
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
