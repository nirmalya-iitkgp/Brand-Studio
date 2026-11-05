import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BrandProject, MythEngineData } from '../../types/studio';

interface MythEngineToolProps {
  project: BrandProject;
  onUpdate: (data: MythEngineData) => void;
}

export const MythEngineTool: React.FC<MythEngineToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.mythEngine;
  const [newProof, setNewProof] = useState('');

  const handleAddProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProof.trim()) return;
    onUpdate({
      ...data,
      proofPoints: [...data.proofPoints, newProof.trim()],
    });
    setNewProof('');
  };

  const removeProof = (idx: number) => {
    onUpdate({
      ...data,
      proofPoints: data.proofPoints.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <p className="text-xs font-mono-tabular text-amber-400">
          03 · Lévi-Strauss Structural Anthropology
        </p>
        <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
          Structural Myth-Building Canvas
        </h1>
        <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
          Map how {project.name} resolves fundamental societal binary tensions by acting as the mediating cultural bridge.
        </p>
      </div>

      {/* Three-Column Tension Balance Board + Central Brand Resolution Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Cultural Pole */}
        <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-xs font-mono-tabular text-[#A39E93]">
              Cultural Pole A · Thesis
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">Pole Title</label>
              <input
                type="text"
                value={data.leftPole}
                onChange={(e) => onUpdate({ ...data, leftPole: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-sm font-semibold text-[#F3EFE6]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                Underlying Societal Anxiety
              </label>
              <textarea
                rows={4}
                value={data.leftAnxiety}
                onChange={(e) => onUpdate({ ...data, leftAnxiety: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 font-editorial text-sm text-[#F3EFE6]/90 leading-relaxed"
              />
            </div>
          </div>
          <div className="pt-4 border-t border-[#F3EFE6]/10 text-xs text-[#A39E93]">
            Unmediated extreme leads to consumer friction.
          </div>
        </div>

        {/* Central Brand Resolution Bridge */}
        <div className="bg-[#1F2229] border border-amber-500/50 rounded-lg p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="text-xs font-mono-tabular text-amber-400">
              Central Mediating Bridge · {project.name}
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                Brand Resolution Thesis
              </label>
              <textarea
                rows={3}
                value={data.brandBridge}
                onChange={(e) => onUpdate({ ...data, brandBridge: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 font-editorial text-sm text-[#F3EFE6] leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                Mediating Consumer Ritual
              </label>
              <textarea
                rows={2}
                value={data.mediatingRitual}
                onChange={(e) => onUpdate({ ...data, mediatingRitual: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]/90 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F3EFE6]/10 space-y-3">
            <div className="text-xs font-semibold text-[#F3EFE6]">
              Material &amp; Behavioral Proof Points
            </div>
            <ul className="space-y-2">
              {data.proofPoints.map((pt, idx) => (
                <li
                  key={idx}
                  className="flex items-start justify-between gap-2 text-xs text-[#F3EFE6]/85 bg-[#121316] px-3 py-2 rounded border border-[#F3EFE6]/10"
                >
                  <span>{pt}</span>
                  <button
                    type="button"
                    onClick={() => removeProof(idx)}
                    className="text-[#A39E93] hover:text-red-400 shrink-0 cursor-pointer"
                    aria-label="Remove proof point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddProof} className="flex gap-2">
              <input
                type="text"
                placeholder="Add mediating proof..."
                value={newProof}
                onChange={(e) => setNewProof(e.target.value)}
                className="flex-1 bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Cultural Pole */}
        <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-xs font-mono-tabular text-[#A39E93]">
              Cultural Pole B · Antithesis
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">Pole Title</label>
              <input
                type="text"
                value={data.rightPole}
                onChange={(e) => onUpdate({ ...data, rightPole: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-sm font-semibold text-[#F3EFE6]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                Underlying Societal Anxiety
              </label>
              <textarea
                rows={4}
                value={data.rightAnxiety}
                onChange={(e) => onUpdate({ ...data, rightAnxiety: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 font-editorial text-sm text-[#F3EFE6]/90 leading-relaxed"
              />
            </div>
          </div>
          <div className="pt-4 border-t border-[#F3EFE6]/10 text-xs text-[#A39E93]">
            Unmediated extreme leads to cultural alienation.
          </div>
        </div>
      </div>
    </div>
  );
};
