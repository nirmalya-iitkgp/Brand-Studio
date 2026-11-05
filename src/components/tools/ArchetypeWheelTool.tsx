import React from 'react';
import { AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';
import { ArchetypeData, ArchetypeId, BrandProject } from '../../types/studio';
import {
  ARCHETYPE_CATALOG,
  analyzeArchetypeAlignment,
  scoreTextAgainstArchetypes,
} from '../../utils/semioticEngines';

interface ArchetypeWheelToolProps {
  project: BrandProject;
  onUpdate: (data: ArchetypeData) => void;
}

export const ArchetypeWheelTool: React.FC<ArchetypeWheelToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.archetypes;
  const alignment = analyzeArchetypeAlignment(data.weights);

  const handleAutoScore = () => {
    const computed = scoreTextAgainstArchetypes(data.copySample, data.visualCues);
    onUpdate({
      ...data,
      weights: computed,
    });
  };

  const handleSliderChange = (id: ArchetypeId, val: number) => {
    onUpdate({
      ...data,
      weights: {
        ...data.weights,
        [id]: val,
      },
    });
  };

  const cx = 210;
  const cy = 210;
  const maxR = 155;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <p className="text-xs font-mono-tabular text-amber-400">
          02 · Pearson &amp; Jung Analytical Psychology
        </p>
        <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
          Archetypal Brand Persona Classifier
        </h1>
        <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
          Audit copy and visual cues across the 12 classic Jungian archetypes to prevent subconscious archetype dilution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 12-Segment Radial Wheel */}
        <div className="lg:col-span-6 bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-[#A39E93] mb-2">
            <span>12-Segment Archetype Radial Wheel</span>
            <span className="font-mono-tabular">
              Primary: {alignment.primary.name}
            </span>
          </div>

          <svg
            viewBox="0 0 420 420"
            className="w-full max-w-[420px] h-auto"
            role="img"
            aria-label="12-Segment Jungian Archetype Radial Wheel"
          >
            {/* Concentric Reference Rings */}
            {[0.25, 0.5, 0.75, 1].map((ratio) => (
              <circle
                key={ratio}
                cx={cx}
                cy={cy}
                r={maxR * ratio}
                fill="none"
                stroke="rgba(243,239,230,0.08)"
                strokeDasharray="3 3"
              />
            ))}

            {/* 12 Radial Wedges */}
            {ARCHETYPE_CATALOG.map((arch, idx) => {
              const startAngle = (idx * 30 - 90) * (Math.PI / 180);
              const endAngle = ((idx + 1) * 30 - 90) * (Math.PI / 180);
              const midAngle = ((idx + 0.5) * 30 - 90) * (Math.PI / 180);

              const weight = data.weights[arch.id] ?? 0;
              const r = (weight / 100) * maxR;

              const x1 = cx + r * Math.cos(startAngle);
              const y1 = cy + r * Math.sin(startAngle);
              const x2 = cx + r * Math.cos(endAngle);
              const y2 = cy + r * Math.sin(endAngle);

              const outerX = cx + maxR * Math.cos(startAngle);
              const outerY = cy + maxR * Math.sin(startAngle);

              const labelR = maxR + 24;
              const lx = cx + labelR * Math.cos(midAngle);
              const ly = cy + labelR * Math.sin(midAngle);

              const isPrimary = arch.id === alignment.primary.id;
              const isSecondary = arch.id === alignment.secondary.id;

              const fill = isPrimary
                ? 'rgba(245, 158, 11, 0.55)'
                : isSecondary
                ? 'rgba(245, 158, 11, 0.28)'
                : 'rgba(243, 239, 230, 0.12)';

              const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

              return (
                <g key={arch.id}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={outerX}
                    y2={outerY}
                    stroke="rgba(243,239,230,0.08)"
                  />
                  <path
                    d={pathData}
                    fill={fill}
                    stroke={isPrimary ? '#F59E0B' : 'rgba(243,239,230,0.25)'}
                    strokeWidth={isPrimary ? 1.5 : 0.8}
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isPrimary || isSecondary ? '#F59E0B' : '#A39E93'}
                    fontSize="9.5"
                    fontWeight={isPrimary ? '700' : '500'}
                  >
                    {arch.name.replace('The ', '')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Dilution Diagnostic Banner */}
          <div className="w-full mt-4 pt-4 border-t border-[#F3EFE6]/10 flex items-start gap-3">
            {alignment.dilutionStatus === 'Diluted Signal' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="space-y-1">
              <div className="text-xs font-mono-tabular font-semibold text-[#F3EFE6]">
                {alignment.dilutionStatus} · Primary: {alignment.primary.name} ({data.weights[alignment.primary.id]}%) · Secondary: {alignment.secondary.name} ({data.weights[alignment.secondary.id]}%)
              </div>
              <p className="text-xs text-[#A39E93] leading-relaxed">
                {alignment.diagnostic}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Asset Copy Audit & 12 Sliders */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#F3EFE6]">
                Asset Copy &amp; Visual Cue Audit
              </h2>
              <button
                type="button"
                onClick={handleAutoScore}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#121316] bg-amber-500 hover:bg-amber-400 rounded transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Score from Cues</span>
              </button>
            </div>

            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                Brand Messaging / Copy Sample
              </label>
              <textarea
                rows={2}
                value={data.copySample}
                onChange={(e) => onUpdate({ ...data, copySample: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                Visual &amp; Material Cues
              </label>
              <textarea
                rows={2}
                value={data.visualCues}
                onChange={(e) => onUpdate({ ...data, visualCues: e.target.value })}
                className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
              />
            </div>
          </div>

          <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-3">
            <h3 className="text-sm font-semibold text-[#F3EFE6]">
              Archetype Weight Calibration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {ARCHETYPE_CATALOG.map((arch) => {
                const val = data.weights[arch.id] ?? 0;
                return (
                  <div key={arch.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#F3EFE6] font-medium">{arch.name}</span>
                      <span className="font-mono-tabular text-[#A39E93]">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={(e) => handleSliderChange(arch.id, Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
