import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import {
  BrandProject,
  CodeMapperData,
  CulturalCodeItem,
  CulturalStage,
} from '../../types/studio';

interface CodeEvolutionToolProps {
  project: BrandProject;
  onUpdate: (data: CodeMapperData) => void;
}

const STAGES: Array<{ id: CulturalStage; title: string; subtitle: string }> = [
  {
    id: 'residual',
    title: 'Residual Codes',
    subtitle: 'Legacy industry tropes losing cultural resonance',
  },
  {
    id: 'dominant',
    title: 'Dominant Codes',
    subtitle: 'Mainstream category baseline expectations',
  },
  {
    id: 'emergent',
    title: 'Emergent Codes',
    subtitle: 'Forward-looking cultural signals gaining traction',
  },
];

export const CodeEvolutionTool: React.FC<CodeEvolutionToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.codeMapper;
  const [filterCat, setFilterCat] = useState<string>('All');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CulturalCodeItem['category']>('Visual');
  const [stage, setStage] = useState<CulturalStage>('emergent');
  const [rationale, setRationale] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newItem: CulturalCodeItem = {
      id: `code-${Date.now()}`,
      title: title.trim(),
      category,
      stage,
      rationale: rationale.trim() || 'Observed cultural signal in category audit.',
    };
    onUpdate({
      items: [newItem, ...data.items],
    });
    setTitle('');
    setRationale('');
  };

  const moveStage = (id: string, nextStage: CulturalStage) => {
    onUpdate({
      items: data.items.map((it) => (it.id === id ? { ...it, stage: nextStage } : it)),
    });
  };

  const removeItem = (id: string) => {
    onUpdate({
      items: data.items.filter((it) => it.id !== id),
    });
  };

  const filtered =
    filterCat === 'All'
      ? data.items
      : data.items.filter((it) => it.category === filterCat);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular text-amber-400">
            06 · Raymond Williams Cultural Studies
          </p>
          <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
            Cultural Trend &amp; Code Evolution Mapper
          </h1>
          <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
            Audit {project.name}’s visual, verbal, and material codes across Residual, Dominant, and Emergent cultural horizons.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#181A1F] p-1 rounded-md border border-[#F3EFE6]/10">
          {['All', 'Visual', 'Verbal', 'Material', 'Ritual'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filterCat === cat
                  ? 'bg-amber-500 text-[#121316] font-semibold'
                  : 'text-[#A39E93] hover:text-[#F3EFE6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Cultural Code Form */}
      <form
        onSubmit={handleAdd}
        className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
      >
        <div className="md:col-span-4">
          <label className="block text-xs text-[#A39E93] mb-1">Cultural Code / Trope</label>
          <input
            type="text"
            placeholder="e.g., Unbleached linen archival binding"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-[#A39E93] mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CulturalCodeItem['category'])}
            className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
          >
            <option value="Visual">Visual</option>
            <option value="Verbal">Verbal</option>
            <option value="Material">Material</option>
            <option value="Ritual">Ritual</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-[#A39E93] mb-1">Horizon</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as CulturalStage)}
            className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
          >
            <option value="residual">Residual</option>
            <option value="dominant">Dominant</option>
            <option value="emergent">Emergent</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs text-[#A39E93] mb-1">Strategic Rationale</label>
          <input
            type="text"
            placeholder="Why it matters..."
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
          />
        </div>
        <div className="md:col-span-1">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* 3-Column Horizontal Swimlane Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {STAGES.map((col, colIdx) => {
          const colItems = filtered.filter((it) => it.stage === col.id);
          return (
            <div
              key={col.id}
              className={`bg-[#181A1F] border rounded-lg p-6 space-y-4 ${
                col.id === 'emergent' ? 'border-amber-500/40' : 'border-[#F3EFE6]/10'
              }`}
            >
              <div className="pb-3 border-b border-[#F3EFE6]/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#F3EFE6]">{col.title}</h2>
                  <span className="font-mono-tabular text-xs text-amber-400">
                    {colItems.length}
                  </span>
                </div>
                <p className="text-xs text-[#A39E93] mt-1">{col.subtitle}</p>
              </div>

              <div className="space-y-3">
                {colItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#121316] border border-[#F3EFE6]/10 rounded p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#A39E93]">
                      <span className="font-mono-tabular">{item.category}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="hover:text-red-400 cursor-pointer"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-sm font-medium text-[#F3EFE6]">{item.title}</div>
                    <p className="font-editorial text-xs text-[#A39E93] leading-relaxed">
                      {item.rationale}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      {colIdx > 0 ? (
                        <button
                          type="button"
                          onClick={() => moveStage(item.id, STAGES[colIdx - 1].id)}
                          className="inline-flex items-center gap-1 text-[#A39E93] hover:text-amber-400 cursor-pointer"
                        >
                          <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                          <span>{STAGES[colIdx - 1].title.split(' ')[0]}</span>
                        </button>
                      ) : (
                        <span />
                      )}
                      {colIdx < STAGES.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveStage(item.id, STAGES[colIdx + 1].id)}
                          className="inline-flex items-center gap-1 text-[#A39E93] hover:text-amber-400 cursor-pointer"
                        >
                          <span>{STAGES[colIdx + 1].title.split(' ')[0]}</span>
                          <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#A39E93] border border-dashed border-[#F3EFE6]/10 rounded">
                    No codes in this horizon.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
