# Signum Atelier — Brand Semiotic & Cultural Narrative Architecture Studio

**Signum Atelier** is a qualitative cultural theory and brand strategy workbench that bridges structural semiotics, Jungian psychology, comparative narratology, and reception theory with eight interactive analytical instruments.

## Eight Analytical Instruments

1. **Semiotic Square Matrix Generator (Greimas Square)** — Interactive 4-node relational graph mapping contraries ($S_1 \leftrightarrow S_2$), contradictions, and sub-contraries ($\neg S_2 \leftrightarrow \neg S_1$) with toggleable cultural opposition vectors and competitor positioning.
2. **Archetypal Brand Persona Classifier (Pearson/Jung)** — 12-segment radial wheel scoring messaging and visual cues across all 12 Jungian archetypes with automatic archetype dilution diagnostics.
3. **Structural Myth-Building Canvas (Lévi-Strauss Binary Engine)** — Two-column cultural tension balance board contrasting societal anxieties with a central Brand Resolution Bridge and mediating ritual proofs.
4. **Multi-Tier Narrative Arc Builder (Dan Harmon Story Circle & Campbell Monomyth)** — Interactive 8-stage circular timeline (*You → Need → Go → Search → Find → Take → Return → Change*) with reorderable scene/copy beats and emotional intensity calibration.
5. **Visual Signifier & Codes Audit Matrix (Barthesian Semiotics)** — Multi-layered image annotation editor for pinning coordinate markers onto campaign visuals and deconstructing **Denotation**, **Connotation**, and **Ideology/Myth**.
6. **Cultural Trend & Code Evolution Mapper (Raymond Williams)** — 3-column horizontal swimlane board categorizing brand tropes into **Residual**, **Dominant**, and **Emergent** cultural horizons.
7. **Rhetorical Tropes & Metaphor Designer (Classical Rhetoric)** — Copy transformation workbench synthesizing **Metaphor**, **Metonymy**, **Synecdoche**, and **Irony** from raw product features.
8. **Consumer Meaning-Making Radar (Stuart Hall Encoding/Decoding)** — Three-zone reception probability radar and demographic stress-test matrix scoring **Dominant**, **Negotiated**, and **Oppositional** readings.

## Architecture & Security

- **Deterministic Analytical Engines**: All scoring, quadrant mapping, rhetorical synthesis, and reception risk calculations run deterministically in TypeScript (`src/utils/semioticEngines.ts`) with zero external AI/LLM dependencies.
- **Local Workspace & Dossier Portability**: Brand workspaces persist automatically in `localStorage` with curated sample case studies (*Vespera Botanicals*, *Kinetix Mobility*, *Aetheris Audio*) and full JSON dossier export/import.
- **Input Sanitization & Schema Hardening**: Imported JSON dossiers pass through `validateAndParseBrandProject`, which strips HTML/script payloads, blocks `__proto__`/`constructor` prototype pollution, validates image URLs, and clamps all numeric coordinates and percentages.

## Running Tests & Build

```bash
# Run unit & security tests
npx tsx --test tests/semioticEngines.test.ts

# Typecheck & production build
npm run lint
npm run build
```
