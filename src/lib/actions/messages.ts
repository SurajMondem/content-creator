import { db } from '@/db';
import { messages } from '@/db/schema';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const createResource = async (input: {
  conversationId: string;
  text: string;
  userId: string;
}) => {
  try {
    const { conversationId, text, userId } = input;

    const [message] = await db
      .insert(messages)
      .values({
        conversationId,
        text,
        userId,
      })
      .returning();

    const embeddings = await generateEmbeddings(text);

    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        messageId: message.id,
        ...embedding,
      }))
    );

    return 'Message created Successfully';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};

export const getMessages = async (input: { conversationId: string }) => {
  const { conversationId } = input;

  try {
    const content = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId));

    return content;
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};
