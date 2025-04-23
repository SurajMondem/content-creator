# Work Breakdown Structure (WBS) - Content Creator Application

## 1. Database and Schema Setup

### 1.1 Configure Prisma with Supabase

- **Description**: Set up Prisma ORM to work with Supabase PostgreSQL database, including environment configuration and initial setup.
- **Implementation Prompt**:
  ```
  Create a Prisma configuration for a content creator application using Supabase as the database provider.
  Set up the schema.prisma file with PostgreSQL provider pointing to an environment variable DATABASE_URL.
  Generate a client configuration and add any necessary scripts to package.json for Prisma migrations.
  Also create a .env.example file showing the required environment variables.
  ```
- **Code Snippet**:

  ```typescript
  // schema.prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  // package.json scripts
  {
    "scripts": {
      "prisma:generate": "prisma generate",
      "prisma:migrate": "prisma migrate dev",
      "prisma:deploy": "prisma migrate deploy",
      "prisma:studio": "prisma studio"
    }
  }

  // .env.example
  DATABASE_URL="postgresql://postgres:password@localhost:5432/content_creator?schema=public"
  ```

### 1.2 Enable Vector Extension in Supabase

- **Description**: Enable the pgvector extension in Supabase to support embedding vectors for RAG functionality.
- **Implementation Prompt**:
  ```
  Create a SQL migration file that enables the vector extension in Supabase PostgreSQL.
  The file should contain the SQL command to create the extension if it doesn't exist.
  Also add instructions in the README on how to run this command in the Supabase SQL editor.
  ```
- **Code Snippet**:

  ````sql
  -- enable_vector_extension.sql
  CREATE EXTENSION IF NOT EXISTS vector;

  -- In README.md
  /*
  ## Vector Search Setup

  To enable vector search in Supabase:

  1. Go to the Supabase Dashboard
  2. Select your project
  3. Go to the SQL Editor
  4. Create a new query
  5. Paste the following SQL and run it:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
  ````

  6. Verify the extension is enabled by running:
     ```sql
     SELECT * FROM pg_extension WHERE extname = 'vector';
     ```
     \*/

  ```

  ```

### 1.3 Define Database Schema

- **Description**: Create a comprehensive Prisma schema with all required models for the application, including vector embeddings support.
- **Implementation Prompt**:

  ```
  Create a complete Prisma schema for a content creator application with the following models:
  1. User (linked to Clerk auth)
  2. Conversation
  3. Message
  4. GeneratedContent
  5. Template
  6. SocialProfile
  7. Embedding (with vector support)

  The schema should support:
  - Vector embeddings for RAG implementation
  - Relationships between users, conversations, and messages
  - Platform-specific content generation
  - Template management with categories
  - Social media profile connections

  Use appropriate field types, relations, and indexes, especially for the vector fields.
  ```

- **Code Snippet**:

  ```prisma
  // schema.prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  model User {
    id               String            @id
    clerkId          String            @unique
    email            String            @unique
    name             String?
    image            String?
    createdAt        DateTime          @default(now())
    updatedAt        DateTime          @updatedAt
    conversations    Conversation[]
    socialProfiles   SocialProfile[]
    favoriteTemplates Template[]       @relation("UserFavorites")
  }

  model Conversation {
    id          String    @id @default(cuid())
    title       String
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    userId      String
    user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
    messages    Message[]
    contents    GeneratedContent[]
    embedding   Embedding?
  }

  model Message {
    id             String    @id @default(cuid())
    text           String    @db.Text
    isUserMessage  Boolean   @default(true)
    createdAt      DateTime  @default(now())
    conversationId String
    conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
    embedding      Embedding?
  }

  model Embedding {
    id              String        @id @default(cuid())
    vector          Unsupported("vector(1536)")  // For OpenAI embeddings
    messageId       String?       @unique
    message         Message?      @relation(fields: [messageId], references: [id], onDelete: Cascade)
    conversationId  String?       @unique
    conversation    Conversation? @relation(fields: [conversationId], references: [id], onDelete: Cascade)
    contentId       String?       @unique
    content         GeneratedContent? @relation(fields: [contentId], references: [id], onDelete: Cascade)
    createdAt       DateTime      @default(now())

    @@index([vector], type: Vector)
  }

  model GeneratedContent {
    id             String    @id @default(cuid())
    content        String    @db.Text
    platform       Platform
    conversationId String
    conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
    createdAt      DateTime  @default(now())
    feedbackRating Int?
    published      Boolean   @default(false)
    publishedUrl   String?
    embedding      Embedding?
  }

  model Template {
    id          String           @id @default(cuid())
    name        String
    description String?
    prompt      String           @db.Text
    category    TemplateCategory
    createdAt   DateTime         @default(now())
    updatedAt   DateTime         @updatedAt
    usageCount  Int              @default(0)
    favoritedBy User[]           @relation("UserFavorites")
  }

  model SocialProfile {
    id            String    @id @default(cuid())
    platform      Platform
    accessToken   String?
    refreshToken  String?
    profileName   String?
    profileId     String?
    isConnected   Boolean   @default(false)
    lastConnected DateTime?
    userId        String
    user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  }

  enum Platform {
    TWITTER
    LINKEDIN
    INSTAGRAM
    FACEBOOK
  }

  enum TemplateCategory {
    BLOG_POST
    SOCIAL_MEDIA
    PRODUCT_DESCRIPTION
    EMAIL
    NEWSLETTER
    PRESS_RELEASE
    ADVERTISEMENT
  }
  ```

### 1.4 Generate Initial Migration

- **Description**: Create and run the initial database migration to set up all tables in Supabase.
- **Implementation Prompt**:
  ```
  Create commands to generate and apply the initial Prisma migration for our content creator application.
  Include instructions for running the migration in development and how to deploy it to production.
  Add error handling strategies if the migration fails.
  ```
- **Code Snippet**:

  ```bash
  # Development migration commands
  npx prisma migrate dev --name init

  # Production migration commands
  npx prisma migrate deploy

  # Migration script with error handling (save as migrate.js)
  const { exec } = require('child_process');
  const env = process.env.NODE_ENV || 'development';

  const command = env === 'production'
    ? 'npx prisma migrate deploy'
    : 'npx prisma migrate dev --name init';

  console.log(`Running migration in ${env} mode`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration failed: ${error.message}`);
      console.log('Attempting to rollback...');

      // In production, we'd need a more robust rollback strategy
      if (env !== 'production') {
        exec('npx prisma migrate reset --force', (err, out, err) => {
          if (err) {
            console.error(`Rollback failed: ${err.message}`);
            process.exit(1);
          }
          console.log('Rollback successful');
        });
      } else {
        console.error('Manual intervention required for production rollback');
        process.exit(1);
      }
      return;
    }

    if (stderr) {
      console.warn(`Warnings during migration: ${stderr}`);
    }

    console.log(`Migration completed successfully: ${stdout}`);
  });
  ```

## 2. Authentication System

### 2.1 Set Up Clerk Authentication

- **Description**: Install and configure Clerk for authentication including middleware setup.
- **Implementation Prompt**:
  ```
  Install and configure Clerk for Next.js authentication. Create a middleware.ts file that sets up Clerk auth with appropriate public routes.
  Configure Clerk to work with our Next.js app router structure and define which routes should be protected.
  Set up the ClerkProvider in the root layout component.
  ```
- **Code Snippet**:

  ```typescript
  // middleware.ts
  import { authMiddleware } from "@clerk/nextjs";

  export default authMiddleware({
    publicRoutes: [
      "/",
      "/login",
      "/signup",
      "/api/webhook/clerk",
      "/blog(.*)",
      "/privacy",
      "/terms"
    ]
  });

  export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  };

  // app/layout.tsx
  import { ClerkProvider } from '@clerk/nextjs';
  import { dark } from '@clerk/themes';
  import { Inter } from 'next/font/google';
  import './globals.css';

  const inter = Inter({ subsets: ['latin'] });

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-sm normal-case',
            },
          }}
        >
          <body className={inter.className}>
            {children}
          </body>
        </ClerkProvider>
      </html>
    );
  }
  ```

### 2.2 Implement User Synchronization with Webhook

- **Description**: Create a webhook endpoint to sync Clerk user data with our database.
- **Implementation Prompt**:
  ```
  Create a Clerk webhook handler at app/api/webhook/clerk/route.ts that handles user.created, user.updated, and user.deleted events.
  When a user is created or updated in Clerk, the webhook should create or update the corresponding user record in our database.
  When a user is deleted in Clerk, the webhook should delete the user from our database.
  Include webhook verification using the Svix library and proper error handling.
  ```
- **Code Snippet**:

  ```typescript
  // app/api/webhook/clerk/route.ts
  import { Webhook } from 'svix';
  import { headers } from 'next/headers';
  import { NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';

  export async function POST(req: Request) {
    // Verify webhook signature
    const headerPayload = headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing svix headers', { status: 400 });
    }

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // Create a new Svix instance with the webhook secret
    const svix = new Webhook(webhookSecret);

    // Get the body of the request
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify the webhook payload
    let evt: any;
    try {
      evt = svix.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error verifying webhook', { status: 400 });
    }

    // Handle the webhook event
    const { type, data } = evt;

    try {
      // Handle user creation
      if (type === 'user.created') {
        await prisma.user.create({
          data: {
            id: data.id,
            clerkId: data.id,
            email: data.email_addresses[0].email_address,
            name:
              `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
            image: data.image_url,
          },
        });
        console.log(`User created: ${data.id}`);
      }

      // Handle user update
      if (type === 'user.updated') {
        await prisma.user.update({
          where: { clerkId: data.id },
          data: {
            email: data.email_addresses[0].email_address,
            name:
              `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
            image: data.image_url,
          },
        });
        console.log(`User updated: ${data.id}`);
      }

      // Handle user deletion
      if (type === 'user.deleted') {
        await prisma.user.delete({
          where: { clerkId: data.id },
        });
        console.log(`User deleted: ${data.id}`);
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Error processing webhook:', err);
      return new Response('Error processing webhook', { status: 500 });
    }
  }
  ```

### 2.3 Create User Profile Management

- **Description**: Implement endpoints for users to view and update their profiles.
- **Implementation Prompt**:
  ```
  Create API routes for user profile management at app/api/user/profile/route.ts.
  Implement GET to retrieve the current user's profile from our database.
  Implement PATCH to update specific user profile fields.
  Ensure proper authentication using Clerk's auth() helper.
  Add error handling and validation for the request data.
  ```
- **Code Snippet**:

  ```typescript
  // app/api/user/profile/route.ts
  import { auth } from '@clerk/nextjs';
  import { NextRequest, NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';
  import { z } from 'zod';

  // Schema for profile update validation
  const profileUpdateSchema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    preferences: z
      .object({
        darkMode: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
      })
      .optional(),
  });

  export async function GET(req: NextRequest) {
    // Get the authenticated user ID
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Fetch the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          // Add additional fields as needed
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }
  }

  export async function PATCH(req: NextRequest) {
    // Get the authenticated user ID
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = profileUpdateSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const validatedData = validationResult.data;

      // Update the user in the database
      const user = await prisma.user.update({
        where: { clerkId: userId },
        data: validatedData,
      });

      return NextResponse.json(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }
  }
  ```

## 3. Conversation Management

### 3.1 Implement Conversation API

- **Description**: Create endpoints for managing conversations.
- **Implementation Prompt**:

  ```
  Create a conversation management API with the following endpoints:
  1. GET /api/conversations - List all conversations for the current user
  2. POST /api/conversations - Create a new conversation
  3. GET /api/conversations/[id] - Get a specific conversation with its messages
  4. PATCH /api/conversations/[id] - Update a conversation (e.g., title)
  5. DELETE /api/conversations/[id] - Delete a conversation

  Implement proper authentication with Clerk, data validation, error handling, and database operations using Prisma.
  When creating a conversation, generate and store an embedding for the title to support future RAG functionality.
  ```

- **Code Snippet**:

  ```typescript
  // app/api/conversations/route.ts
  import { auth } from '@clerk/nextjs';
  import { NextRequest, NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';
  import { z } from 'zod';
  import { getEmbedding } from '@/lib/embeddings';

  // Schema for conversation creation
  const createConversationSchema = z.object({
    title: z.string().min(1).max(100),
  });

  export async function GET(req: NextRequest) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get all conversations for the user with the most recent message
      const conversations = await prisma.conversation.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return NextResponse.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      );
    }
  }

  export async function POST(req: NextRequest) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = createConversationSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const { title } = validationResult.data;

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Create a new conversation
      const conversation = await prisma.conversation.create({
        data: {
          title,
          userId: user.id,
        },
      });

      // Generate an embedding for the conversation title
      const titleEmbedding = await getEmbedding(title);

      // Store the embedding
      await prisma.embedding.create({
        data: {
          vector: titleEmbedding,
          conversationId: conversation.id,
        },
      });

      return NextResponse.json(conversation, { status: 201 });
    } catch (error) {
      console.error('Error creating conversation:', error);
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }
  }

  // app/api/conversations/[id]/route.ts
  import { auth } from '@clerk/nextjs';
  import { NextRequest, NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';
  import { z } from 'zod';

  // Schema for conversation update
  const updateConversationSchema = z.object({
    title: z.string().min(1).max(100),
  });

  export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    try {
      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get the conversation with its messages
      const conversation = await prisma.conversation.findUnique({
        where: {
          id,
          userId: user.id, // Ensure the conversation belongs to the user
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversation' },
        { status: 500 }
      );
    }
  }

  export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = updateConversationSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const { title } = validationResult.data;

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update the conversation
      const conversation = await prisma.conversation.update({
        where: {
          id,
          userId: user.id, // Ensure the conversation belongs to the user
        },
        data: {
          title,
        },
      });

      return NextResponse.json(conversation);
    } catch (error) {
      console.error('Error updating conversation:', error);
      return NextResponse.json(
        { error: 'Failed to update conversation' },
        { status: 500 }
      );
    }
  }

  export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    try {
      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Delete the conversation
      await prisma.conversation.delete({
        where: {
          id,
          userId: user.id, // Ensure the conversation belongs to the user
        },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return NextResponse.json(
        { error: 'Failed to delete conversation' },
        { status: 500 }
      );
    }
  }
  ```

### 3.2 Implement Message Management

- **Description**: Create endpoints for managing messages within conversations.
- **Implementation Prompt**:

  ```
  Create a message management API with the following endpoints:
  1. GET /api/conversations/[id]/messages - Get all messages for a conversation
  2. POST /api/conversations/[id]/messages - Add a new message to a conversation

  Ensure messages are properly linked to conversations, include timestamps, and track whether they're from the user or AI.
  When storing messages, generate and store embeddings for the message content to support RAG.
  Implement authentication, validation, and error handling.
  ```

- **Code Snippet**:

  ```typescript
  // app/api/conversations/[id]/messages/route.ts
  import { auth } from '@clerk/nextjs';
  import { NextRequest, NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';
  import { z } from 'zod';
  import { getEmbedding } from '@/lib/embeddings';

  // Schema for message creation
  const createMessageSchema = z.object({
    text: z.string().min(1),
    isUserMessage: z.boolean().default(true),
  });

  export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    try {
      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if the conversation exists and belongs to the user
      const conversation = await prisma.conversation.findUnique({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      // Get all messages for the conversation
      const messages = await prisma.message.findMany({
        where: {
          conversationId: id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return NextResponse.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }
  }

  export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = createMessageSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const { text, isUserMessage } = validationResult.data;

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if the conversation exists and belongs to the user
      const conversation = await prisma.conversation.findUnique({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      // Create a new message
      const message = await prisma.message.create({
        data: {
          text,
          isUserMessage,
          conversationId,
        },
      });

      // Generate an embedding for the message
      const messageEmbedding = await getEmbedding(text);

      // Store the embedding
      await prisma.embedding.create({
        data: {
          vector: messageEmbedding,
          messageId: message.id,
        },
      });

      // Update the conversation's updatedAt timestamp
      await prisma.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json(message, { status: 201 });
    } catch (error) {
      console.error('Error creating message:', error);
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      );
    }
  }
  ```

## 4. AI Integration

### 4.1 Set Up AI SDK

- **Description**: Configure the AI SDK for OpenAI integration, including streaming responses.
- **Implementation Prompt**:
  ```
  Set up the OpenAI SDK for our content creator application.
  Create a utility file that configures the OpenAI client with proper authentication.
  Support both the ChatGPT API and the embeddings API.
  Include rate limiting and error handling for API calls.
  ```
- **Code Snippet**:

  ```typescript
  // lib/openai.ts
  import { OpenAI } from 'openai';
  import { Ratelimit } from '@upstash/ratelimit';
  import { Redis } from '@upstash/redis';

  // Create rate limiter
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, '1m'), // 20 requests per minute
    analytics: true,
  });

  // Create OpenAI client with API key
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  export async function getChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options: {
      temperature?: number;
      max_tokens?: number;
      userId?: string;
    } = {}
  ) {
    const { temperature = 0.7, max_tokens = 500, userId } = options;

    // Apply rate limiting if userId is provided
    if (userId) {
      const { success, limit, reset, remaining } = await ratelimit.limit(
        `chat_${userId}`
      );

      if (!success) {
        throw new Error(
          `Rate limit exceeded. Try again in ${Math.ceil(
            (reset - Date.now()) / 1000
          )} seconds. (${remaining}/${limit} requests remaining)`
        );
      }
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages,
        temperature,
        max_tokens,
        stream: false,
      });

      return response.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      if (error.statusCode === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      }
      throw new Error('Failed to generate content. Please try again later.');
    }
  }

  export async function streamChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options: {
      temperature?: number;
      max_tokens?: number;
      userId?: string;
    } = {}
  ) {
    const { temperature = 0.7, max_tokens = 1000, userId } = options;

    // Apply rate limiting if userId is provided
    if (userId) {
      const { success, limit, reset, remaining } = await ratelimit.limit(
        `chat_${userId}`
      );

      if (!success) {
        throw new Error(
          `Rate limit exceeded. Try again in ${Math.ceil(
            (reset - Date.now()) / 1000
          )} seconds. (${remaining}/${limit} requests remaining)`
        );
      }
    }

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages,
        temperature,
        max_tokens,
        stream: true,
      });

      return stream;
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      if (error.statusCode === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      }
      throw new Error('Failed to generate content. Please try again later.');
    }
  }

  export async function getEmbedding(text: string) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('OpenAI embeddings API error:', error);
      throw new Error('Failed to generate embedding. Please try again later.');
    }
  }
  ```

### 4.2 Implement Content Generation API

- **Description**: Create an endpoint for AI-based content generation to multiple platforms.
- **Implementation Prompt**:
  ```
  Create an API endpoint at /api/ai/generate that accepts a user prompt and platform (TWITTER, LINKEDIN, etc.) and returns AI-generated content.
  Include specialized prompt templates for different social media platforms to optimize for platform-specific constraints and formats.
  Store the generated content in the database linked to the user's conversation.
  Implement authentication, validation, and error handling.
  ```
- **Code Snippet**:

  ```typescript
  // app/api/ai/generate/route.ts
  import { auth } from '@clerk/nextjs';
  import { NextRequest, NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';
  import { z } from 'zod';
  import { getChatCompletion } from '@/lib/openai';
  import { getEmbedding } from '@/lib/embeddings';

  // Schema for content generation request
  const generateContentSchema = z.object({
    prompt: z.string().min(1),
    conversationId: z.string().min(1),
    platform: z.enum(['TWITTER', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK']),
  });

  // Platform-specific prompt templates
  const platformPrompts = {
    TWITTER: {
      maxLength: 280,
      instructions:
        'Create a concise, engaging tweet that uses hashtags strategically and focuses on one clear message. Keep it conversational and authentic. Limit to 280 characters.',
    },
    LINKEDIN: {
      maxLength: 3000,
      instructions:
        'Write a professional LinkedIn post that provides valuable insights, uses industry-appropriate language, and encourages meaningful engagement. Include a clear call-to-action and organize with line breaks for readability.',
    },
    INSTAGRAM: {
      maxLength: 2200,
      instructions:
        "Create a visually-descriptive Instagram caption that supports an image (which you can't see), uses relevant hashtags, and has an engaging first line to hook readers before the 'more' cutoff. Include emojis where appropriate.",
    },
    FACEBOOK: {
      maxLength: 5000,
      instructions:
        'Write a Facebook post that balances personal voice with informative content. Encourage comments by asking a question, use moderate formatting for readability, and consider including a link preview statement.',
    },
  };

  export async function POST(req: NextRequest) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = generateContentSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const { prompt, conversationId, platform } = validationResult.data;

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if the conversation exists and belongs to the user
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          userId: user.id,
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      // Create prompt for content generation
      const platformConfig = platformPrompts[platform];
      const systemPrompt = `
        You are a professional content creator specialized in writing for ${platform}.
        ${platformConfig.instructions}
        Maximum length: ${platformConfig.maxLength} characters.
      `;

      // Generate content using the OpenAI API
      const generatedContent = await getChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        { userId: user.id }
      );

      if (!generatedContent) {
        return NextResponse.json(
          { error: 'Failed to generate content' },
          { status: 500 }
        );
      }

      // Store generated content in the database
      const content = await prisma.generatedContent.create({
        data: {
          content: generatedContent,
          platform,
          conversationId,
        },
      });

      // Generate an embedding for the content
      const contentEmbedding = await getEmbedding(generatedContent);

      // Store the embedding
      await prisma.embedding.create({
        data: {
          vector: contentEmbedding,
          contentId: content.id,
        },
      });

      // Add the user message to the conversation
      await prisma.message.create({
        data: {
          text: prompt,
          isUserMessage: true,
          conversationId,
        },
      });

      // Add the AI response to the conversation
      await prisma.message.create({
        data: {
          text: `Generated ${platform} content: ${generatedContent}`,
          isUserMessage: false,
          conversationId,
        },
      });

      // Update the conversation's updatedAt timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json(content);
    } catch (error: any) {
      console.error('Error generating content:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to generate content' },
        { status: 500 }
      );
    }
  }
  ```

### 4.3 Implement Streaming Response API

- **Description**: Create an endpoint for streaming AI responses for real-time chat.
- **Implementation Prompt**:
  ```
  Create an API endpoint that streams AI responses for real-time chat interactions.
  Implement proper handling of the AI SDK's streaming response capabilities.
  Store both user messages and AI responses in the database.
  Integrate with the RAG system to enhance responses with context from previous conversations.
  Ensure proper error handling for stream interruptions.
  ```
- **Code Snippet**:

  ```typescript
  // app/api/ai/chat/route.ts
  import { auth } from '@clerk/nextjs';
  import { NextRequest } from 'next/server';
  import { StreamingTextResponse } from 'ai';
  import prisma from '@/lib/prisma';
  import { z } from 'zod';
  import { streamChatCompletion } from '@/lib/openai';
  import { getEmbedding } from '@/lib/embeddings';
  import { searchSimilarMessages } from '@/lib/vector-search';

  // Schema for chat request
  const chatRequestSchema = z.object({
    message: z.string().min(1),
    conversationId: z.string().min(1),
  });

  export async function POST(req: NextRequest) {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = chatRequestSchema.safeParse(body);

      if (!validationResult.success) {
        return new Response(
          JSON.stringify({
            error: 'Invalid request data',
            details: validationResult.error.format(),
          }),
          { status: 400 }
        );
      }

      const { message, conversationId } = validationResult.data;

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return new Response('User not found', { status: 404 });
      }

      // Check if the conversation exists and belongs to the user
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          userId: user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10, // Get the last 10 messages for context
          },
        },
      });

      if (!conversation) {
        return new Response('Conversation not found', { status: 404 });
      }

      // Store the user's message in the database
      const userMessage = await prisma.message.create({
        data: {
          text: message,
          isUserMessage: true,
          conversationId,
        },
      });

      // Generate an embedding for the message
      const messageEmbedding = await getEmbedding(message);

      // Store the embedding
      await prisma.embedding.create({
        data: {
          vector: messageEmbedding,
          messageId: userMessage.id,
        },
      });

      // Search for similar messages to provide context
      const similarMessages = await searchSimilarMessages(messageEmbedding, 3);
      const contextMessages = similarMessages
        .filter((msg) => msg.id !== userMessage.id) // Exclude the current message
        .map((msg) => `Similar previous message: ${msg.text}`);

      // Prepare conversation history for the AI
      const chatHistory = conversation.messages.map((msg) => ({
        role: msg.isUserMessage
          ? 'user'
          : ('assistant' as 'user' | 'assistant'),
        content: msg.text,
      }));

      // Add context from similar messages
      const systemMessage = `
        You are a helpful AI assistant for content creation.
        Be concise, informative, and creative.
        
        ${contextMessages.length > 0 ? 'Here is some relevant context from previous conversations:\n' + contextMessages.join('\n') : ''}
      `;

      // Stream the AI response
      const stream = await streamChatCompletion(
        [
          { role: 'system', content: systemMessage },
          ...chatHistory,
          { role: 'user', content: message },
        ],
        { userId: user.id }
      );

      // Process and forward the stream
      const textEncoder = new TextEncoder();
      const transformStream = new TransformStream({
        async start(controller) {
          let fullResponse = '';

          // Process each chunk of the stream
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(textEncoder.encode(content));
              fullResponse += content;
            }
          }

          // After stream completes, store the full AI response
          try {
            await prisma.message.create({
              data: {
                text: fullResponse,
                isUserMessage: false,
                conversationId,
              },
            });

            // Generate embedding for the AI response
            const responseEmbedding = await getEmbedding(fullResponse);

            // Store the embedding
            await prisma.embedding.create({
              data: {
                vector: responseEmbedding,
                messageId: userMessage.id,
              },
            });

            // Update the conversation's updatedAt timestamp
            await prisma.conversation.update({
              where: { id: conversationId },
              data: { updatedAt: new Date() },
            });
          } catch (error) {
            console.error('Error storing AI response:', error);
          }
        },
      });

      return new StreamingTextResponse(transformStream.readable);
    } catch (error: any) {
      console.error('Error in chat stream:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'An error occurred' }),
        { status: 500 }
      );
    }
  }
  ```

## 5. RAG System Implementation

### 5.1 Create Embedding Utilities

- **Description**: Implement utilities for generating and managing text embeddings for RAG.
- **Implementation Prompt**:
  ```
  Create utility functions for generating and managing text embeddings.
  These functions should handle the generation of embeddings using OpenAI's embedding API.
  Implement vector normalization and storage in the pgvector format.
  Create helper functions for indexing and retrieving conversations based on semantic search.
  ```
- **Code Snippet**:

  ```typescript
  // lib/embeddings.ts
  import { OpenAI } from 'openai';

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  export async function getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  export function normalizeVector(vector: number[]): number[] {
    // Calculate the Euclidean norm (magnitude) of the vector
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );

    // Normalize the vector by dividing each component by the magnitude
    return vector.map((val) => val / magnitude);
  }

  // lib/vector-search.ts
  import prisma from '@/lib/prisma';
  import { getEmbedding } from './embeddings';

  export async function searchSimilarMessages(
    queryEmbedding: number[],
    limit = 5,
    threshold = 0.7
  ) {
    try {
      const similarMessages = await prisma.$queryRaw`
        SELECT m.id, m.text, m."conversationId", m."isUserMessage", m."createdAt",
        1 - (e.vector <=> ${queryEmbedding}::vector) as similarity
        FROM "Message" m
        JOIN "Embedding" e ON m.id = e."messageId"
        WHERE 1 - (e.vector <=> ${queryEmbedding}::vector) > ${threshold}
        ORDER BY similarity DESC
        LIMIT ${limit};
      `;

      return similarMessages as Array<{
        id: string;
        text: string;
        conversationId: string;
        isUserMessage: boolean;
        createdAt: Date;
        similarity: number;
      }>;
    } catch (error) {
      console.error('Error searching for similar messages:', error);
      return [];
    }
  }

  export async function searchSimilarConversations(
    queryText: string,
    limit = 5,
    threshold = 0.7
  ) {
    try {
      // Generate embedding for the query text
      const queryEmbedding = await getEmbedding(queryText);

      const similarConversations = await prisma.$queryRaw`
        SELECT c.id, c.title, c."userId", c."createdAt", c."updatedAt",
        1 - (e.vector <=> ${queryEmbedding}::vector) as similarity
        FROM "Conversation" c
        JOIN "Embedding" e ON c.id = e."conversationId"
        WHERE 1 - (e.vector <=> ${queryEmbedding}::vector) > ${threshold}
        ORDER BY similarity DESC
        LIMIT ${limit};
      `;

      return similarConversations as Array<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        similarity: number;
      }>;
    } catch (error) {
      console.error('Error searching for similar conversations:', error);
      return [];
    }
  }

  export async function indexConversationHistory(conversationId: string) {
    try {
      // Get all messages from the conversation that don't have embeddings
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
          embedding: null,
        },
      });

      // Generate embeddings for each message
      for (const message of messages) {
        const embedding = await getEmbedding(message.text);

        // Store the embedding
        await prisma.embedding.create({
          data: {
            vector: embedding,
            messageId: message.id,
          },
        });
      }

      return true;
    } catch (error) {
      console.error('Error indexing conversation history:', error);
      return false;
    }
  }
  ```

### 5.2 Implement Semantic Search

- **Description**: Create an API endpoint for semantic search across conversations and messages.
- **Implementation Prompt**:
  ```
  Create an API endpoint for semantic search at /api/search that allows users to search across their conversations and messages.
  Implement vector similarity search using the pgvector extension.
  Return relevant conversations and messages based on semantic similarity.
  Include pagination and filtering options.
  Ensure proper authentication and error handling.
  ```
- **Code Snippet**:

  ```typescript
  // app/api/search/route.ts
  import { auth } from '@clerk/nextjs';
  import { NextRequest, NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';
  import { getEmbedding } from '@/lib/embeddings';
  import { z } from 'zod';

  // Schema for search request
  const searchRequestSchema = z.object({
    query: z.string().min(1),
    type: z.enum(['all', 'conversations', 'messages']).default('all'),
    limit: z.number().int().min(1).max(50).default(10),
    page: z.number().int().min(1).default(1),
    threshold: z.number().min(0.1).max(0.9).default(0.7),
  });

  export async function POST(req: NextRequest) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = searchRequestSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const { query, type, limit, page, threshold } = validationResult.data;

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Generate embedding for the search query
      const queryEmbedding = await getEmbedding(query);

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Perform semantic search based on the requested type
      let conversations = [];
      let messages = [];

      if (type === 'all' || type === 'conversations') {
        conversations = await prisma.$queryRaw`
          SELECT c.id, c.title, c."createdAt", c."updatedAt",
          1 - (e.vector <=> ${queryEmbedding}::vector) as similarity
          FROM "Conversation" c
          JOIN "Embedding" e ON c.id = e."conversationId"
          WHERE c."userId" = ${user.id}
          AND 1 - (e.vector <=> ${queryEmbedding}::vector) > ${threshold}
          ORDER BY similarity DESC
          LIMIT ${limit} OFFSET ${offset};
        `;
      }

      if (type === 'all' || type === 'messages') {
        messages = await prisma.$queryRaw`
          SELECT m.id, m.text, m."conversationId", m."isUserMessage", m."createdAt",
          c.title as "conversationTitle",
          1 - (e.vector <=> ${queryEmbedding}::vector) as similarity
          FROM "Message" m
          JOIN "Embedding" e ON m.id = e."messageId"
          JOIN "Conversation" c ON m."conversationId" = c.id
          WHERE c."userId" = ${user.id}
          AND 1 - (e.vector <=> ${queryEmbedding}::vector) > ${threshold}
          ORDER BY similarity DESC
          LIMIT ${limit} OFFSET ${offset};
        `;
      }

      return NextResponse.json({
        conversations,
        messages,
        pagination: {
          page,
          limit,
          hasMore: conversations.length === limit || messages.length === limit,
        },
      });
    } catch (error) {
      console.error('Error performing semantic search:', error);
      return NextResponse.json(
        { error: 'Failed to perform search' },
        { status: 500 }
      );
    }
  }
  ```

### 5.3 Enhance AI Responses with Context

- **Description**: Modify the AI chat API to incorporate RAG for more contextual responses.
- **Implementation Prompt**:
  ```
  Enhance the AI chat endpoint to use RAG (Retrieval-Augmented Generation).
  Before generating responses, retrieve relevant messages and knowledge from the database based on the semantic similarity.
  Include the retrieved context in the prompt sent to the AI model.
  Implement functions to format and prioritize the context for optimal relevance.
  Update the streaming endpoint to include this enhanced context mechanism.
  ```
- **Code Snippet**:

  ```typescript
  // lib/context-retrieval.ts
  import prisma from '@/lib/prisma';
  import { getEmbedding } from './embeddings';
  import { searchSimilarMessages } from './vector-search';

  export async function getRelevantContext(
    query: string,
    userId: string,
    conversationId?: string,
    maxResults = 5
  ) {
    try {
      // Generate embedding for the query
      const queryEmbedding = await getEmbedding(query);

      // Get similar messages from the user's conversations
      const similarMessages = await searchSimilarMessages(
        queryEmbedding,
        maxResults
      );

      // If a conversation ID is provided, also get messages from that conversation for immediate context
      let conversationMessages = [];
      if (conversationId) {
        conversationMessages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Get the last 10 messages for immediate context
        });
      }

      // Combine and format the context
      const formattedContext = [
        ...similarMessages.map(
          (msg) =>
            `[Similar Message from ${new Date(
              msg.createdAt
            ).toLocaleDateString()}] ${msg.isUserMessage ? 'User' : 'AI'}: ${
              msg.text
            }`
        ),
        ...conversationMessages.map(
          (msg) =>
            `[Current Conversation] ${msg.isUserMessage ? 'User' : 'AI'}: ${
              msg.text
            }`
        ),
      ];

      // Deduplicate the context
      const uniqueContext = Array.from(new Set(formattedContext));

      // Limit the total context size (to avoid exceeding token limits)
      const contextString = truncateContext(uniqueContext.join('\n\n'), 2000);

      return contextString;
    } catch (error) {
      console.error('Error retrieving relevant context:', error);
      return '';
    }
  }

  function truncateContext(context: string, maxLength: number): string {
    if (context.length <= maxLength) {
      return context;
    }

    // Simple truncation - in a real application, you might want to be more sophisticated
    return context.substring(0, maxLength) + '...';
  }

  // app/api/ai/chat/route.ts (Modified with RAG)
  import { auth } from '@clerk/nextjs';
  import { NextRequest } from 'next/server';
  import { StreamingTextResponse } from 'ai';
  import prisma from '@/lib/prisma';
  import { z } from 'zod';
  import { streamChatCompletion } from '@/lib/openai';
  import { getEmbedding } from '@/lib/embeddings';
  import { getRelevantContext } from '@/lib/context-retrieval';

  // Schema for chat request
  const chatRequestSchema = z.object({
    message: z.string().min(1),
    conversationId: z.string().min(1),
  });

  export async function POST(req: NextRequest) {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      // Parse and validate the request body
      const body = await req.json();
      const validationResult = chatRequestSchema.safeParse(body);

      if (!validationResult.success) {
        return new Response(
          JSON.stringify({
            error: 'Invalid request data',
            details: validationResult.error.format(),
          }),
          { status: 400 }
        );
      }

      const { message, conversationId } = validationResult.data;

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return new Response('User not found', { status: 404 });
      }

      // Check if the conversation exists and belongs to the user
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          userId: user.id,
        },
      });

      if (!conversation) {
        return new Response('Conversation not found', { status: 404 });
      }

      // Store the user's message in the database
      const userMessage = await prisma.message.create({
        data: {
          text: message,
          isUserMessage: true,
          conversationId,
        },
      });

      // Generate an embedding for the message
      const messageEmbedding = await getEmbedding(message);

      // Store the embedding
      await prisma.embedding.create({
        data: {
          vector: messageEmbedding,
          messageId: userMessage.id,
        },
      });

      // Retrieve relevant context using RAG
      const relevantContext = await getRelevantContext(
        message,
        user.id,
        conversationId
      );

      // Prepare conversation history (last few messages for immediate context)
      const recentMessages = await prisma.message.findMany({
        where: {
          conversationId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });

      const chatHistory = recentMessages.reverse().map((msg) => ({
        role: msg.isUserMessage
          ? 'user'
          : ('assistant' as 'user' | 'assistant'),
        content: msg.text,
      }));

      // Create system prompt with the relevant context
      const systemPrompt = `
        You are a helpful AI assistant for content creation.
        Be concise, informative, and creative.
        
        ${
          relevantContext
            ? 'Here is some relevant context from previous conversations:\n' +
              relevantContext
            : ''
        }
        
        Respond to the user's message based on this context and your knowledge.
      `;

      // Stream the AI response
      const stream = await streamChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: message },
        ],
        { userId: user.id }
      );

      // Process and forward the stream
      const textEncoder = new TextEncoder();
      const transformStream = new TransformStream({
        async start(controller) {
          let fullResponse = '';

          // Process each chunk of the stream
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(textEncoder.encode(content));
              fullResponse += content;
            }
          }

          // After stream completes, store the full AI response
          try {
            const aiMessage = await prisma.message.create({
              data: {
                text: fullResponse,
                isUserMessage: false,
                conversationId,
              },
            });

            // Generate embedding for the AI response
            const responseEmbedding = await getEmbedding(fullResponse);

            // Store the embedding
            await prisma.embedding.create({
              data: {
                vector: responseEmbedding,
                messageId: aiMessage.id,
              },
            });

            // Update the conversation's updatedAt timestamp
            await prisma.conversation.update({
              where: { id: conversationId },
              data: { updatedAt: new Date() },
            });
          } catch (error) {
            console.error('Error storing AI response:', error);
          }
        },
      });

      return new StreamingTextResponse(transformStream.readable);
    } catch (error: any) {
      console.error('Error in chat stream:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'An error occurred' }),
        { status: 500 }
      );
    }
  }
  ```

## 6. Social Media Integration

### 6.1 Implement Profile Connections

- **Description**: Allow users to connect social media profiles.
- **Implementation Prompt**:

  ```
  Create API endpoints for:
  1. Connecting social media profiles (POST /api/social-profiles)
  2. Listing connected profiles (GET /api/social-profiles)
  3. Removing profiles (DELETE /api/social-profiles/:id)
  4. Refreshing authentication tokens (POST /api/social-profiles/:id/refresh-token)

  Use OAuth 2.0 for authentication with platforms.
  Handle token storage securely in the database.
  Implement proper error handling for failed connections.
  ```

  **Implementation Example**:

  ```typescript
  // Prisma Schema
  model SocialProfile {
    id          String   @id @default(cuid())
    userId      String
    platform    String   // 'twitter', 'instagram', etc.
    profileId   String
    accessToken String   @db.Text
    refreshToken String? @db.Text
    expiresAt   DateTime?
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([userId, platform])
    @@index([userId])
  }

  // API Route for connecting social profiles
  // /app/api/social-profiles/route.ts
  import { NextResponse } from 'next/server';
  import { db } from '@/lib/db';
  import { auth } from '@/lib/auth';

  export async function POST(req: Request) {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const { platform, code, redirectUri } = await req.json();

      // Exchange authorization code for tokens
      const tokens = await exchangeCodeForTokens(platform, code, redirectUri);

      // Get profile details from the platform
      const profileData = await fetchProfileData(platform, tokens.accessToken);

      // Store in database
      const profile = await db.socialProfile.upsert({
        where: {
          userId_platform: {
            userId: session.user.id,
            platform,
          },
        },
        update: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          profileId: profileData.id,
        },
        create: {
          userId: session.user.id,
          platform,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          profileId: profileData.id,
        },
      });

      return NextResponse.json({
        id: profile.id,
        platform: profile.platform,
        profileId: profile.profileId,
      });
    } catch (error) {
      console.error('Error connecting profile:', error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  ```

### 6.2 Implement Content Publishing

- **Description**: Develop functionality to publish content to connected platforms.
- **Implementation Prompt**:

  ```
  Create API endpoints for:
  1. Publishing content to specific platforms (POST /api/publish)
  2. Scheduling content for future publishing (POST /api/schedule)
  3. Retrieving publishing history (GET /api/publish/history)
  4. Canceling scheduled content (DELETE /api/schedule/:id)

  Support different content types (text, images, videos).
  Implement platform-specific formatting rules.
  Provide status tracking for scheduled content.
  ```

  **Implementation Example**:

  ```typescript
  // Prisma Schema
  model PublishJob {
    id           String   @id @default(cuid())
    userId       String
    content      Json     // Structured content data
    platforms    String[] // Array of platform ids to publish to
    status       String   // 'pending', 'published', 'failed', 'scheduled'
    scheduledFor DateTime?
    publishedAt  DateTime?
    errorDetails String?  @db.Text
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId])
    @@index([status])
    @@index([scheduledFor])
  }

  // API Route for publishing content
  // /app/api/publish/route.ts
  import { NextResponse } from 'next/server';
  import { db } from '@/lib/db';
  import { auth } from '@/lib/auth';
  import { publishToSocialMedia } from '@/lib/social-publishers';

  export async function POST(req: Request) {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const { content, platforms, scheduledFor } = await req.json();

      if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return new NextResponse("Invalid request data", { status: 400 });
      }

      // Create a publish job
      const job = await db.publishJob.create({
        data: {
          userId: session.user.id,
          content,
          platforms,
          status: scheduledFor ? 'scheduled' : 'pending',
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        }
      });

      // If not scheduled, publish immediately
      if (!scheduledFor) {
        // Process publishing in background
        publishToSocialMedia(job).catch(error => {
          console.error('Publishing error:', error);
        });
      }

      return NextResponse.json(job);
    } catch (error) {
      console.error('Error scheduling publish:', error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  ```

### 6.3 Implement Content Preview Generation

- **Description**: Create functionality to generate platform-specific previews.
- **Implementation Prompt**:

  ```
  Create a utility that generates visual previews of how content will appear on different platforms:
  1. Create a function that takes content and platform as input
  2. Format the content according to platform-specific requirements
  3. Generate HTML/CSS representation of how it will appear
  4. Return both the formatted content and preview HTML

  Support Twitter, LinkedIn, Facebook, and Instagram formats.
  Include character counts and limitations for each platform.
  Implement hashtag and mention handling appropriately.
  ```

## 7. Template Management

### 7.1 Create Template Management System

- **Description**: Implement a system for managing content templates.
- **Implementation Prompt**:

  ```
  Create API endpoints for:
  1. Creating templates (POST /api/templates)
  2. Listing available templates (GET /api/templates)
  3. Getting template details (GET /api/templates/:id)
  4. Updating templates (PUT /api/templates/:id)
  5. Deleting templates (DELETE /api/templates/:id)

  Support template categories and tags.
  Include versioning for templates.
  Allow both system-provided and user-created templates.
  ```

  **Implementation Example**:

  ```typescript
  // Prisma Schema
  model Template {
    id          String   @id @default(cuid())
    name        String
    description String?
    content     Json     // Template structure and variables
    category    String
    tags        String[]
    isSystem    Boolean  @default(false)
    version     Int      @default(1)
    userId      String?  // Null for system templates
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

    @@index([userId])
    @@index([category])
    @@index([tags])
  }

  // API Route for template operations
  // /app/api/templates/route.ts
  import { NextResponse } from 'next/server';
  import { db } from '@/lib/db';
  import { auth } from '@/lib/auth';

  export async function GET(req: Request) {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const { searchParams } = new URL(req.url);
      const category = searchParams.get('category');
      const tag = searchParams.get('tag');

      // Build query filters
      const where: any = {
        OR: [
          { isSystem: true },
          { userId: session.user.id }
        ]
      };

      if (category) {
        where.category = category;
      }

      if (tag) {
        where.tags = { has: tag };
      }

      const templates = await db.template.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          tags: true,
          isSystem: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return NextResponse.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  ```

### 7.2 Implement Template Favorites

- **Description**: Create endpoints for managing user's favorite templates.
- **Implementation Prompt**:

  ```
  Create API endpoints for template favorites:
  1. GET /api/templates/favorites - Get user's favorite templates
  2. POST /api/templates/[id]/favorite - Add a template to favorites
  3. DELETE /api/templates/[id]/favorite - Remove a template from favorites

  Implement proper many-to-many relationship handling in the database.
  Add sorting options for favorites (recently used, alphabetical, etc.).
  Implement authentication and proper error handling.
  ```

## 8. Frontend Components

### 8.1 Develop Frontend Components

- **Description**: Create reusable React components for the application UI.
- **Implementation Prompt**:

  ```
  Develop the following components:
  1. ContentEditor - WYSIWYG editor with AI assistance
  2. TemplateSelector - Interface for browsing and selecting templates
  3. PlatformConnector - UI for connecting social media platforms
  4. PublishingQueue - Display for scheduled and published content
  5. Analytics Dashboard - Charts and metrics for content performance

  Ensure components are responsive and accessible.
  Implement proper loading and error states.
  Create Storybook stories for each component.
  ```

  **Implementation Example**:

  ```tsx
  // /src/components/ui/ContentEditor.tsx
  'use client';

  import { useState, useCallback } from 'react';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent } from '@/components/ui/card';
  import { Editor } from '@/components/editor';
  import { AIAssistButton } from '@/components/ai-assist-button';
  import { useToast } from '@/components/ui/use-toast';
  import { SaveIcon, SendIcon, ImageIcon } from 'lucide-react';

  interface ContentEditorProps {
    initialContent?: string;
    onSave?: (content: string) => void;
    onPublish?: (content: string) => void;
  }

  export function ContentEditor({
    initialContent = '',
    onSave,
    onPublish,
  }: ContentEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleAIAssist = useCallback(
      async (prompt: string) => {
        try {
          setIsGenerating(true);
          const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, currentContent: content }),
          });

          if (!response.ok) throw new Error('AI generation failed');

          const { generatedContent } = await response.json();
          setContent((prevContent) => prevContent + generatedContent);

          toast({
            title: 'Content generated',
            description: 'AI has added content to your editor',
          });
        } catch (error) {
          console.error('AI generation error:', error);
          toast({
            title: 'Generation failed',
            description: 'Could not generate content. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsGenerating(false);
        }
      },
      [content, toast]
    );

    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Content Editor</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave?.(content)}
              >
                <SaveIcon className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onPublish?.(content)}
              >
                <SendIcon className="h-4 w-4 mr-1" />
                Publish
              </Button>
            </div>
          </div>

          <Editor
            value={content}
            onChange={setContent}
            placeholder="Start writing your content..."
          />

          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm">
              <ImageIcon className="h-4 w-4 mr-1" />
              Add Image
            </Button>
            <AIAssistButton
              onGenerate={handleAIAssist}
              isLoading={isGenerating}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
  ```

### 8.2 Implement Conversation List Component

- **Description**: Create a component for displaying and managing conversation history.
- **Implementation Prompt**:

  ```
  Create a conversation list component that:
  1. Displays a scrollable list of past conversations
  2. Shows conversation titles and timestamps
  3. Indicates the active conversation
  4. Allows creating new conversations
  5. Supports deleting conversations

  Implement proper loading states and error handling.
  Add search functionality for finding specific conversations.
  Make the component work well in the sidebar layout.
  Support keyboard navigation.
  ```

### 8.3 Implement Template Selection UI

- **Description**: Create a component for browsing and selecting templates.
- **Implementation Prompt**:

  ```
  Create a template selection component that:
  1. Displays templates grouped by category
  2. Shows template descriptions and usage counts
  3. Allows favoriting templates
  4. Provides a search function
  5. Shows recently used templates

  Implement a visually appealing grid or list layout.
  Add filter options for different template types.
  Include animations for selection and favoriting.
  Ensure the component is fully accessible.
  ```

## 9. Deployment and Infrastructure

### 9.1 Configure Database Connection Pooling

- **Description**: Set up connection pooling for optimal database performance.
- **Implementation Prompt**:

  ```
  Configure Prisma with connection pooling for production:
  1. Set up PgBouncer configuration for Supabase
  2. Update Prisma database URL format to support connection pooling
  3. Configure appropriate pool sizes based on expected load
  4. Add environment variables for connection pool configuration

  Include instructions for both development and production environments.
  Add monitoring recommendations for database connection usage.
  ```

### 9.2 Set Up Application Monitoring

- **Description**: Implement monitoring and error tracking.
- **Implementation Prompt**:

  ```
  Set up comprehensive monitoring for the application:
  1. Implement error tracking with Sentry or a similar service
  2. Add performance monitoring for API routes and database queries
  3. Set up logging for critical operations
  4. Configure alerting for system failures

  Ensure personally identifiable information is properly scrubbed from logs.
  Add appropriate context to errors for easier debugging.
  ```

### 9.3 Create Deployment Pipeline

- **Description**: Set up CI/CD pipeline for automated deployment.
- **Implementation Prompt**:

  ```
  Create a GitHub Actions workflow that:
  1. Runs on push to main branch and pull requests
  2. Installs dependencies
  3. Runs linting and type checking
  4. Runs unit and integration tests
  5. Deploys to staging environment on success
  6. Includes a manual approval step for production deployment

  Add environment-specific configuration handling.
  Include database migration steps in the deployment process.
  Implement rollback procedures for failed deployments.
  ```

  **Implementation Example**:

  ```yaml
  # .github/workflows/ci-cd.yml
  name: CI/CD Pipeline

  on:
    push:
      branches: [main]
    pull_request:
      branches: [main]

  jobs:
    test:
      name: Test and Lint
      runs-on: ubuntu-latest

      steps:
        - uses: actions/checkout@v3

        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'
            cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Lint
          run: npm run lint

        - name: Type check
          run: npm run typecheck

        - name: Run tests
          run: npm test

    deploy-staging:
      name: Deploy to Staging
      needs: test
      if: github.ref == 'refs/heads/main'
      runs-on: ubuntu-latest
      environment: staging

      steps:
        - uses: actions/checkout@v3

        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'
            cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Build
          run: npm run build
          env:
            DATABASE_URL: ${{ secrets.DATABASE_URL }}
            NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
            NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
            # Add other environment variables as needed

        - name: Run database migrations
          run: npx prisma migrate deploy
          env:
            DATABASE_URL: ${{ secrets.DATABASE_URL }}

        - name: Deploy to Vercel (Staging)
          uses: amondnet/vercel-action@v20
          with:
            vercel-token: ${{ secrets.VERCEL_TOKEN }}
            vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
            vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
            vercel-args: '--prod'

    deploy-production:
      name: Deploy to Production
      needs: deploy-staging
      runs-on: ubuntu-latest
      environment:
        name: production
        url: https://your-production-url.com

      steps:
        - uses: actions/checkout@v3

        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'
            cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Build
          run: npm run build
          env:
            DATABASE_URL: ${{ secrets.DATABASE_URL }}
            NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
            NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
            # Add other environment variables as needed

        - name: Run database migrations
          run: npx prisma migrate deploy
          env:
            DATABASE_URL: ${{ secrets.DATABASE_URL }}

        - name: Deploy to Vercel (Production)
          uses: amondnet/vercel-action@v20
          with:
            vercel-token: ${{ secrets.VERCEL_TOKEN }}
            vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
            vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
            vercel-args: '--prod'
  ```
