export default function TemplatesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Templates</h1>

      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-muted-foreground mb-4">
          This is where you&apos;ll find and manage your content templates.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-md bg-muted/30">
            <h3 className="text-lg font-medium mb-2">LinkedIn Professional</h3>
            <p className="text-sm text-muted-foreground">
              Formal tone, perfect for professional networking and industry
              insights.
            </p>
          </div>

          <div className="p-4 border rounded-md bg-muted/30">
            <h3 className="text-lg font-medium mb-2">Twitter Casual</h3>
            <p className="text-sm text-muted-foreground">
              Conversational tone, ideal for engaging with your audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
