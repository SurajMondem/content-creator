import { VercelV0Chat } from '@/components/ui/v0-ai-chat';

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)]">
      <VercelV0Chat />
    </div>
  );
}
