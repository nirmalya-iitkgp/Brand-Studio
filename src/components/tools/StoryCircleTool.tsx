import React, { useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { BrandProject, StoryCircleData, StoryStage } from '../../types/studio';
import { reorderStoryStages } from '../../utils/semioticEngines';

interface StoryCircleToolProps {
  project: BrandProject;
  onUpdate: (data: StoryCircleData) => void;
}

export const StoryCircleTool: React.FC<StoryCircleToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.storyCircle;
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const activeStage =
    data.stages.find((s) => s.step === selectedStep) ?? data.stages[0];

  const updateStage = (step: number, patch: Partial<StoryStage>) => {
    onUpdate({
      ...data,
      stages: data.stages.map((s) => (s.step === step ? { ...s, ...patch } : s)),
    });
  };

  const reorderStages = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= data.stages.length ||
      toIndex >= data.stages.length
    ) {
      return;
    }
    const renumbered = reorderStoryStages(data.stages, fromIndex, toIndex);
    onUpdate({ ...data, stages: renumbered });
    setSelectedStep(toIndex + 1);
  };

  const moveStage = (index: number, direction: -1 | 1) => {
    reorderStages(index, index + direction);
  };

  const cx = 200;
  const cy = 200;
  const radius = 140;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular text-amber-400">
            04 · Dan Harmon Story Circle &amp; Campbell Monomyth
          </p>
          <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
            Multi-Tier Narrative Arc Builder
          </h1>
          <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
            Structure long-form brand campaigns across the 8-stage circular threshold between Order and Chaos.
          </p>
        </div>

        <div className="w-full lg:w-80">
          <label className="block text-xs text-[#A39E93] mb-1">Campaign Arc Title</label>
          <input
            type="text"
            value={data.campaignTitle}
            onChange={(e) => onUpdate({ ...data, campaignTitle: e.target.value })}
            className="w-full bg-[#181A1F] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 8-Stage Circular SVG Timeline */}
        <div className="lg:col-span-5 bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-[#A39E93] mb-2">
            <span>8-Stage Circular Timeline</span>
            <span className="font-mono-tabular">
              Top: Order · Bottom: Chaos
            </span>
          </div>

          <svg
            viewBox="0 0 400 400"
            className="w-full max-w-[380px] h-auto"
            role="img"
            aria-label="8-Stage Harmon Story Circle"
          >
            {/* Horizon Line dividing Order (top) and Chaos (bottom) */}
            <line
              x1="25"
              y1={cy}
              x2="375"
              y2={cy}
              stroke="rgba(243,239,230,0.15)"
              strokeDasharray="4 4"
            />
            <text x="45" y={cy - 10} fill="#A39E93" fontSize="10" fontFamily="JetBrains Mono">
              KNOWN ORDER
            </text>
            <text x="45" y={cy + 18} fill="#D97706" fontSize="10" fontFamily="JetBrains Mono">
              UNKNOWN CHAOS
            </text>

            {/* Main Circle */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="rgba(243,239,230,0.18)"
              strokeWidth="1.5"
            />

            {/* 8 Stage Nodes */}
            {data.stages.map((st, idx) => {
              const angle = (idx * 45 - 90) * (Math.PI / 180);
              const nx = cx + radius * Math.cos(angle);
              const ny = cy + radius * Math.sin(angle);
              const isSelected = st.step === selectedStep;

              return (
                <g
                  key={st.step}
                  onClick={() => setSelectedStep(st.step)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={nx}
                    cy={ny}
                    r={isSelected ? 22 : 17}
                    fill={isSelected ? '#F59E0B' : '#121316'}
                    stroke={isSelected ? '#F59E0B' : 'rgba(243,239,230,0.35)'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={nx}
                    y={ny - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#121316' : '#F3EFE6'}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="JetBrains Mono"
                  >
                    0{st.step}
                  </text>
                  <text
                    x={nx}
                    y={ny + 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#121316' : '#A39E93'}
                    fontSize="8"
                    fontWeight="600"
                  >
                    {st.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Stage Editor */}
          {activeStage && (
            <div className="w-full mt-4 pt-4 border-t border-[#F3EFE6]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tabular text-amber-400">
                  Stage 0{activeStage.step}: {activeStage.label} ({activeStage.phase})
                </span>
                <span className="text-xs font-mono-tabular text-[#A39E93]">
                  Intensity: {activeStage.emotionalIntensity}/10
                </span>
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">Scene Title</label>
                <input
                  type="text"
                  value={activeStage.sceneTitle}
                  onChange={(e) =>
                    updateStage(activeStage.step, { sceneTitle: e.target.value })
                  }
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">Narrative Copy Beat</label>
                <textarea
                  rows={2}
                  value={activeStage.copyBeat}
                  onChange={(e) =>
                    updateStage(activeStage.step, { copyBeat: e.target.value })
                  }
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">
                  Emotional Intensity ({activeStage.emotionalIntensity}/10)
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={activeStage.emotionalIntensity}
                  onChange={(e) =>
                    updateStage(activeStage.step, {
                      emotionalIntensity: Number(e.target.value),
                    })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 8-Stage Sequence List with Drag-and-Drop & Button Reordering */}
        <div className="lg:col-span-7 bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-[#F3EFE6]">
              Campaign Storyboard Sequence
            </h2>
            <span className="text-xs text-[#A39E93]">
              Drag beats or use arrows to reorder
            </span>
          </div>

          <div className="divide-y divide-[#F3EFE6]/10">
            {data.stages.map((st, idx) => {
              const isSelected = st.step === selectedStep;
              const isDragging = dragIndex === idx;
              const isDragOver = dragOverIndex === idx && dragIndex !== idx;
              return (
                <div
                  key={st.step}
                  draggable
                  onDragStart={(e) => {
                    setDragIndex(idx);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(idx));
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverIndex !== idx) {
                      setDragOverIndex(idx);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverIndex === idx) {
                      setDragOverIndex(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from =
                      dragIndex !== null
                        ? dragIndex
                        : Number(e.dataTransfer.getData('text/plain'));
                    if (Number.isInteger(from)) {
                      reorderStages(from, idx);
                    }
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  onClick={() => setSelectedStep(st.step)}
                  className={`py-3 px-3 rounded flex items-start justify-between gap-4 transition-colors cursor-grab active:cursor-grabbing ${
                    isSelected ? 'bg-[#1F2229]' : 'hover:bg-[#1F2229]/50'
                  } ${isDragging ? 'opacity-45' : ''} ${
                    isDragOver ? 'ring-1 ring-amber-400 bg-amber-500/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <GripVertical
                      className="w-4 h-4 text-[#A39E93]/60 shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono-tabular text-amber-400 font-semibold">
                          0{st.step}
                        </span>
                        <span className="font-semibold text-[#F3EFE6]">{st.label}</span>
                        <span className="text-[#A39E93]">·</span>
                        <span className="text-[#A39E93]">{st.phase}</span>
                        <span className="text-[#A39E93]">·</span>
                        <span className="font-mono-tabular text-[#A39E93]">
                          Intensity {st.emotionalIntensity}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-[#F3EFE6]">
                        {st.sceneTitle}
                      </div>
                      <p className="font-editorial text-xs text-[#A39E93] line-clamp-2">
                        {st.copyBeat}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStage(idx, -1);
                      }}
                      className="p-1.5 text-[#A39E93] hover:text-[#F3EFE6] disabled:opacity-30 cursor-pointer"
                      aria-label={`Move stage ${st.step} up`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.stages.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStage(idx, 1);
                      }}
                      className="p-1.5 text-[#A39E93] hover:text-[#F3EFE6] disabled:opacity-30 cursor-pointer"
                      aria-label={`Move stage ${st.step} down`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
