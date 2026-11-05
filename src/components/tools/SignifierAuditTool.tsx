import React, { useState } from 'react';
import { Image as ImageIcon, MapPin, Trash2 } from 'lucide-react';
import { CAMPAIGN_ASSET_GALLERY } from '../../data/presets';
import { BrandProject, SignifierAuditData, SignifierPin } from '../../types/studio';
import { clamp } from '../../utils/semioticEngines';

interface SignifierAuditToolProps {
  project: BrandProject;
  onUpdate: (data: SignifierAuditData) => void;
}

export const SignifierAuditTool: React.FC<SignifierAuditToolProps> = ({
  project,
  onUpdate,
}) => {
  const data = project.signifierAudit;
  const [selectedPinId, setSelectedPinId] = useState<string | null>(
    data.pins[0]?.id ?? null
  );
  const [imgError, setImgError] = useState(false);

  const selectedPin = data.pins.find((p) => p.id === selectedPinId) ?? null;

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

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular text-amber-400">
            05 · Roland Barthes Semiotic Layers
          </p>
          <h1 className="text-2xl font-semibold text-[#F3EFE6] mt-1">
            Visual Signifier &amp; Codes Audit Matrix
          </h1>
          <p className="font-editorial text-sm text-[#A39E93] mt-1 max-w-2xl">
            Click anywhere on the campaign plate to pin a visual signifier and deconstruct its Denotation, Connotation, and Ideology.
          </p>
        </div>

        {/* Campaign Plate Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#181A1F] p-1 rounded-md border border-[#F3EFE6]/10">
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
                  ? 'bg-amber-500 text-[#121316] font-semibold'
                  : 'text-[#A39E93] hover:text-[#F3EFE6]'
              }`}
            >
              {asset.title.split(' — ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Image Annotation Canvas */}
        <div className="lg:col-span-7 bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#A39E93]">
            <span>{data.assetTitle} (Click image to drop pin)</span>
            <span className="font-mono-tabular">{data.pins.length} Pins</span>
          </div>

          <div
            onClick={handleImageClick}
            className="relative w-full aspect-[4/3] bg-[#121316] border border-[#F3EFE6]/10 rounded overflow-hidden cursor-crosshair select-none"
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
              <div className="w-full h-full flex flex-col items-center justify-center text-[#A39E93] gap-2">
                <ImageIcon className="w-8 h-8 text-amber-500/60" aria-hidden="true" />
                <span className="text-xs">{data.assetTitle}</span>
              </div>
            )}

            {/* Coordinate Pins */}
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
                      ? 'bg-amber-500 text-[#121316] scale-110 ring-4 ring-amber-500/30'
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

        {/* Right Column: 3-Layer Barthesian Inspector */}
        <div className="lg:col-span-5 space-y-6">
          {selectedPin ? (
            <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tabular text-amber-400">
                  Pin Coordinates · X:{selectedPin.x}% Y:{selectedPin.y}%
                </span>
                <button
                  type="button"
                  onClick={() => removePin(selectedPin.id)}
                  className="inline-flex items-center gap-1 text-xs text-[#A39E93] hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Delete Pin</span>
                </button>
              </div>

              <div>
                <label className="block text-xs text-[#A39E93] mb-1">Signifier Label</label>
                <input
                  type="text"
                  value={selectedPin.label}
                  onChange={(e) => updatePin(selectedPin.id, { label: e.target.value })}
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-1.5 text-sm font-semibold text-[#F3EFE6]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A39E93] mb-1">
                  1. Denotation (Literal Signifier)
                </label>
                <textarea
                  rows={2}
                  value={selectedPin.denotation}
                  onChange={(e) =>
                    updatePin(selectedPin.id, { denotation: e.target.value })
                  }
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A39E93] mb-1">
                  2. Connotation (Cultural Association)
                </label>
                <textarea
                  rows={2}
                  value={selectedPin.connotation}
                  onChange={(e) =>
                    updatePin(selectedPin.id, { connotation: e.target.value })
                  }
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 text-xs text-[#F3EFE6]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A39E93] mb-1">
                  3. Ideology / Myth (Value System Reinforced)
                </label>
                <textarea
                  rows={2}
                  value={selectedPin.ideology}
                  onChange={(e) =>
                    updatePin(selectedPin.id, { ideology: e.target.value })
                  }
                  className="w-full bg-[#121316] border border-[#F3EFE6]/15 rounded px-3 py-2 font-editorial text-xs text-[#F3EFE6]"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 text-center space-y-2">
              <MapPin className="w-6 h-6 text-amber-400 mx-auto" aria-hidden="true" />
              <p className="text-sm font-medium text-[#F3EFE6]">No Signifier Selected</p>
              <p className="text-xs text-[#A39E93]">
                Click anywhere on the campaign image to place a semiotic annotation pin.
              </p>
            </div>
          )}

          {/* Pin Index */}
          {data.pins.length > 0 && (
            <div className="bg-[#181A1F] border border-[#F3EFE6]/10 rounded-lg p-6 space-y-2">
              <h3 className="text-xs font-mono-tabular text-[#A39E93] mb-2">
                Annotated Signifiers
              </h3>
              {data.pins.map((pin, idx) => (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setSelectedPinId(pin.id)}
                  className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    pin.id === selectedPinId
                      ? 'bg-[#1F2229] text-amber-300 font-semibold'
                      : 'text-[#F3EFE6] hover:bg-[#1F2229]/50'
                  }`}
                >
                  <span>
                    <span className="font-mono-tabular text-amber-400 mr-2">
                      0{idx + 1}
                    </span>
                    {pin.label}
                  </span>
                  <span className="font-mono-tabular text-[#A39E93]">
                    {pin.x}%, {pin.y}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
