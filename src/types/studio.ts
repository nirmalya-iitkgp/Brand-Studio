export type ToolId =
  | 'hub'
  | 'semiotic-square'
  | 'archetypes'
  | 'myth-engine'
  | 'story-circle'
  | 'signifier-audit'
  | 'code-mapper'
  | 'rhetoric-designer'
  | 'reception-radar';

export type ArchetypeId =
  | 'innocent'
  | 'sage'
  | 'explorer'
  | 'outlaw'
  | 'magician'
  | 'hero'
  | 'lover'
  | 'jester'
  | 'everyman'
  | 'caregiver'
  | 'ruler'
  | 'creator';

export type CulturalStage = 'residual' | 'dominant' | 'emergent';

export type TropeType = 'metaphor' | 'metonymy' | 'synecdoche' | 'irony';

export interface CompetitorPin {
  id: string;
  name: string;
  x: number; // 0-100
  y: number; // 0-100
}

export interface SemioticSquareData {
  activeVector: string;
  s1: string;
  s2: string;
  notS2: string;
  notS1: string;
  brandPosition: { x: number; y: number };
  competitors: CompetitorPin[];
}

export interface ArchetypeData {
  copySample: string;
  visualCues: string;
  weights: Record<ArchetypeId, number>;
}

export interface MythEngineData {
  leftPole: string;
  leftAnxiety: string;
  rightPole: string;
  rightAnxiety: string;
  brandBridge: string;
  mediatingRitual: string;
  proofPoints: string[];
}

export interface StoryStage {
  step: number;
  label: string;
  phase: 'Order' | 'Chaos';
  sceneTitle: string;
  copyBeat: string;
  emotionalIntensity: number; // 1-10
}

export interface StoryCircleData {
  campaignTitle: string;
  stages: StoryStage[];
}

export interface SignifierPin {
  id: string;
  x: number; // 0-100%
  y: number; // 0-100%
  label: string;
  denotation: string;
  connotation: string;
  ideology: string;
  // Ogden & Richards Semiotic Triangle & Saussurean Structuralism
  thoughtReference?: string;
  referent?: string;
  paradigmaticAlternative?: string;
  culturalAxisX?: number; // -50 (Conventional) to +50 (Subversive)
  culturalAxisY?: number; // -50 (Literal/Denotative) to +50 (Mythic/Connotative)
}

export interface SignifierAuditData {
  assetUrl: string;
  assetTitle: string;
  textualAsset?: string;
  pins: SignifierPin[];
}

export interface CulturalCodeItem {
  id: string;
  title: string;
  category: 'Visual' | 'Verbal' | 'Ritual' | 'Material';
  stage: CulturalStage;
  rationale: string;
}

export interface CodeMapperData {
  items: CulturalCodeItem[];
}

export interface RhetoricalTransformation {
  trope: TropeType;
  headline: string;
  body: string;
  mechanism: string;
}

export interface RhetoricDesignerData {
  rawFeature: string;
  targetTone: 'Archival' | 'Provocative' | 'Intimate' | 'Technical';
  transformations: RhetoricalTransformation[];
}

export interface ReceptionSegment {
  id: string;
  demographic: string;
  dominantPct: number;
  negotiatedPct: number;
  oppositionalPct: number;
  frictionTrigger: string;
  mitigation: string;
}

export interface ReceptionRadarData {
  campaignMessage: string;
  segments: ReceptionSegment[];
}

export interface BrandProject {
  id: string;
  name: string;
  sector: string;
  thesis: string;
  updatedAt: string;
  semioticSquare: SemioticSquareData;
  archetypes: ArchetypeData;
  mythEngine: MythEngineData;
  storyCircle: StoryCircleData;
  signifierAudit: SignifierAuditData;
  codeMapper: CodeMapperData;
  rhetoricDesigner: RhetoricDesignerData;
  receptionRadar: ReceptionRadarData;
}
