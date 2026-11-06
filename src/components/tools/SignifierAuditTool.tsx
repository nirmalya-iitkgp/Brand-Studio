import React, { useRef, useState } from 'react';
import { Image as ImageIcon, MapPin, Trash2, Upload } from 'lucide-react';
import { CAMPAIGN_ASSET_GALLERY } from '../../data/presets';
import { BrandProject, SignifierAuditData, SignifierPin } from '../../types/studio';
import {
  clamp,
  generateStructuralPositioningMatrix,
} from '../../utils/semioticEngines';

interface SignifierAuditToolProps {
  project: BrandProject;
  onUpdate: (data: SignifierAuditData) => void;
  paperMode?: boolean;
}

type InspectorTab = 'barthes' | 'ogden' | 'saussure';

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2MB safety cap

export const SignifierAuditTool: React.FC<SignifierAuditToolProps> = ({
  project,
  onUpdate,
  paperMode = false,
}) => {
  const data = project.signifierAudit;
  const [selectedPinId, setSelectedPinId] = useState<string | null>(
    data.pins[0]?.id ?? null
  );
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('barthes');
  const [imgError, setImgError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const selectedPin = data.pins.find((p) => p.id === selectedPinId) ?? null;

  const matrix = generateStructuralPositioningMatrix(
    data.pins,
    project.semioticSquare.competitors,
    project.name
  );

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('Image must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
        setImgError(false);
        onUpdate({
          ...data,
          assetUrl: reader.result,
          assetTitle: file.name.replace(/\.[^.]+$/, ''),
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(clamp(((e.clientX - rect.left) / rect.width) * 100, 4, 96));
    const y = Math.round(clamp(((e.clientY - rect.top) / rect.height) * 100, 4, 96));

    const newPin: SignifierPin = {
      id: `pin-${Date.now()}`,
      x,
      y,
      label: `Signifier ${data.pins.length + 1}`,
      denotation: 'Literal visual element observed in frame.',
      connotation: 'Cultural or emotional association evoked.',
      ideology: 'Underlying myth or value system reinforced.',
      thoughtReference: 'Mental concept triggered in the viewer.',
      referent: 'Physical or cultural object in the real world.',
      paradigmaticAlternative: 'Conventional category alternative not chosen.',
    };

    onUpdate({
      ...data,
      pins: [...data.pins, newPin],
    });
    setSelectedPinId(newPin.id);
  };

  const updatePin = (id: string, patch: Partial<SignifierPin>) => {
    onUpdate({
      ...data,
      pins: data.pins.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const removePin = (id: string) => {
    const remaining = data.pins.filter((p) => p.id !== id);
    onUpdate({ ...data, pins: remaining });
    if (selectedPinId === id) {
      setSelectedPinId(remaining[0]?.id ?? null);
    }
  };

  const accentHex = paperMode ? '#4F46E5' : '#F59E0B';

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular text-amber-500 dark:text-amber-400">
            05 · Barthesian Semiotics · Ogden &amp; Richards Triangle · Saussurean Structuralism
          </p>
          <h1 className="text-2xl font-semibold text-[var(--ink-primary)] mt-1">
            Visual &amp; Textual Signifier Audit Canvas
          </h1>
          <p className="font-editorial text-sm text-[var(--ink-secondary)] mt-1 max-w-2xl">
            Upload or select a campaign asset, pin visual signifiers, map Ogden &amp; Richards triangles and Saussurean oppositions, and auto-generate a structural positioning matrix.
          </p>
        </div>

        {/* Campaign Plate Switcher + Upload */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-md border border-[var(--border-hairline)]">
            {CAMPAIGN_ASSET_GALLERY.map((asset) => (
              <button
                key={asset.url}
                type="button"
                onClick={() => {
                  setImgError(false);
                  onUpdate({
                    ...data,
                    assetUrl: asset.url,
                    assetTitle: asset.title,
                  });
                }}
                className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  data.assetUrl === asset.url
                    ? paperMode
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-amber-500 text-[#121316] font-semibold'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {asset.title.split(' — ')[0]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              paperMode
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-[#121316]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Upload Asset</span>
          </button>
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAssetUpload}
            className="hidden"
          />
        </div>
      </div>

      {uploadError && (
        <div className="text-xs font-mono-tabular text-red-400 bg-red-500/10 border border-red-500/30 rounded px-4 py-2">
          {uploadError}
        </div>
      )}

      {/* Textual Creative Asset Under Audit */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-5">
        <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
          Textual Creative Asset (Campaign Headline / Tagline Under Deconstruction)
        </label>
        <input
          type="text"
          value={data.textualAsset ?? project.receptionRadar.campaignMessage}
          onChange={(e) => onUpdate({ ...data, textualAsset: e.target.value })}
          placeholder="Enter campaign headline or verbal signifier..."
          className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3.5 py-2 font-editorial text-base text-[var(--ink-primary)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Image Annotation Canvas */}
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--ink-secondary)]">
            <span>{data.assetTitle} (Click image to tag signifier)</span>
            <span className="font-mono-tabular">{data.pins.length} Tagged Signifiers</span>
          </div>

          <div
            onClick={handleImageClick}
            className="relative w-full aspect-[4/3] bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded overflow-hidden cursor-crosshair select-none"
          >
            {!imgError ? (
              <img
                src={data.assetUrl}
                alt={data.assetTitle}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--ink-secondary)] gap-2">
                <ImageIcon className="w-8 h-8 opacity-60" aria-hidden="true" />
                <span className="text-xs">{data.assetTitle}</span>
              </div>
            )}

            {/* Coordinate Pins (Indigo in Paper Studio, Amber in Dark Archival) */}
            {data.pins.map((pin, idx) => {
              const isSelected = pin.id === selectedPinId;
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPinId(pin.id);
                  }}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full font-mono-tabular text-xs font-bold flex items-center justify-center transition-transform cursor-pointer ${
                    isSelected
                      ? paperMode
                        ? 'bg-indigo-600 text-white scale-110 ring-4 ring-indigo-600/30'
                        : 'bg-amber-500 text-[#121316] scale-110 ring-4 ring-amber-500/30'
                      : paperMode
                      ? 'bg-white/95 text-indigo-700 border-2 border-indigo-600 hover:scale-105'
                      : 'bg-[#121316]/90 text-[#F3EFE6] border border-amber-400 hover:scale-105'
                  }`}
                  title={pin.label}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-Framework Signifier Inspector */}
        <div className="lg:col-span-5 space-y-6">
          {selectedPin ? (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tabular text-[var(--ink-secondary)]">
                  Pin Coordinates · X:{selectedPin.x}% Y:{selectedPin.y}%
                </span>
                <button
                  type="button"
                  onClick={() => removePin(selectedPin.id)}
                  className="inline-flex items-center gap-1 text-xs text-[var(--ink-secondary)] hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Delete Pin</span>
                </button>
              </div>

              <div>
                <label className="block text-xs text-[var(--ink-secondary)] mb-1">
                  Signifier / Symbol Label
                </label>
                <input
                  type="text"
                  value={selectedPin.label}
                  onChange={(e) => updatePin(selectedPin.id, { label: e.target.value })}
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3 py-1.5 text-sm font-semibold text-[var(--ink-primary)]"
                />
              </div>

              {/* 3-Framework Inspector Tabs */}
              <div className="flex items-center gap-1 bg-[var(--bg-canvas)] p-1 rounded border border-[var(--border-hairline)]">
                {[
                  { id: 'barthes' as const, label: 'Barthes Layers' },
                  { id: 'ogden' as const, label: 'Ogden Triangle' },
                  { id: 'saussure' as const, label: 'Saussurean Code' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInspectorTab(tab.id)}
                    className={`flex-1 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                      inspectorTab === tab.id
                        ? paperMode
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-amber-500 text-[#121316] font-semibold'
                        : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {inspectorTab === 'barthes' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[var(--ink-secondary)] mb-1">
                      1. Denotation (Literal Signifier)
                    </label>
                    <textarea
                      rows={2}
                      value={selectedPin.denotation}
                      onChange={(e) =>
                        updatePin(selectedPin.id, { denotation: e.target.value })
                      }
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3 py-2 text-xs text-[var(--ink-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--ink-secondary)] mb-1">
                      2. Connotation (Cultural Association)
                    </label>
                    <textarea
                      rows={2}
                      value={selectedPin.connotation}
                      onChange={(e) =>
                        updatePin(selectedPin.id, { connotation: e.target.value })
                      }
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3 py-2 text-xs text-[var(--ink-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--ink-secondary)] mb-1">
                      3. Ideology / Myth (Systemic Value)
                    </label>
                    <textarea
                      rows={2}
                      value={selectedPin.ideology}
                      onChange={(e) =>
                        updatePin(selectedPin.id, { ideology: e.target.value })
                      }
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3 py-2 font-editorial text-xs text-[var(--ink-primary)]"
                    />
                  </div>
                </div>
              )}

              {inspectorTab === 'ogden' && (
                <div className="space-y-3">
                  {/* Ogden & Richards Semiotic Triangle SVG */}
                  <svg
                    viewBox="0 0 320 175"
                    className="w-full h-auto bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                    role="img"
                    aria-label="Ogden and Richards Semiotic Triangle"
                  >
                    {/* Thought/Reference (Top) to Symbol (Bottom Left) */}
                    <line x1="160" y1="32" x2="55" y2="140" stroke={accentHex} strokeWidth="1.5" />
                    {/* Thought/Reference (Top) to Referent (Bottom Right) */}
                    <line x1="160" y1="32" x2="265" y2="140" stroke={accentHex} strokeWidth="1.5" />
                    {/* Imputed Relation (Dashed Base: Symbol <-> Referent) */}
                    <line
                      x1="55"
                      y1="140"
                      x2="265"
                      y2="140"
                      stroke="currentColor"
                      strokeOpacity="0.35"
                      strokeDasharray="4 4"
                    />
                    <circle cx="160" cy="32" r="5" fill={accentHex} />
                    <circle cx="55" cy="140" r="5" fill={accentHex} />
                    <circle cx="265" cy="140" r="5" fill={accentHex} />

                    <text x="160" y="18" textAnchor="middle" fill="currentColor" fontSize="9.5" fontWeight="600">
                      THOUGHT / REFERENCE
                    </text>
                    <text x="55" y="160" textAnchor="middle" fill="currentColor" fontSize="9.5" fontWeight="600">
                      SYMBOL
                    </text>
                    <text x="265" y="160" textAnchor="middle" fill="currentColor" fontSize="9.5" fontWeight="600">
                      REFERENT
                    </text>
                    <text x="160" y="133" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="8" fontFamily="JetBrains Mono">
                      IMPUTED RELATION
                    </text>
                  </svg>

                  <div>
                    <label className="block text-xs text-[var(--ink-secondary)] mb-1">
                      Thought or Reference (Mental Concept)
                    </label>
                    <input
                      type="text"
                      value={selectedPin.thoughtReference ?? selectedPin.connotation}
                      onChange={(e) =>
                        updatePin(selectedPin.id, { thoughtReference: e.target.value })
                      }
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3 py-1.5 text-xs text-[var(--ink-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--ink-secondary)] mb-1">
                      Referent (Real-World Object / Practice)
                    </label>
                    <input
                      type="text"
                      value={selectedPin.referent ?? selectedPin.denotation}
                      onChange={(e) =>
                        updatePin(selectedPin.id, { referent: e.target.value })
                      }
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3 py-1.5 text-xs text-[var(--ink-primary)]"
                    />
                  </div>
                </div>
              )}

              {inspectorTab === 'saussure' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[var(--ink-secondary)] mb-1">
                      Paradigmatic Alternative (What Was Not Chosen)
                    </label>
                    <input
                      type="text"
                      value={selectedPin.paradigmaticAlternative ?? ''}
                      placeholder="e.g., Clear plastic pump bottle instead of corked amber glass"
                      onChange={(e) =>
                        updatePin(selectedPin.id, {
                          paradigmaticAlternative: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded px-3 py-1.5 text-xs text-[var(--ink-primary)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs text-[var(--ink-secondary)] mb-1 font-mono-tabular">
                        Convention ↔ Subversion
                      </label>
                      <input
                        type="range"
                        min={-40}
                        max={40}
                        value={selectedPin.culturalAxisX ?? 0}
                        onChange={(e) =>
                          updatePin(selectedPin.id, {
                            culturalAxisX: Number(e.target.value),
                          })
                        }
                        className="w-full accent-indigo-600 dark:accent-amber-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--ink-secondary)] mb-1 font-mono-tabular">
                        Literal ↔ Mythic Depth
                      </label>
                      <input
                        type="range"
                        min={-40}
                        max={40}
                        value={selectedPin.culturalAxisY ?? 0}
                        onChange={(e) =>
                          updatePin(selectedPin.id, {
                            culturalAxisY: Number(e.target.value),
                          })
                        }
                        className="w-full accent-indigo-600 dark:accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-6 text-center space-y-2">
              <MapPin className="w-6 h-6 mx-auto opacity-80" aria-hidden="true" />
              <p className="text-sm font-medium text-[var(--ink-primary)]">
                No Signifier Selected
              </p>
              <p className="text-xs text-[var(--ink-secondary)]">
                Click anywhere on the campaign image to place a semiotic annotation pin.
              </p>
            </div>
          )}

          {/* Pin Index */}
          {data.pins.length > 0 && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-5 space-y-2">
              <h3 className="text-xs font-mono-tabular text-[var(--ink-secondary)] mb-2">
                Tagged Signifiers
              </h3>
              {data.pins.map((pin, idx) => (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setSelectedPinId(pin.id)}
                  className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    pin.id === selectedPinId
                      ? 'bg-[var(--bg-elevated)] font-semibold text-[var(--ink-primary)]'
                      : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-elevated)]/60'
                  }`}
                >
                  <span>
                    <span className="font-mono-tabular mr-2">0{idx + 1}</span>
                    {pin.label}
                  </span>
                  <span className="font-mono-tabular">
                    {pin.x}%, {pin.y}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Auto-Generated Structural Positioning Matrix */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[var(--ink-primary)]">
              Auto-Generated Structural Positioning Matrix
            </h2>
            <p className="font-editorial text-xs text-[var(--ink-secondary)] mt-0.5">
              {matrix.summary}
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-[var(--ink-secondary)]">
            Dominant Zone: {matrix.dominantQuadrant}
          </span>
        </div>

        <svg
          viewBox="0 0 600 260"
          className="w-full h-auto bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
          role="img"
          aria-label="Auto-generated Structural Positioning Matrix"
        >
          <line x1="300" y1="15" x2="300" y2="245" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" />
          <line x1="20" y1="130" x2="580" y2="130" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" />

          <text x="150" y="28" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="9.5" fontFamily="JetBrains Mono">
            CANONICAL MYTH
          </text>
          <text x="450" y="28" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="9.5" fontFamily="JetBrains Mono">
            MYTHIC SUBVERSION
          </text>
          <text x="150" y="244" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="9.5" fontFamily="JetBrains Mono">
            LITERAL CONVENTION
          </text>
          <text x="450" y="244" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="9.5" fontFamily="JetBrains Mono">
            TACTICAL DISRUPTION
          </text>

          {matrix.nodes.map((node) => {
            const nx = (node.x / 100) * 560 + 20;
            const ny = (node.y / 100) * 210 + 25;
            if (node.kind === 'brand-centroid') {
              return (
                <g key={node.id}>
                  <circle cx={nx} cy={ny} r="12" fill={accentHex} fillOpacity="0.22" />
                  <circle cx={nx} cy={ny} r="6" fill={accentHex} />
                  <text x={nx} y={ny - 14} textAnchor="middle" fill={accentHex} fontSize="10.5" fontWeight="700">
                    {node.label}
                  </text>
                </g>
              );
            }
            if (node.kind === 'competitor') {
              return (
                <g key={node.id}>
                  <rect x={nx - 4} y={ny - 4} width="8" height="8" fill="currentColor" fillOpacity="0.45" />
                  <text x={nx} y={ny - 9} textAnchor="middle" fill="currentColor" fillOpacity="0.65" fontSize="9.5">
                    {node.label}
                  </text>
                </g>
              );
            }
            return (
              <g key={node.id}>
                <circle cx={nx} cy={ny} r="4.5" fill="none" stroke={accentHex} strokeWidth="1.5" />
                <text x={nx} y={ny + 13} textAnchor="middle" fill="currentColor" fillOpacity="0.8" fontSize="9">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </section>
    </div>
  );
};
