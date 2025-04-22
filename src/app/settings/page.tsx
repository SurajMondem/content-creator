export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Theme</h2>
          <p className="text-muted-foreground">
            Theme toggle will be implemented here.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
          <p className="text-muted-foreground">
            LinkedIn and Twitter account connections will be implemented here.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <p className="text-muted-foreground">
            User profile information and logout button will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
