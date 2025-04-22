export default function PostsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Recent Posts</h1>

      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-muted-foreground mb-4">
          This is where you&apos;ll see a list of your recent posts and their
          status.
        </p>

        <div className="p-4 border border-dashed rounded-md bg-muted flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Posts list will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}
