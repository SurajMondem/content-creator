export default function NewPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-muted-foreground mb-4">
          This is where you&apos;ll create and format new content for your
          social media platforms.
        </p>

        <div className="p-4 border border-dashed rounded-md bg-muted flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Content editor will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
}
