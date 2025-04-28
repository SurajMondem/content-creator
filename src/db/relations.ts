import { relations } from 'drizzle-orm/relations';
import {
  usersInAuth,
  users,
  conversations,
  messages,
  generatedContent,
  embeddings,
} from './schema';

export const usersRelations = relations(users, ({ one, many }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [users.id],
    references: [usersInAuth.id],
  }),
  conversations: many(conversations),
  generatedContents: many(generatedContent),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  users: many(users),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [conversations.userId],
      references: [users.id],
    }),
    messages: many(messages),
    generatedContents: many(generatedContent),
    embeddings: many(embeddings),
  })
);

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  embeddings: many(embeddings),
}));

export const generatedContentRelations = relations(
  generatedContent,
  ({ one, many }) => ({
    conversation: one(conversations, {
      fields: [generatedContent.conversationId],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [generatedContent.userId],
      references: [users.id],
    }),
    embeddings: many(embeddings),
  })
);

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  generatedContent: one(generatedContent, {
    fields: [embeddings.contentId],
    references: [generatedContent.id],
  }),
  conversation: one(conversations, {
    fields: [embeddings.conversationId],
    references: [conversations.id],
  }),
  message: one(messages, {
    fields: [embeddings.messageId],
    references: [messages.id],
  }),
}));
