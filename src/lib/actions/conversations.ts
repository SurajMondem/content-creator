import { db } from '@/db';
import { conversations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const createConversation = async (input: {
  userId: string;
  title: string;
}) => {
  const { userId, title } = input;

  try {
    const [conversation] = await db
      .insert(conversations)
      .values({
        userId,
        title,
      })
      .returning();
    return conversation;
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};

export const getConversations = async (input: { userId: string }) => {
  const { userId } = input;

  try {
    const content = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId));
    return content;
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};
