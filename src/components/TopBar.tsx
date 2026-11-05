import React, { useRef } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import { BrandProject, ToolId } from '../types/studio';

interface TopBarProps {
  projects: BrandProject[];
  activeProject: BrandProject;
  activeTool: ToolId;
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
    <header className="sticky top-0 z-30 bg-[#121316]/95 backdrop-blur-sm border-b border-[#F3EFE6]/10 px-6 lg:px-10 py-3.5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('hub')}
          className="text-lg font-semibold tracking-tight text-[#F3EFE6] hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Signum Atelier
        </button>

        {/* Zone 2: Concise single-line navigation & workspace controls */}
        <nav className="flex items-center gap-6 text-sm text-[#A39E93] overflow-x-auto">
          <button
            type="button"
            onClick={() => onNavigate('hub')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTool === 'hub'
                ? 'text-[#F3EFE6] font-medium underline underline-offset-8 decoration-amber-500'
                : 'hover:text-[#F3EFE6]'
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
              className="bg-[#181A1F] text-[#F3EFE6] text-xs font-medium border border-[#F3EFE6]/15 rounded-md px-3 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
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
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A39E93] hover:text-[#F3EFE6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>New Brand</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A39E93] hover:text-[#F3EFE6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onExportJson}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
