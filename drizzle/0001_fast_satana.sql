CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text
);
--> statement-breakpoint
ALTER TABLE "embeddings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Users can CRUD their own generated content." ON "generated_content" CASCADE;--> statement-breakpoint
DROP TABLE "generated_content" CASCADE;--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "exclusive_embedding_ref";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_id_fkey";
--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_content_id_fkey";
--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_conversation_id_fkey";
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "embeddings" DROP COLUMN "conversation_id";--> statement-breakpoint
ALTER TABLE "embeddings" DROP COLUMN "content_id";