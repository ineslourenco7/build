import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProjectsStatsBar from './components/ProjectsStatsBar';
import ProjectsGrid from './components/ProjectsGrid';
import ProjectsHeader from './components/ProjectsHeader';

export default function ProjectsDashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
        <ProjectsHeader />
        <ProjectsStatsBar />
        <ProjectsGrid />
      </div>
    </AppLayout>
  );
}