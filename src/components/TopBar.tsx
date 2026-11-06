import React, { useRef } from 'react';
import { Download, Moon, Plus, Sun, Upload } from 'lucide-react';
import { BrandProject, ToolId } from '../types/studio';

interface TopBarProps {
  projects: BrandProject[];
  activeProject: BrandProject;
  activeTool: ToolId;
  paperMode: boolean;
  onTogglePaperMode: () => void;
  onSelectProject: (id: string) => void;
  onNavigate: (tool: ToolId) => void;
  onOpenNewModal: () => void;
  onExportJson: () => void;
  onImportJson: (raw: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  projects,
  activeProject,
  activeTool,
  paperMode,
  onTogglePaperMode,
  onSelectProject,
  onNavigate,
  onOpenNewModal,
  onExportJson,
  onImportJson,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImportJson(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-canvas)]/95 backdrop-blur-sm border-b border-[var(--border-hairline)] px-6 lg:px-10 py-3.5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('hub')}
          className="text-lg font-semibold tracking-tight text-[var(--ink-primary)] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
        >
          Signum Atelier
        </button>

        {/* Zone 2: Concise single-line navigation & workspace controls */}
        <nav className="flex items-center gap-6 text-sm text-[var(--ink-secondary)] overflow-x-auto">
          <button
            type="button"
            onClick={() => onNavigate('hub')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTool === 'hub'
                ? paperMode
                  ? 'text-[var(--ink-primary)] font-medium underline underline-offset-8 decoration-indigo-600'
                  : 'text-[var(--ink-primary)] font-medium underline underline-offset-8 decoration-amber-500'
                : 'hover:text-[var(--ink-primary)]'
            }`}
          >
            Studio Hub
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="brand-selector" className="sr-only">
              Active Brand
            </label>
            <select
              id="brand-selector"
              value={activeProject.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-[var(--bg-surface)] text-[var(--ink-primary)] text-xs font-medium border border-[var(--border-hairline)] rounded-md px-3 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-amber-500 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>New Brand</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={onTogglePaperMode}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Switch between Dark Archival and Paper-Canvas Studio"
          >
            {paperMode ? (
              <Moon className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            )}
            <span>{paperMode ? 'Paper Studio' : 'Dark Archival'}</span>
          </button>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onExportJson}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              paperMode
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-[#121316]'
            }`}
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
