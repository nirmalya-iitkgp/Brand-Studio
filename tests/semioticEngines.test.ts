import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeArchetypeAlignment,
  computeSemioticQuadrant,
  evaluateReceptionRisk,
  reorderStoryStages,
  sanitizeString,
  scoreTextAgainstArchetypes,
  synthesizeRhetoricalTropes,
  validateAndParseBrandProject,
} from '../src/utils/semioticEngines';
import { PRESET_BRAND_PROJECTS } from '../src/data/presets';

test('Greimas Semiotic Square maps coordinates to all 4 quadrants accurately', () => {
  const sq = PRESET_BRAND_PROJECTS[0].semioticSquare;
  assert.equal(computeSemioticQuadrant(20, 20, sq).zone, 'S1 (Primary Assertion)');
  assert.equal(computeSemioticQuadrant(80, 20, sq).zone, 'S2 (Direct Contrary)');
  assert.equal(computeSemioticQuadrant(20, 80, sq).zone, '¬S2 (Sub-Contrary Synthesis)');
  assert.equal(computeSemioticQuadrant(80, 80, sq).zone, '¬S1 (Negation / Counter-Code)');
});

test('Archetype Classifier detects cohesive, moderate tension, and diluted signals', () => {
  const cohesiveWeights = {
    ...PRESET_BRAND_PROJECTS[0].archetypes.weights,
    sage: 88,
    ruler: 76,
    magician: 40,
  };
  const cohesive = analyzeArchetypeAlignment(cohesiveWeights);
  assert.equal(cohesive.primary.id, 'sage');
  assert.equal(cohesive.dilutionStatus, 'Cohesive');

  const moderate = analyzeArchetypeAlignment(PRESET_BRAND_PROJECTS[0].archetypes.weights);
  assert.equal(moderate.dilutionStatus, 'Moderate Tension');

  const dilutedWeights = {
    ...PRESET_BRAND_PROJECTS[0].archetypes.weights,
    sage: 80,
    jester: 75,
    magician: 20,
  };
  const diluted = analyzeArchetypeAlignment(dilutedWeights);
  assert.equal(diluted.dilutionStatus, 'Diluted Signal');
});

test('Deterministic copy scorer boosts matching archetype keywords', () => {
  const scores = scoreTextAgainstArchetypes(
    'Empirical research archive and precision study',
    'Evidence-based monograph'
  );
  assert.ok(scores.sage > 70);
});

test('Rhetorical Tropes Designer synthesizes all 4 classical tropes', () => {
  const tropes = synthesizeRhetoricalTropes(
    'Cold-pressed alpine gentian oil',
    'Vespera',
    'Archival'
  );
  assert.equal(tropes.length, 4);
  assert.deepEqual(
    tropes.map((t) => t.trope),
    ['metaphor', 'metonymy', 'synecdoche', 'irony']
  );
});

test('Stuart Hall Reception Radar flags high-oppositional segments', () => {
  const res = evaluateReceptionRisk([
    {
      id: '1',
      demographic: 'Skeptics',
      dominantPct: 20,
      negotiatedPct: 30,
      oppositionalPct: 50,
      frictionTrigger: 'Price',
      mitigation: 'Proof',
    },
    {
      id: '2',
      demographic: 'Critics',
      dominantPct: 25,
      negotiatedPct: 40,
      oppositionalPct: 35,
      frictionTrigger: 'Tone',
      mitigation: 'Reframe',
    },
  ]);
  assert.equal(res.highRiskCount, 2);
  assert.equal(res.overallStatus, 'High Friction');
});

test('Security Red-Pill / Blue-Pill: sanitizeString strips XSS and javascript: URIs', () => {
  const dirty = '<script>alert(1)</script>javascript:evil() onclick=steal() Clean Brand';
  const clean = sanitizeString(dirty, 100);
  assert.ok(!clean.includes('<script>'));
  assert.ok(!clean.includes('javascript:'));
  assert.ok(!clean.includes('onclick='));
  assert.ok(clean.includes('Clean Brand'));
});

test('Security Red-Pill / Blue-Pill: validateAndParseBrandProject blocks prototype pollution & invalid schemas', () => {
  const malicious = JSON.stringify({
    name: '<img src=x onerror=alert(1)>EvilBrand',
    __proto__: { polluted: true },
    semioticSquare: { brandPosition: { x: 9999, y: -50 } },
    archetypes: { weights: { sage: 500 } },
    mythEngine: {},
    storyCircle: {},
    signifierAudit: { assetUrl: 'javascript:alert(1)' },
    codeMapper: {},
    rhetoricDesigner: {},
    receptionRadar: {},
  });

  const parsed = validateAndParseBrandProject(malicious);
  assert.ok(parsed !== null);
  assert.equal(parsed.name, 'EvilBrand');
  assert.equal(parsed.semioticSquare.brandPosition.x, 100);
  assert.equal(parsed.semioticSquare.brandPosition.y, 0);
  assert.equal(parsed.archetypes.weights.sage, 100);
  assert.ok(!parsed.signifierAudit.assetUrl.startsWith('javascript:'));
  assert.equal(({} as Record<string, unknown>).polluted, undefined);

  assert.equal(validateAndParseBrandProject('not-json'), null);
  assert.equal(validateAndParseBrandProject('{"name":""}'), null);
});

test('Story Circle reorderStoryStages reorders beats and updates step numbers and phases', () => {
  const stages = PRESET_BRAND_PROJECTS[0].storyCircle.stages;
  const reordered = reorderStoryStages(stages, 0, 3);
  assert.equal(reordered[3].label, 'You');
  assert.equal(reordered[3].step, 4);
  assert.equal(reordered[3].phase, 'Chaos');
  assert.equal(reordered[0].step, 1);
  assert.equal(reordered[0].phase, 'Order');
});

