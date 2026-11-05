import React, { useState } from 'react';
import { ArrowUpRight, Check, Pencil, RotateCcw } from 'lucide-react';
import { BrandProject, ToolId } from '../types/studio';
import {
  analyzeArchetypeAlignment,
  computeSemioticQuadrant,
  evaluateReceptionRisk,
} from '../utils/semioticEngines';

interface StudioHubProps {
  project: BrandProject;
  onSelectTool: (tool: ToolId) => void;
  onUpdateProject: (updated: BrandProject) => void;
  onResetPresets: () => void;
}

export const StudioHub: React.FC<StudioHubProps> = ({
  project,
  onSelectTool,
  onUpdateProject,
  onResetPresets,
}) => {
  const [editingBrief, setEditingBrief] = useState(false);
  const [draftName, setDraftName] = useState(project.name);
  const [draftSector, setDraftSector] = useState(project.sector);
  const [draftThesis, setDraftThesis] = useState(project.thesis);

  const quadrant = computeSemioticQuadrant(
    project.semioticSquare.brandPosition.x,
    project.semioticSquare.brandPosition.y,
    project.semioticSquare
  );
  const archAlignment = analyzeArchetypeAlignment(project.archetypes.weights);
  const reception = evaluateReceptionRisk(project.receptionRadar.segments);

  const residualCount = project.codeMapper.items.filter((i) => i.stage === 'residual').length;
  const dominantCount = project.codeMapper.items.filter((i) => i.stage === 'dominant').length;
  const emergentCount = project.codeMapper.items.filter((i) => i.stage === 'emergent').length;

  const handleSaveBrief = () => {
    onUpdateProject({
      ...project,
      name: draftName.trim() || project.name,
      sector: draftSector.trim() || project.sector,
      thesis: draftThesis.trim() || project.thesis,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setEditingBrief(false);
  };

  const startEdit = () => {
    setDraftName(project.name);
    setDraftSector(project.sector);
    setDraftThesis(project.thesis);
    setEditingBrief(true);
  };

  const plates: Array<{
    id: ToolId;
    index: string;
    title: string;
    theory: string;
    audience: string;
    summaryLabel: string;
    summaryValue: string;
  }> = [
    {
      id: 'semiotic-square',
      index: '01',
      title: 'Semiotic Square Matrix',
      theory: 'Greimas Structural Semiotics',
      audience: 'Brand Strategists',
      summaryLabel: quadrant.zone,
      summaryValue: quadrant.label,
    },
    {
      id: 'archetypes',
      index: '02',
      title: 'Archetypal Persona Classifier',
      theory: 'Pearson & Jung Psychology',
      audience: 'Creative Directors',
      summaryLabel: `${archAlignment.primary.name} / ${archAlignment.secondary.name}`,
      summaryValue: archAlignment.dilutionStatus,
    },
    {
      id: 'myth-engine',
      index: '03',
      title: 'Structural Myth Canvas',
      theory: 'Lévi-Strauss Binary Engine',
      audience: 'CMOs & Strategists',
      summaryLabel: `${project.mythEngine.leftPole} ↔ ${project.mythEngine.rightPole}`,
      summaryValue: `${project.mythEngine.proofPoints.length} Mediating Proofs`,
    },
    {
      id: 'story-circle',
      index: '04',
      title: 'Multi-Tier Narrative Arc',
      theory: 'Harmon Circle & Monomyth',
      audience: 'Video & Copy Leads',
      summaryLabel: project.storyCircle.campaignTitle,
      summaryValue: `${project.storyCircle.stages.length} Narrative Beats`,
    },
    {
      id: 'signifier-audit',
      index: '05',
      title: 'Visual Signifier & Codes Audit',
      theory: 'Barthesian Semiotics',
      audience: 'Art Directors',
      summaryLabel: project.signifierAudit.assetTitle,
      summaryValue: `${project.signifierAudit.pins.length} Annotated Signifiers`,
    },
    {
      id: 'code-mapper',
      index: '06',
      title: 'Cultural Code Evolution Mapper',
      theory: 'Raymond Williams Cultural Studies',
      audience: 'Trend Planners',
      summaryLabel: `Residual ${residualCount} · Dominant ${dominantCount} · Emergent ${emergentCount}`,
      summaryValue: `${project.codeMapper.items.length} Tracked Codes`,
    },
    {
      id: 'rhetoric-designer',
      index: '07',
      title: 'Rhetorical Tropes & Metaphor',
      theory: 'Classical Literary Rhetoric',
      audience: 'Copywriters',
      summaryLabel: `Tone: ${project.rhetoricDesigner.targetTone}`,
      summaryValue: `${project.rhetoricDesigner.transformations.length} Trope Framings`,
    },
    {
      id: 'reception-radar',
      index: '08',
      title: 'Consumer Meaning-Making Radar',
      theory: 'Stuart Hall Reception Theory',
      audience: 'Communications & PR',
      summaryLabel: `Dominant ${reception.avgDominant}% · Oppositional ${reception.avgOppositional}%`,
      summaryValue: reception.overallStatus,
    },
  ];

  return (
    <main className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 space-y-10">
      {/* Brand Brief Header */}
      <section className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 lg:p-8">
        {!editingBrief ? (
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5 text-xs text-[#A39E93] font-mono-tabular">
                <span>{project.sector}</span>
                <span aria-hidden="true">·</span>
                <span>Updated {project.updatedAt}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[#F3EFE6]">
                {project.name}
              </h1>
              <p className="font-editorial text-base lg:text-lg text-[#F3EFE6]/85 leading-relaxed">
                {project.thesis}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#F3EFE6] bg-[#1F2229] hover:bg-[#272B34] border border-[#F3EFE6]/15 rounded-md transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>Edit Brief</span>
              </button>
              <button
                type="button"
                onClick={onResetPresets}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#A39E93] hover:text-[#F3EFE6] border border-[#F3EFE6]/10 rounded-md transition-colors cursor-pointer"
                title="Restore default case studies"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Presets</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#A39E93] mb-1.5">Brand Name</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded-md px-3 py-2 text-sm text-[#F3EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1.5">Category / Sector</label>
                <input
                  type="text"
                  value={draftSector}
                  onChange={(e) => setDraftSector(e.target.value)}
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded-md px-3 py-2 text-sm text-[#F3EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1.5">Cultural &amp; Semiotic Thesis</label>
              <textarea
                rows={2}
                value={draftThesis}
                onChange={(e) => setDraftThesis(e.target.value)}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded-md px-3 py-2 text-sm text-[#F3EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveBrief}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save Brief</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingBrief(false)}
                className="px-3.5 py-2 text-xs font-medium text-[#A39E93] hover:text-[#F3EFE6] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 8 Analytical Instruments Grid */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-[#F3EFE6]">
            Analytical Instruments
          </h2>
          <span className="text-xs text-[#A39E93] font-mono-tabular">
            8 Frameworks · Select plate to inspect
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {plates.map((plate) => (
            <button
              key={plate.id}
              type="button"
              onClick={() => onSelectTool(plate.id)}
              className="group text-left bg-[#181A1F] hover:bg-[#1F2229] border border-[#F3EFE6]/10 hover:border-amber-500/50 rounded-lg p-6 flex flex-col justify-between gap-6 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#A39E93]">
                  <span className="font-mono-tabular text-amber-400">{plate.index}</span>
                  <span>{plate.audience}</span>
                </div>
                <h3 className="text-base font-semibold text-[#F3EFE6] group-hover:text-amber-300 transition-colors">
                  {plate.title}
                </h3>
                <p className="text-xs text-[#A39E93]">{plate.theory}</p>
              </div>

              <div className="pt-4 border-t border-[#F3EFE6]/10 space-y-2">
                <div className="text-xs text-[#A39E93] truncate">{plate.summaryLabel}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tabular font-medium text-[#F3EFE6]">
                    {plate.summaryValue}
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#A39E93] group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};
