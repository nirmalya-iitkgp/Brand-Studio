import React from 'react';
import { RefreshCw } from 'lucide-react';
import {
  BrandProject,
  RhetoricDesignerData,
  RhetoricalTransformation,
} from '../../types/studio';
import { synthesizeRhetoricalTropes } from '../../utils/semioticEngines';

interface RhetoricDesignerToolProps {
  project: BrandProject;
  onUpdate: (data: RhetoricDesignerData) => void;
}

const TROPE_LABELS: Record<RhetoricalTransformation['trope'], string> = {
  metaphor: '01 · Metaphor (Substitution)',
  metonymy: '02 · Metonymy (Association)',
  synecdoche: '03 · Synecdoche (Part for Whole)',
  irony: '04 · Irony (Contrast & Subversion)',
};

export const RhetoricDesignerTool: React.FC<RhetoricDesignerToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.rhetoricDesigner;

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    const next = synthesizeRhetoricalTropes(
      data.rawFeature,
      project.name,
      data.targetTone
    );
    onUpdate({
      ...data,
      transformations: next,
    });
  };

  const updateCard = (
    trope: RhetoricalTransformation['trope'],
    patch: Partial<RhetoricalTransformation>
  ) => {
    onUpdate({
      ...data,
      transformations: data.transformations.map((t) =>
        t.trope === trope ? { ...t, ...patch } : t
      ),
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <p className="text-xs font-mono-tabular text-amber-400">
          07 · Classical Literary Rhetoric
        </p>
        <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
          Rhetorical Tropes &amp; Metaphor Designer
        </h1>
        <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
          Transform literal product features into memorable brand language across Metaphor, Metonymy, Synecdoche, and Irony.
        </p>
      </div>

      {/* Input Workbench */}
      <form
        onSubmit={handleSynthesize}
        className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end"
      >
        <div className="lg:col-span-7">
          <label className="block text-xs text-[#A39E93] mb-1.5">
            Raw Product Feature or Functional Claim
          </label>
          <input
            type="text"
            value={data.rawFeature}
            onChange={(e) => onUpdate({ ...data, rawFeature: e.target.value })}
            placeholder="e.g., Cold-pressed alpine gentian root oil in UV-filtering amber glass"
            className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3.5 py-2 text-sm text-[#F3EFE6]"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="block text-xs text-[#A39E93] mb-1.5">
            Rhetorical Register
          </label>
          <select
            value={data.targetTone}
            onChange={(e) =>
              onUpdate({
                ...data,
                targetTone: e.target.value as RhetoricDesignerData['targetTone'],
              })
            }
            className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3.5 py-2 text-sm text-[#F3EFE6]"
          >
            <option value="Archival">Archival</option>
            <option value="Provocative">Provocative</option>
            <option value="Intimate">Intimate</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Synthesize Tropes</span>
          </button>
        </div>
      </form>

      {/* 4 Rhetorical Trope Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.transformations.map((item) => (
          <div
            key={item.trope}
            className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-4"
          >
            <div className="text-xs font-mono-tabular text-amber-400">
              {TROPE_LABELS[item.trope]}
            </div>

            <div>
              <label className="block text-xs text-[#A39E93] mb-1">Headline</label>
              <input
                type="text"
                value={item.headline}
                onChange={(e) => updateCard(item.trope, { headline: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-base font-semibold text-[#F3EFE6]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A39E93] mb-1">Copy Execution</label>
              <textarea
                rows={2}
                value={item.body}
                onChange={(e) => updateCard(item.trope, { body: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 font-editorial text-sm text-[#F3EFE6]/90 leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-[#F3EFE6]/10 text-xs text-[#A39E93]">
              {item.mechanism}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
