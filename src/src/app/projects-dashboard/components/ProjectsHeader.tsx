'use client';
import React, { useState } from 'react';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import NewProjectModal from './NewProjectModal';

export default function ProjectsHeader() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Build and manage your AI-generated websites</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>
      {/* Search + filter row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
            className="input-base pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button className="btn-secondary flex items-center gap-2">
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>
      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}