import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import {
  BrandProject,
  ReceptionRadarData,
  ReceptionSegment,
} from '../../types/studio';
import { clamp, evaluateReceptionRisk } from '../../utils/semioticEngines';

interface ReceptionRadarToolProps {
  project: BrandProject;
  onUpdate: (data: ReceptionRadarData) => void;
}

export const ReceptionRadarTool: React.FC<ReceptionRadarToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.receptionRadar;
  const [newDemo, setNewDemo] = useState('');

  const summary = evaluateReceptionRisk(data.segments);

  const handleAddSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDemo.trim()) return;
    const seg: ReceptionSegment = {
      id: `seg-${Date.now()}`,
      demographic: newDemo.trim(),
      dominantPct: 50,
      negotiatedPct: 35,
      oppositionalPct: 15,
      frictionTrigger: 'Potential cultural or price friction.',
      mitigation: 'Clarify brand proof and origin context.',
    };
    onUpdate({
      ...data,
      segments: [...data.segments, seg],
    });
    setNewDemo('');
  };

  const updateSegment = (id: string, patch: Partial<ReceptionSegment>) => {
    onUpdate({
      ...data,
      segments: data.segments.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const removeSegment = (id: string) => {
    onUpdate({
      ...data,
      segments: data.segments.filter((s) => s.id !== id),
    });
  };

  // Three-zone radar geometry
  const cx = 190;
  const cy = 190;
  const rMax = 140;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <p className="text-xs font-mono-tabular text-amber-400">
          08 · Stuart Hall Encoding / Decoding Model
        </p>
        <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
          Consumer Meaning-Making Radar
        </h1>
        <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
          Stress-test how target demographics decode {project.name}’s campaign message across Dominant, Negotiated, and Oppositional readings.
        </p>
      </div>

      {/* Campaign Message Under Test */}
      <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6">
        <label className="block text-xs text-[#A39E93] mb-1.5">
          Encoded Campaign Message Under Test
        </label>
        <input
          type="text"
          value={data.campaignMessage}
          onChange={(e) => onUpdate({ ...data, campaignMessage: e.target.value })}
          className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3.5 py-2 font-editorial text-base text-[#F3EFE6]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Three-Zone Sentiment Probability Radar */}
        <div className="lg:col-span-5 bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 flex flex-col items-center space-y-4">
          <div className="w-full flex items-center justify-between text-xs text-[#A39E93]">
            <span>Three-Zone Reception Radar</span>
            <span className="font-mono-tabular">{summary.overallStatus}</span>
          </div>

          <svg
            viewBox="0 0 380 380"
            className="w-full max-w-[360px] h-auto"
            role="img"
            aria-label="Stuart Hall Three-Zone Reception Probability Radar"
          >
            {/* Concentric Probability Rings */}
            {[0.33, 0.66, 1].map((ratio, idx) => (
              <circle
                key={ratio}
                cx={cx}
                cy={cy}
                r={rMax * ratio}
                fill="none"
                stroke="rgba(243,239,230,0.10)"
                strokeDasharray={idx < 2 ? '3 3' : undefined}
              />
            ))}

            {/* 3 Axis Lines: Dominant (Top), Negotiated (Bottom Right), Oppositional (Bottom Left) */}
            {[
              { label: 'DOMINANT', angle: -90, pct: summary.avgDominant },
              { label: 'NEGOTIATED', angle: 30, pct: summary.avgNegotiated },
              { label: 'OPPOSITIONAL', angle: 150, pct: summary.avgOppositional },
            ].map((axis) => {
              const rad = axis.angle * (Math.PI / 180);
              const x2 = cx + rMax * Math.cos(rad);
              const y2 = cy + rMax * Math.sin(rad);
              const lx = cx + (rMax + 24) * Math.cos(rad);
              const ly = cy + (rMax + 24) * Math.sin(rad);
              return (
                <g key={axis.label}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(243,239,230,0.18)"
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#A39E93"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono"
                  >
                    {axis.label} ({axis.pct}%)
                  </text>
                </g>
              );
            })}

            {/* Aggregate Reception Polygon */}
            {(() => {
              const pts = [
                { angle: -90, pct: summary.avgDominant },
                { angle: 30, pct: summary.avgNegotiated },
                { angle: 150, pct: summary.avgOppositional },
              ]
                .map((p) => {
                  const rad = p.angle * (Math.PI / 180);
                  const r = (p.pct / 100) * rMax;
                  return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
                })
                .join(' ');

              return (
                <polygon
                  points={pts}
                  fill="rgba(245, 158, 11, 0.28)"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
              );
            })()}
          </svg>

          <div className="w-full pt-4 border-t border-[#F3EFE6]/10 flex items-start gap-3">
            {summary.overallStatus === 'High Friction' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="text-xs text-[#A39E93] leading-relaxed">
              <span className="font-mono-tabular font-semibold text-[#F3EFE6]">
                {summary.overallStatus}:
              </span>{' '}
              {summary.highRiskCount > 0
                ? `${summary.highRiskCount} demographic segment(s) show ≥25% oppositional decoding risk.`
                : 'Message decodes within acceptable dominant and negotiated bounds.'}
            </div>
          </div>
        </div>

        {/* Right: Demographic Stress-Test Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleAddSegment} className="flex gap-2">
            <input
              type="text"
              placeholder="Add target demographic segment..."
              value={newDemo}
              onChange={(e) => setNewDemo(e.target.value)}
              className="flex-1 bg-[#181A1F] border border-[#F3EFE6]/15 rounded px-3.5 py-2 text-xs text-[#F3EFE6]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Segment</span>
            </button>
          </form>

          {data.segments.map((seg) => (
            <div
              key={seg.id}
              className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#F3EFE6]">
                  {seg.demographic}
                </h3>
                <button
                  type="button"
                  onClick={() => removeSegment(seg.id)}
                  className="text-[#A39E93] hover:text-red-400 cursor-pointer"
                  aria-label={`Remove ${seg.demographic}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#A39E93] mb-1 font-mono-tabular">
                    Dominant ({seg.dominantPct}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={seg.dominantPct}
                    onChange={(e) =>
                      updateSegment(seg.id, {
                        dominantPct: clamp(Number(e.target.value), 0, 100),
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A39E93] mb-1 font-mono-tabular">
                    Negotiated ({seg.negotiatedPct}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={seg.negotiatedPct}
                    onChange={(e) =>
                      updateSegment(seg.id, {
                        negotiatedPct: clamp(Number(e.target.value), 0, 100),
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A39E93] mb-1 font-mono-tabular">
                    Oppositional ({seg.oppositionalPct}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={seg.oppositionalPct}
                    onChange={(e) =>
                      updateSegment(seg.id, {
                        oppositionalPct: clamp(Number(e.target.value), 0, 100),
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-[#A39E93] mb-1">
                    Oppositional Friction Trigger
                  </label>
                  <input
                    type="text"
                    value={seg.frictionTrigger}
                    onChange={(e) =>
                      updateSegment(seg.id, { frictionTrigger: e.target.value })
                    }
                    className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A39E93] mb-1">
                    Reframing Mitigation Playbook
                  </label>
                  <input
                    type="text"
                    value={seg.mitigation}
                    onChange={(e) =>
                      updateSegment(seg.id, { mitigation: e.target.value })
                    }
                    className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-xs text-[#F3EFE6]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
