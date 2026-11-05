import React, { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { StudioHub } from './components/StudioHub';
import { ToolBreadcrumb } from './components/ToolBreadcrumb';
import { SemioticSquareTool } from './components/tools/SemioticSquareTool';
import { ArchetypeWheelTool } from './components/tools/ArchetypeWheelTool';
import { MythEngineTool } from './components/tools/MythEngineTool';
import { StoryCircleTool } from './components/tools/StoryCircleTool';
import { SignifierAuditTool } from './components/tools/SignifierAuditTool';
import { CodeEvolutionTool } from './components/tools/CodeEvolutionTool';
import { RhetoricDesignerTool } from './components/tools/RhetoricDesignerTool';
import { ReceptionRadarTool } from './components/tools/ReceptionRadarTool';
import { createBlankProject, PRESET_BRAND_PROJECTS } from './data/presets';
import { BrandProject, ToolId } from './types/studio';
import { validateAndParseBrandProject } from './utils/semioticEngines';

const STORAGE_KEY = 'signum_atelier_projects_v1';
const ACTIVE_ID_KEY = 'signum_atelier_active_id_v1';

export default function App() {
  const [projects, setProjects] = useState<BrandProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to presets on corrupted storage
    }
    return PRESET_BRAND_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      return localStorage.getItem(ACTIVE_ID_KEY) || PRESET_BRAND_PROJECTS[0].id;
    } catch {
      return PRESET_BRAND_PROJECTS[0].id;
    }
  });

  const [activeTool, setActiveTool] = useState<ToolId>('hub');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandSector, setNewBrandSector] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? projects[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      localStorage.setItem(ACTIVE_ID_KEY, activeProject.id);
    } catch {
      // Ignore storage quota errors
    }
  }, [projects, activeProject.id]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const updateActiveProject = (updated: BrandProject) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(activeProject, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-semiotic-dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Exported ${activeProject.name} dossier`);
  };

  const handleImportJson = (raw: string) => {
    const validated = validateAndParseBrandProject(raw);
    if (!validated) {
      notify('Invalid or unsafe JSON dossier rejected');
      return;
    }
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === validated.id);
      return exists
        ? prev.map((p) => (p.id === validated.id ? validated : p))
        : [validated, ...prev];
    });
    setActiveProjectId(validated.id);
    notify(`Imported ${validated.name}`);
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const created = createBlankProject(newBrandName, newBrandSector);
    setProjects((prev) => [created, ...prev]);
    setActiveProjectId(created.id);
    setNewBrandName('');
    setNewBrandSector('');
    setShowNewModal(false);
    setActiveTool('hub');
    notify(`Created workspace for ${created.name}`);
  };

  const handleResetPresets = () => {
    setProjects(PRESET_BRAND_PROJECTS);
    setActiveProjectId(PRESET_BRAND_PROJECTS[0].id);
    notify('Restored default brand case studies');
  };

  return (
    <div className="min-h-screen bg-[#121316] text-[#F3EFE6] flex flex-col">
      <TopBar
        projects={projects}
        activeProject={activeProject}
        activeTool={activeTool}
        onSelectProject={(id) => setActiveProjectId(id)}
        onNavigate={(tool) => setActiveTool(tool)}
        onOpenNewModal={() => setShowNewModal(true)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {activeTool !== 'hub' && (
        <ToolBreadcrumb
          activeTool={activeTool}
          onNavigate={(tool) => setActiveTool(tool)}
        />
      )}

      <div className="flex-1">
        {activeTool === 'hub' && (
          <StudioHub
            project={activeProject}
            onSelectTool={(tool) => setActiveTool(tool)}
            onUpdateProject={updateActiveProject}
            onResetPresets={handleResetPresets}
          />
        )}
        {activeTool === 'semiotic-square' && (
          <SemioticSquareTool
            project={activeProject}
            onUpdate={(semioticSquare) =>
              updateActiveProject({ ...activeProject, semioticSquare })
            }
          />
        )}
        {activeTool === 'archetypes' && (
          <ArchetypeWheelTool
            project={activeProject}
            onUpdate={(archetypes) =>
              updateActiveProject({ ...activeProject, archetypes })
            }
          />
        )}
        {activeTool === 'myth-engine' && (
          <MythEngineTool
            project={activeProject}
            onUpdate={(mythEngine) =>
              updateActiveProject({ ...activeProject, mythEngine })
            }
          />
        )}
        {activeTool === 'story-circle' && (
          <StoryCircleTool
            project={activeProject}
            onUpdate={(storyCircle) =>
              updateActiveProject({ ...activeProject, storyCircle })
            }
          />
        )}
        {activeTool === 'signifier-audit' && (
          <SignifierAuditTool
            project={activeProject}
            onUpdate={(signifierAudit) =>
              updateActiveProject({ ...activeProject, signifierAudit })
            }
          />
        )}
        {activeTool === 'code-mapper' && (
          <CodeEvolutionTool
            project={activeProject}
            onUpdate={(codeMapper) =>
              updateActiveProject({ ...activeProject, codeMapper })
            }
          />
        )}
        {activeTool === 'rhetoric-designer' && (
          <RhetoricDesignerTool
            project={activeProject}
            onUpdate={(rhetoricDesigner) =>
              updateActiveProject({ ...activeProject, rhetoricDesigner })
            }
          />
        )}
        {activeTool === 'reception-radar' && (
          <ReceptionRadarTool
            project={activeProject}
            onUpdate={(receptionRadar) =>
              updateActiveProject({ ...activeProject, receptionRadar })
            }
          />
        )}
      </div>

      {/* New Brand Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-brand-title"
        >
          <form
            onSubmit={handleCreateBrand}
            className="w-full max-w-md bg-[#181A1F] border border-[#F3EFE6]/15 rounded-lg p-6 space-y-4"
          >
            <h2 id="new-brand-title" className="text-lg font-semibold text-[#F3EFE6]">
              New Brand Workspace
            </h2>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">Brand Name</label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g., Solis Horology"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-sm text-[#F3EFE6]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">Category / Sector</label>
              <input
                type="text"
                placeholder="e.g., Mechanical Timepieces"
                value={newBrandSector}
                onChange={(e) => setNewBrandSector(e.target.value)}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-sm text-[#F3EFE6]"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#A39E93] hover:text-[#F3EFE6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded cursor-pointer"
              >
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subtle Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#1F2229] border border-amber-500/50 text-[#F3EFE6] text-xs font-mono-tabular px-4 py-2.5 rounded shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
