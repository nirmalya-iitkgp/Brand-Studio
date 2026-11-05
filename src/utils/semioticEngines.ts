import {
  ArchetypeId,
  BrandProject,
  ReceptionSegment,
  RhetoricalTransformation,
  SemioticSquareData,
  StoryStage,
} from '../types/studio';

export interface ArchetypeMeta {
  id: ArchetypeId;
  name: string;
  axis: 'Freedom' | 'Order' | 'Social' | 'Ego';
  motto: string;
  keywords: string[];
}

export const ARCHETYPE_CATALOG: ArchetypeMeta[] = [
  { id: 'innocent', name: 'The Innocent', axis: 'Freedom', motto: 'Pure, transparent, restorative', keywords: ['pure', 'simple', 'honest', 'natural', 'clean', 'origin'] },
  { id: 'sage', name: 'The Sage', axis: 'Order', motto: 'Truth through empirical inquiry', keywords: ['research', 'truth', 'method', 'archive', 'precision', 'study', 'evidence'] },
  { id: 'explorer', name: 'The Explorer', axis: 'Freedom', motto: 'Uncharted terrain and autonomy', keywords: ['frontier', 'wander', 'horizon', 'wild', 'terrain', 'beyond', 'nomad'] },
  { id: 'outlaw', name: 'The Outlaw', axis: 'Freedom', motto: 'Disrupting calcified convention', keywords: ['rebel', 'break', 'defy', 'anti', 'subvert', 'raw', 'unapologetic'] },
  { id: 'magician', name: 'The Magician', axis: 'Ego', motto: 'Alchemical transformation of reality', keywords: ['transform', 'alchemy', 'ritual', 'transcend', 'catalyst', 'luminous'] },
  { id: 'hero', name: 'The Hero', axis: 'Ego', motto: 'Mastery through disciplined courage', keywords: ['conquer', 'endure', 'peak', 'discipline', 'triumph', 'performance'] },
  { id: 'lover', name: 'The Lover', axis: 'Social', motto: 'Sensory intimacy and devotion', keywords: ['sensual', 'velvet', 'warmth', 'intimate', 'desire', 'tactile', 'embrace'] },
  { id: 'jester', name: 'The Jester', axis: 'Social', motto: 'Irreverent wit and playful candor', keywords: ['play', 'wit', 'absurd', 'laugh', 'irony', ' irreverent', 'spark'] },
  { id: 'everyman', name: 'The Everyman', axis: 'Social', motto: 'Grounded solidarity and belonging', keywords: ['everyday', 'shared', 'common', 'neighbor', 'accessible', 'grounded'] },
  { id: 'caregiver', name: 'The Caregiver', axis: 'Order', motto: 'Stewardship, shelter, and protection', keywords: ['protect', 'nurture', 'steward', 'shelter', 'gentle', 'heal', 'care'] },
  { id: 'ruler', name: 'The Ruler', axis: 'Order', motto: 'Sovereign order and enduring legacy', keywords: ['sovereign', 'crown', 'legacy', 'command', 'standard', 'monument'] },
  { id: 'creator', name: 'The Creator', axis: 'Ego', motto: 'Enduring form from original vision', keywords: ['craft', 'atelier', 'build', 'architect', 'form', 'bespoke', 'design'] },
];

export function clamp(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

export function sanitizeString(input: unknown, maxLen = 400): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLen);
}

export function computeSemioticQuadrant(
  x: number,
  y: number,
  square: SemioticSquareData
): { zone: string; label: string; insight: string } {
  const cx = clamp(x, 0, 100);
  const cy = clamp(y, 0, 100);
  const isLeft = cx < 50;
  const isTop = cy < 50;

  if (isLeft && isTop) {
    return {
      zone: 'S1 (Primary Assertion)',
      label: square.s1,
      insight: `Anchored in "${square.s1}". High category legibility, but risks crowding with legacy incumbents.`,
    };
  }
  if (!isLeft && isTop) {
    return {
      zone: 'S2 (Direct Contrary)',
      label: square.s2,
      insight: `Positioned at "${square.s2}". Sharp binary contrast against ${square.s1}, ideal for challenger differentiation.`,
    };
  }
  if (isLeft && !isTop) {
    return {
      zone: '¬S2 (Sub-Contrary Synthesis)',
      label: square.notS2,
      insight: `Occupies "${square.notS2}"—an unmapped cultural synthesis that transcends ${square.s2} without cliché.`,
    };
  }
  return {
    zone: '¬S1 (Negation / Counter-Code)',
    label: square.notS1,
    insight: `Occupies "${square.notS1}"—actively subverts ${square.s1} to open a novel semiotic territory.`,
  };
}

export function scoreTextAgainstArchetypes(
  copySample: string,
  visualCues: string
): Record<ArchetypeId, number> {
  const combined = `${copySample} ${visualCues}`.toLowerCase();
  const scores = {} as Record<ArchetypeId, number>;

  for (const arch of ARCHETYPE_CATALOG) {
    let hits = 0;
    for (const kw of arch.keywords) {
      if (combined.includes(kw.trim())) {
        hits += 1;
      }
    }
    scores[arch.id] = clamp(25 + hits * 22, 10, 98);
  }
  return scores;
}

export function analyzeArchetypeAlignment(weights: Record<ArchetypeId, number>): {
  primary: ArchetypeMeta;
  secondary: ArchetypeMeta;
  dilutionStatus: 'Cohesive' | 'Moderate Tension' | 'Diluted Signal';
  diagnostic: string;
} {
  const sorted = [...ARCHETYPE_CATALOG].sort(
    (a, b) => (weights[b.id] ?? 0) - (weights[a.id] ?? 0)
  );
  const primary = sorted[0];
  const secondary = sorted[1];

  const conflictingPairs: Array<[ArchetypeId, ArchetypeId]> = [
    ['sage', 'jester'],
    ['ruler', 'outlaw'],
    ['innocent', 'outlaw'],
    ['caregiver', 'outlaw'],
    ['lover', 'sage'],
  ];

  const isConflict = conflictingPairs.some(
    ([a, b]) =>
      (primary.id === a && secondary.id === b) ||
      (primary.id === b && secondary.id === a)
  );

  const gap = (weights[primary.id] ?? 0) - (weights[secondary.id] ?? 0);

  if (isConflict && gap < 25) {
    return {
      primary,
      secondary,
      dilutionStatus: 'Diluted Signal',
      diagnostic: `High dilution risk: ${primary.name} (${primary.axis}) collides with ${secondary.name} (${secondary.axis}) at a narrow ${gap}-point margin.`,
    };
  }
  if (primary.axis !== secondary.axis && gap < 15) {
    return {
      primary,
      secondary,
      dilutionStatus: 'Moderate Tension',
      diagnostic: `Cross-axis blend between ${primary.name} and ${secondary.name}. Ensure visual codes anchor ${primary.name} clearly.`,
    };
  }
  return {
    primary,
    secondary,
    dilutionStatus: 'Cohesive',
    diagnostic: `Harmonious ${primary.axis} alignment led by ${primary.name} and reinforced by ${secondary.name}.`,
  };
}

export function synthesizeRhetoricalTropes(
  rawFeature: string,
  brandName: string,
  tone: 'Archival' | 'Provocative' | 'Intimate' | 'Technical'
): RhetoricalTransformation[] {
  const cleanFeature = sanitizeString(rawFeature, 180) || 'precision-crafted daily ritual';
  const cleanBrand = sanitizeString(brandName, 60) || 'The Brand';

  const tonePrefix = {
    Archival: 'Enduring',
    Provocative: 'Unapologetic',
    Intimate: 'Quietly tactile',
    Technical: 'Calibrated',
  }[tone];

  return [
    {
      trope: 'metaphor',
      headline: `${tonePrefix} architecture for ${cleanFeature.toLowerCase()}`,
      body: `${cleanBrand} treats ${cleanFeature.toLowerCase()} not as a utility, but as a permanent instrument of daily clarity.`,
      mechanism: 'Substitution — equates a functional feature with an enduring architectural artifact.',
    },
    {
      trope: 'metonymy',
      headline: `The weight of ${cleanBrand} in every unhurried hour`,
      body: `Where ${cleanFeature.toLowerCase()} becomes the unmistakable signature of a deliberate life.`,
      mechanism: 'Association — replaces the product with the sensory atmosphere and time it commands.',
    },
    {
      trope: 'synecdoche',
      headline: `One calibrated detail. The entire standard.`,
      body: `In ${cleanBrand}, ${cleanFeature.toLowerCase()} is the single part that reveals the integrity of the whole.`,
      mechanism: 'Part-for-Whole — elevates a specific micro-feature to stand for total brand character.',
    },
    {
      trope: 'irony',
      headline: `Engineered to do less, so you notice everything else`,
      body: `While the category shouts for attention, ${cleanBrand} builds ${cleanFeature.toLowerCase()} that disappears into use.`,
      mechanism: 'Contrast — subverts category excess by celebrating restraint and quiet performance.',
    },
  ];
}

export function evaluateReceptionRisk(segments: ReceptionSegment[]): {
  avgDominant: number;
  avgNegotiated: number;
  avgOppositional: number;
  highRiskCount: number;
  overallStatus: 'Aligned' | 'Requires Framing' | 'High Friction';
} {
  if (segments.length === 0) {
    return {
      avgDominant: 0,
      avgNegotiated: 0,
      avgOppositional: 0,
      highRiskCount: 0,
      overallStatus: 'Requires Framing',
    };
  }

  let dom = 0;
  let neg = 0;
  let opp = 0;
  let highRiskCount = 0;

  for (const seg of segments) {
    const total = seg.dominantPct + seg.negotiatedPct + seg.oppositionalPct || 1;
    const d = (seg.dominantPct / total) * 100;
    const n = (seg.negotiatedPct / total) * 100;
    const o = (seg.oppositionalPct / total) * 100;
    dom += d;
    neg += n;
    opp += o;
    if (o >= 25) highRiskCount += 1;
  }

  const count = segments.length;
  const avgDominant = Math.round(dom / count);
  const avgNegotiated = Math.round(neg / count);
  const avgOppositional = Math.round(opp / count);

  const overallStatus =
    avgOppositional >= 25 || highRiskCount >= 2
      ? 'High Friction'
      : avgDominant >= 50
      ? 'Aligned'
      : 'Requires Framing';

  return {
    avgDominant,
    avgNegotiated,
    avgOppositional,
    highRiskCount,
    overallStatus,
  };
}

export function validateAndParseBrandProject(jsonString: string): BrandProject | null {
  try {
    if (typeof jsonString !== 'string' || jsonString.length > 250_000) {
      return null;
    }
    const parsed = JSON.parse(jsonString, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined;
      }
      return value;
    });

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    const name = sanitizeString(parsed.name, 80);
    if (!name) return null;

    const sq = parsed.semioticSquare;
    if (!sq || typeof sq !== 'object') return null;

    const arch = parsed.archetypes;
    if (!arch || typeof arch !== 'object' || !arch.weights) return null;

    const myth = parsed.mythEngine;
    const story = parsed.storyCircle;
    const signifier = parsed.signifierAudit;
    const codeMapper = parsed.codeMapper;
    const rhetoric = parsed.rhetoricDesigner;
    const reception = parsed.receptionRadar;

    if (!myth || !story || !signifier || !codeMapper || !rhetoric || !reception) {
      return null;
    }

    const sanitizedWeights = {} as Record<ArchetypeId, number>;
    for (const item of ARCHETYPE_CATALOG) {
      sanitizedWeights[item.id] = clamp(Number(arch.weights[item.id] ?? 50), 0, 100);
    }

    return {
      id: sanitizeString(parsed.id, 64) || `brand-${Date.now()}`,
      name,
      sector: sanitizeString(parsed.sector, 80) || 'Brand Strategy',
      thesis: sanitizeString(parsed.thesis, 320),
      updatedAt: new Date().toISOString().slice(0, 10),
      semioticSquare: {
        activeVector: sanitizeString(sq.activeVector, 80) || 'Nature vs. Culture',
        s1: sanitizeString(sq.s1, 60) || 'S1',
        s2: sanitizeString(sq.s2, 60) || 'S2',
        notS2: sanitizeString(sq.notS2, 60) || '¬S2',
        notS1: sanitizeString(sq.notS1, 60) || '¬S1',
        brandPosition: {
          x: clamp(Number(sq.brandPosition?.x ?? 50), 0, 100),
          y: clamp(Number(sq.brandPosition?.y ?? 50), 0, 100),
        },
        competitors: Array.isArray(sq.competitors)
          ? sq.competitors.slice(0, 12).map((c: Record<string, unknown>, idx: number) => ({
              id: sanitizeString(c.id, 40) || `comp-${idx}`,
              name: sanitizeString(c.name, 40) || `Competitor ${idx + 1}`,
              x: clamp(Number(c.x ?? 50), 0, 100),
              y: clamp(Number(c.y ?? 50), 0, 100),
            }))
          : [],
      },
      archetypes: {
        copySample: sanitizeString(arch.copySample, 600),
        visualCues: sanitizeString(arch.visualCues, 600),
        weights: sanitizedWeights,
      },
      mythEngine: {
        leftPole: sanitizeString(myth.leftPole, 80),
        leftAnxiety: sanitizeString(myth.leftAnxiety, 220),
        rightPole: sanitizeString(myth.rightPole, 80),
        rightAnxiety: sanitizeString(myth.rightAnxiety, 220),
        brandBridge: sanitizeString(myth.brandBridge, 240),
        mediatingRitual: sanitizeString(myth.mediatingRitual, 240),
        proofPoints: Array.isArray(myth.proofPoints)
          ? myth.proofPoints.slice(0, 8).map((p: unknown) => sanitizeString(p, 160)).filter(Boolean)
          : [],
      },
      storyCircle: {
        campaignTitle: sanitizeString(story.campaignTitle, 100),
        stages: Array.isArray(story.stages)
          ? story.stages.slice(0, 8).map((st: Record<string, unknown>, idx: number) => ({
              step: idx + 1,
              label: sanitizeString(st.label, 40) || `Stage ${idx + 1}`,
              phase: st.phase === 'Chaos' ? 'Chaos' : 'Order',
              sceneTitle: sanitizeString(st.sceneTitle, 80),
              copyBeat: sanitizeString(st.copyBeat, 220),
              emotionalIntensity: clamp(Number(st.emotionalIntensity ?? 5), 1, 10),
            }))
          : [],
      },
      signifierAudit: {
        assetUrl:
          typeof signifier.assetUrl === 'string' &&
          (signifier.assetUrl.startsWith('/src/assets/') || signifier.assetUrl.startsWith('data:image/'))
            ? signifier.assetUrl
            : '/src/assets/images/campaign_vespera_botanicals_1793872064346.jpg',
        assetTitle: sanitizeString(signifier.assetTitle, 100) || 'Campaign Visual',
        pins: Array.isArray(signifier.pins)
          ? signifier.pins.slice(0, 20).map((p: Record<string, unknown>, idx: number) => ({
              id: sanitizeString(p.id, 40) || `pin-${idx}`,
              x: clamp(Number(p.x ?? 50), 0, 100),
              y: clamp(Number(p.y ?? 50), 0, 100),
              label: sanitizeString(p.label, 60) || `Signifier ${idx + 1}`,
              denotation: sanitizeString(p.denotation, 200),
              connotation: sanitizeString(p.connotation, 200),
              ideology: sanitizeString(p.ideology, 200),
            }))
          : [],
      },
      codeMapper: {
        items: Array.isArray(codeMapper.items)
          ? codeMapper.items.slice(0, 30).map((it: Record<string, unknown>, idx: number) => ({
              id: sanitizeString(it.id, 40) || `code-${idx}`,
              title: sanitizeString(it.title, 80) || 'Cultural Code',
              category:
                it.category === 'Verbal' || it.category === 'Ritual' || it.category === 'Material'
                  ? it.category
                  : 'Visual',
              stage:
                it.stage === 'residual' || it.stage === 'emergent' ? it.stage : 'dominant',
              rationale: sanitizeString(it.rationale, 200),
            }))
          : [],
      },
      rhetoricDesigner: {
        rawFeature: sanitizeString(rhetoric.rawFeature, 180),
        targetTone:
          rhetoric.targetTone === 'Provocative' ||
          rhetoric.targetTone === 'Intimate' ||
          rhetoric.targetTone === 'Technical'
            ? rhetoric.targetTone
            : 'Archival',
        transformations: Array.isArray(rhetoric.transformations)
          ? rhetoric.transformations.slice(0, 4).map((t: Record<string, unknown>) => ({
              trope:
                t.trope === 'metonymy' || t.trope === 'synecdoche' || t.trope === 'irony'
                  ? t.trope
                  : 'metaphor',
              headline: sanitizeString(t.headline, 120),
              body: sanitizeString(t.body, 260),
              mechanism: sanitizeString(t.mechanism, 160),
            }))
          : [],
      },
      receptionRadar: {
        campaignMessage: sanitizeString(reception.campaignMessage, 260),
        segments: Array.isArray(reception.segments)
          ? reception.segments.slice(0, 12).map((s: Record<string, unknown>, idx: number) => ({
              id: sanitizeString(s.id, 40) || `seg-${idx}`,
              demographic: sanitizeString(s.demographic, 80) || `Segment ${idx + 1}`,
              dominantPct: clamp(Number(s.dominantPct ?? 50), 0, 100),
              negotiatedPct: clamp(Number(s.negotiatedPct ?? 30), 0, 100),
              oppositionalPct: clamp(Number(s.oppositionalPct ?? 20), 0, 100),
              frictionTrigger: sanitizeString(s.frictionTrigger, 180),
              mitigation: sanitizeString(s.mitigation, 180),
            }))
          : [],
      },
    };
  } catch {
    return null;
  }
}

export function reorderStoryStages(
  stages: StoryStage[],
  fromIndex: number,
  toIndex: number
): StoryStage[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= stages.length ||
    toIndex >= stages.length
  ) {
    return stages;
  }
  const copy = [...stages];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy.map((st, idx) => ({
    ...st,
    step: idx + 1,
    phase: (idx >= 2 && idx <= 5 ? 'Chaos' : 'Order') as 'Order' | 'Chaos',
  }));
}

