import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BrandProject, SemioticSquareData } from '../../types/studio';
import { clamp, computeSemioticQuadrant } from '../../utils/semioticEngines';

interface SemioticSquareToolProps {
  project: BrandProject;
  onUpdate: (data: SemioticSquareData) => void;
}

const VECTOR_PRESETS = [
  {
    name: 'Wild Nature vs. Clinical Science',
    s1: 'Wild Botanical',
    s2: 'Clinical Synthetic',
    notS2: 'Empirical Alchemy (Not-Synthetic)',
    notS1: 'Sterile Minimalist (Not-Wild)',
  },
  {
    name: 'Individuality vs. Belonging',
    s1: 'Radical Autonomy',
    s2: 'Collective Ritual',
    notS2: 'Curated Salon (Not-Collective)',
    notS1: 'Anonymous Utility (Not-Autonomous)',
  },
  {
    name: 'Heritage Craft vs. Algorithmic Speed',
    s1: 'Archival Craft',
    s2: 'Instant Automation',
    notS2: 'Deliberate Precision (Not-Instant)',
    notS1: 'Disposable Novelty (Not-Archival)',
  },
];

export const SemioticSquareTool: React.FC<SemioticSquareToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.semioticSquare;
  const [newCompName, setNewCompName] = useState('');

  const quadrant = computeSemioticQuadrant(
    data.brandPosition.x,
    data.brandPosition.y,
    data
  );

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;
    onUpdate({
      ...data,
      brandPosition: {
        x: Math.round(clamp(relX, 8, 92)),
        y: Math.round(clamp(relY, 8, 92)),
      },
    });
  };

  const applyPreset = (preset: (typeof VECTOR_PRESETS)[number]) => {
    onUpdate({
      ...data,
      activeVector: preset.name,
      s1: preset.s1,
      s2: preset.s2,
      notS2: preset.notS2,
      notS1: preset.notS1,
    });
  };

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;
    onUpdate({
      ...data,
      competitors: [
        ...data.competitors,
        {
          id: `comp-${Date.now()}`,
          name: newCompName.trim(),
          x: 50,
          y: 30,
        },
      ],
    });
    setNewCompName('');
  };

  const removeCompetitor = (id: string) => {
    onUpdate({
      ...data,
      competitors: data.competitors.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular text-amber-400">
            01 · Greimas Structural Semiotics
          </p>
          <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
            Semiotic Square Matrix Generator
          </h1>
          <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
            Click anywhere inside the 4-corner relational matrix to position {project.name} across contraries, contradictions, and sub-contrary synthesis zones.
          </p>
        </div>

        {/* Baseline Vector Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#181A1F] p-1 rounded-md border border-[#F3EFE6]/10">
          {VECTOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                data.activeVector === preset.name
                  ? 'bg-amber-500 text-[#121316] font-semibold'
                  : 'text-[#A39E93] hover:text-[#F3EFE6]'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive 4-Node Relational Graph */}
        <div className="lg:col-span-7 bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6">
          <div className="flex items-center justify-between text-xs text-[#A39E93] mb-4">
            <span>Interactive Relational Matrix (Click to place brand)</span>
            <span className="font-mono-tabular">
              X: {data.brandPosition.x} · Y: {data.brandPosition.y}
            </span>
          </div>

          <svg
            viewBox="0 0 500 400"
            onClick={handleSvgClick}
            className="w-full h-auto bg-[#121316] border border-[#F3EFE6]/10 rounded cursor-crosshair select-none"
            role="img"
            aria-label="Greimas Semiotic Square interactive positioning graph"
          >
            {/* Quadrant Subtle Grid */}
            <line x1="250" y1="20" x2="250" y2="380" stroke="rgba(243,239,230,0.08)" strokeDasharray="4 4" />
            <line x1="20" y1="200" x2="480" y2="200" stroke="rgba(243,239,230,0.08)" strokeDasharray="4 4" />

            {/* Contrary Axis (Top: S1 <-> S2) */}
            <line x1="90" y1="75" x2="410" y2="75" stroke="#D97706" strokeWidth="1.5" />
            {/* Sub-Contrary Axis (Bottom: ~S2 <-> ~S1) */}
            <line x1="90" y1="325" x2="410" y2="325" stroke="rgba(243,239,230,0.35)" strokeWidth="1.5" strokeDasharray="5 4" />
            {/* Implication Axes (Left & Right) */}
            <line x1="90" y1="75" x2="90" y2="325" stroke="rgba(243,239,230,0.25)" strokeWidth="1.2" />
            <line x1="410" y1="75" x2="410" y2="325" stroke="rgba(243,239,230,0.25)" strokeWidth="1.2" />
            {/* Contradiction Diagonals */}
            <line x1="90" y1="75" x2="410" y2="325" stroke="rgba(243,239,230,0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="410" y1="75" x2="90" y2="325" stroke="rgba(243,239,230,0.15)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Relation Labels */}
            <text x="250" y="65" textAnchor="middle" fill="#A39E93" fontSize="10" fontFamily="JetBrains Mono">
              CONTRARY AXIS
            </text>
            <text x="250" y="343" textAnchor="middle" fill="#A39E93" fontSize="10" fontFamily="JetBrains Mono">
              SUB-CONTRARY SYNTHESIS
            </text>

            {/* 4 Corner Nodes */}
            <g>
              <circle cx="90" cy="75" r="7" fill="#181A1F" stroke="#F59E0B" strokeWidth="2" />
              <text x="90" y="52" textAnchor="middle" fill="#F3EFE6" fontSize="12" fontWeight="600">
                S1: {data.s1}
              </text>
            </g>
            <g>
              <circle cx="410" cy="75" r="7" fill="#181A1F" stroke="#F59E0B" strokeWidth="2" />
              <text x="410" y="52" textAnchor="middle" fill="#F3EFE6" fontSize="12" fontWeight="600">
                S2: {data.s2}
              </text>
            </g>
            <g>
              <circle cx="90" cy="325" r="7" fill="#181A1F" stroke="#A39E93" strokeWidth="2" />
              <text x="90" y="362" textAnchor="middle" fill="#F3EFE6" fontSize="11" fontWeight="500">
                ¬S2: {data.notS2}
              </text>
            </g>
            <g>
              <circle cx="410" cy="325" r="7" fill="#181A1F" stroke="#A39E93" strokeWidth="2" />
              <text x="410" y="362" textAnchor="middle" fill="#F3EFE6" fontSize="11" fontWeight="500">
                ¬S1: {data.notS1}
              </text>
            </g>

            {/* Competitors */}
            {data.competitors.map((comp) => {
              const cx = (comp.x / 100) * 500;
              const cy = (comp.y / 100) * 400;
              return (
                <g key={comp.id}>
                  <circle cx={cx} cy={cy} r="5" fill="#A39E93" opacity="0.85" />
                  <text x={cx} y={cy - 10} textAnchor="middle" fill="#A39E93" fontSize="10">
                    {comp.name}
                  </text>
                </g>
              );
            })}

            {/* Active Brand Position */}
            <g>
              <circle
                cx={(data.brandPosition.x / 100) * 500}
                cy={(data.brandPosition.y / 100) * 400}
                r="14"
                fill="rgba(245, 158, 11, 0.18)"
              />
              <circle
                cx={(data.brandPosition.x / 100) * 500}
                cy={(data.brandPosition.y / 100) * 400}
                r="6.5"
                fill="#F59E0B"
              />
              <text
                x={(data.brandPosition.x / 100) * 500}
                y={(data.brandPosition.y / 100) * 400 - 14}
                textAnchor="middle"
                fill="#F59E0B"
                fontSize="11"
                fontWeight="700"
              >
                {project.name}
              </text>
            </g>
          </svg>
        </div>

        {/* Right Column: Pole Editors, Quadrant Readout & Competitors */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-3">
            <div className="text-xs font-mono-tabular text-amber-400">
              Active Territory · {quadrant.zone}
            </div>
            <h2 className="text-lg font-semibold text-[#F3EFE6]">{quadrant.label}</h2>
            <p className="font-editorial text-sm text-[#F3EFE6]/85 leading-relaxed">
              {quadrant.insight}
            </p>
          </div>

          <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#F3EFE6]">
              Define Semiotic Poles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">S1 (Primary Assertion)</label>
                <input
                  type="text"
                  value={data.s1}
                  onChange={(e) => onUpdate({ ...data, s1: e.target.value })}
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">S2 (Direct Contrary)</label>
                <input
                  type="text"
                  value={data.s2}
                  onChange={(e) => onUpdate({ ...data, s2: e.target.value })}
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">¬S2 (Sub-Contrary)</label>
                <input
                  type="text"
                  value={data.notS2}
                  onChange={(e) => onUpdate({ ...data, notS2: e.target.value })}
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">¬S1 (Negation)</label>
                <input
                  type="text"
                  value={data.notS1}
                  onChange={(e) => onUpdate({ ...data, notS1: e.target.value })}
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#F3EFE6]">
              Competitor Territory Mapping
            </h3>
            <form onSubmit={handleAddCompetitor} className="flex gap-2">
              <input
                type="text"
                placeholder="Add competitor name..."
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
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

            <div className="space-y-2">
              {data.competitors.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-[#F3EFE6]/10 last:border-none text-xs"
                >
                  <span className="text-[#F3EFE6] font-medium truncate">{comp.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[#A39E93] font-mono-tabular">
                      X
                      <input
                        type="number"
                        min={5}
                        max={95}
                        value={comp.x}
                        onChange={(e) =>
                          onUpdate({
                            ...data,
                            competitors: data.competitors.map((c) =>
                              c.id === comp.id ? { ...c, x: clamp(Number(e.target.value), 5, 95) } : c
                            ),
                          })
                        }
                        className="ml-1 w-12 bg-[#121316] border border-[#F3EFE6]/15 rounded px-1.5 py-0.5 text-right font-mono-tabular"
                      />
                    </label>
                    <label className="text-[#A39E93] font-mono-tabular">
                      Y
                      <input
                        type="number"
                        min={5}
                        max={95}
                        value={comp.y}
                        onChange={(e) =>
                          onUpdate({
                            ...data,
                            competitors: data.competitors.map((c) =>
                              c.id === comp.id ? { ...c, y: clamp(Number(e.target.value), 5, 95) } : c
                            ),
                          })
                        }
                        className="ml-1 w-12 bg-[#121316] border border-[#F3EFE6]/15 rounded px-1.5 py-0.5 text-right font-mono-tabular"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeCompetitor(comp.id)}
                      className="text-[#A39E93] hover:text-red-400 p-1 cursor-pointer"
                      aria-label={`Remove ${comp.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
