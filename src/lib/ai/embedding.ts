import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

const embedding = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter((i) => i !== '')
    .map((i) => i.trim());
};

export const generateEmbeddings = async (
  input: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(input);
  const { embeddings } = await embedMany({
    model: embedding,
    values: chunks,
  });

  return embeddings.map((embedding, index) => ({
    embedding: embedding,
    content: chunks[index],
  }));
};
