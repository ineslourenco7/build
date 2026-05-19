import Link from 'next/link';
import ProjectsDashboardPage from './projects-dashboard/page';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative">
      <div className="fixed bottom-6 right-6 z-[60]">
        <Link
          href="/ai-builder-workspace"
          className="btn-primary shadow-2xl px-5 py-3 rounded-full flex items-center gap-2"
        >
          <Sparkles size={18} />
          Open AI Builder
        </Link>
      </div>
      <ProjectsDashboardPage />
    </div>
  );
}
