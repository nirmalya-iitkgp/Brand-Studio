import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ToolId } from '../types/studio';

interface ToolBreadcrumbProps {
  activeTool: ToolId;
  onNavigate: (tool: ToolId) => void;
}

const TOOL_TABS: Array<{ id: ToolId; short: string; full: string }> = [
  { id: 'semiotic-square', short: '01 Square', full: '01. Semiotic Square Matrix' },
  { id: 'archetypes', short: '02 Archetypes', full: '02. Archetypal Persona Classifier' },
  { id: 'myth-engine', short: '03 Myth', full: '03. Structural Myth Canvas' },
  { id: 'story-circle', short: '04 Story Arc', full: '04. Multi-Tier Narrative Arc' },
  { id: 'signifier-audit', short: '05 Signifiers', full: '05. Visual Signifier & Codes Audit' },
  { id: 'code-mapper', short: '06 Codes', full: '06. Cultural Code Evolution Mapper' },
  { id: 'rhetoric-designer', short: '07 Rhetoric', full: '07. Rhetorical Tropes & Metaphor' },
  { id: 'reception-radar', short: '08 Reception', full: '08. Consumer Meaning-Making Radar' },
];

export const ToolBreadcrumb: React.FC<ToolBreadcrumbProps> = ({ activeTool, onNavigate }) => {
  const current = TOOL_TABS.find((t) => t.id === activeTool);

  return (
    <div className="border-b border-[#F3EFE6]/10 bg-[#15171C]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => onNavigate('hub')}
            className="inline-flex items-center gap-1.5 text-[#A39E93] hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Studio Hub</span>
          </button>
          <span className="text-[#A39E93]/50" aria-hidden="true">/</span>
          <span className="font-medium text-[#F3EFE6] truncate">
            {current?.full ?? 'Instrument'}
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {TOOL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`px-2.5 py-1 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTool === tab.id
                  ? 'bg-amber-500 text-[#121316] font-semibold'
                  : 'text-[#A39E93] hover:text-[#F3EFE6] hover:bg-[#1F2229]'
              }`}
            >
              {tab.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
