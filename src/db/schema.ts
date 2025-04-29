import {
  pgTable,
  uuid,
  text,
  vector,
  foreignKey,
  unique,
  pgPolicy,
  timestamp,
  boolean,
  integer,
  index,
  pgEnum,
  pgSchema,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const authSchema = pgSchema('auth');

export const usersInAuth = authSchema.table('users', {
  id: uuid('id').primaryKey().notNull(),
  email: text('email').notNull(),
  name: text('name'),
  image: text('image'),
});

export const platformType = pgEnum('platform_type', [
  'TWITTER',
  'LINKEDIN',
  'INSTAGRAM',
  'FACEBOOK',
]);
export const templateCategory = pgEnum('template_category', [
  'BLOG_POST',
  'SOCIAL_MEDIA',
  'PRODUCT_DESCRIPTION',
  'EMAIL',
  'NEWSLETTER',
  'PRESS_RELEASE',
  'ADVERTISEMENT',
]);

export const documents = pgTable('documents', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  content: text(),
  embedding: vector({ dimensions: 1536 }),
});

export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().notNull(),
    email: text().notNull(),
    name: text(),
    image: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [table.id],
      name: 'users_id_fkey',
    }).onDelete('cascade'),
    unique('users_email_key').on(table.email),
    pgPolicy('Users can only update their own data.', {
      as: 'permissive',
      for: 'update',
      to: ['public'],
      using: sql`(auth.uid() = id)`,
    }),
    pgPolicy('Users can only view their own data.', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
    }),
  ]
);

export const conversations = pgTable(
  'conversations',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: text().notNull(),
    userId: uuid('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'conversations_user_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('Users can CRUD their own conversations.', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`(auth.uid() = user_id)`,
    }),
  ]
);

export const messages = pgTable(
  'messages',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    text: text().notNull(),
    isUserMessage: boolean('is_user_message').default(true).notNull(),
    conversationId: uuid('conversation_id').notNull(),
    userId: uuid('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.conversationId],
      foreignColumns: [conversations.id],
      name: 'messages_conversation_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'messages_user_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('Users can create messages in their own conversations.', {
      as: 'permissive',
      for: 'insert',
      to: ['public'],
      withCheck: sql`(EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND (c.user_id = auth.uid()))))`,
    }),
    pgPolicy('Users can view messages in their own conversations.', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
    }),
  ]
);

export const templates = pgTable('templates', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  prompt: text().notNull(),
  category: templateCategory().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  usageCount: integer('usage_count').default(0).notNull(),
  isSystem: boolean('is_system').default(false).notNull(),
});

export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    embedding: vector({ dimensions: 1536 }).notNull(),
    messageId: uuid('message_id'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('embeddings_vector_idx').using(
      'ivfflat',
      table.embedding.asc().nullsLast().op('vector_cosine_ops')
    ),
    foreignKey({
      columns: [table.messageId],
      foreignColumns: [messages.id],
      name: 'embeddings_message_id_fkey',
    }).onDelete('cascade'),
  ]
);
