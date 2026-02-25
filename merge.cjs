const fs = require('fs');
const path = require('path');

let previews = fs.readFileSync(path.join(__dirname, 'src/pages/ThemesPreviews.tsx'), 'utf8');
let newPreviews = fs.readFileSync(path.join(__dirname, 'src/pages/ThemesPreviewsNew2.tsx'), 'utf8');

// strip imports from newPreviews
newPreviews = newPreviews.replace(/import.*?\n/g, '');

// append components to previews before PREVIEW_MAP
previews = previews.replace('export const PREVIEW_MAP:', newPreviews + '\nexport const PREVIEW_MAP:');

// add them into PREVIEW_MAP
const mapAdditions = `
    editorial_luxe: Resume1EditorialLuxePreview,
    dark_architect: Resume2DarkArchitectPreview,
    bauhaus_geometric: Resume3BauhausGeometricPreview,
    soft_pastel: Resume4SoftPastelPreview,
    swiss_grid: Resume5SwissGridPreview,
    brutalist_raw: Resume6BrutalistRawPreview,
    warm_earth: Resume7WarmEarthPreview,
    monochrome_precision: Resume8MonochromePrecisionPreview,
    gradient_horizon: Resume9GradientHorizonPreview,
    art_deco_revival: Resume10ArtDecoRevivalPreview,
    phd: PhdResumePreview,
`;

previews = previews.replace('classic: ClassicPreview,', mapAdditions + '\n    classic: ClassicPreview,');
fs.writeFileSync(path.join(__dirname, 'src/pages/ThemesPreviews.tsx'), previews);

// Now update ThemesPage.tsx
let themesPage = fs.readFileSync(path.join(__dirname, 'src/pages/ThemesPage.tsx'), 'utf8');

const themesToAdd = `
  { id: 'editorial_luxe', name: 'Editorial Luxe', category: 'creative', desc: 'Luxe editorial layout', accent: '#dca47d', bg: '#fdfbf9' },
  { id: 'dark_architect', name: 'Dark Architect', category: 'dark', desc: 'Dark tech aesthetic', accent: '#f5c800', bg: '#121212' },
  { id: 'bauhaus_geometric', name: 'Bauhaus Geometric', category: 'creative', desc: 'Geometric design', accent: '#005bb5', bg: '#fafafa' },
  { id: 'soft_pastel', name: 'Soft Pastel', category: 'creative', desc: 'Pastel aesthetic', accent: '#a29bfe', bg: '#fbf9fc' },
  { id: 'swiss_grid', name: 'Swiss Grid', category: 'minimal', desc: 'Clean grid system', accent: '#e84118', bg: '#ffffff' },
  { id: 'brutalist_raw', name: 'Brutalist Raw', category: 'creative', desc: 'Raw design elements', accent: '#0000ff', bg: '#e0e0e0' },
  { id: 'warm_earth', name: 'Warm Earth', category: 'minimal', desc: 'Earthy calm layout', accent: '#b96b4b', bg: '#fbf9f6' },
  { id: 'monochrome_precision', name: 'Monochrome Precision', category: 'minimal', desc: 'Black and white sharp', accent: '#333333', bg: '#ffffff' },
  { id: 'gradient_horizon', name: 'Gradient Horizon', category: 'creative', desc: 'Colorful gradients', accent: '#00c6ff', bg: '#ffffff' },
  { id: 'art_deco_revival', name: 'Art Deco Revival', category: 'professional', desc: 'Classic art deco details', accent: '#a08b6d', bg: '#fcfbfa' },
  { id: 'phd', name: 'PhD Academic', category: 'professional', desc: 'Academic focus', accent: '#1a4e8a', bg: '#ffffff' },
`;

// Remove classic and minimalist
themesPage = themesPage.replace(/\{ id: 'classic'.*\n/, '');
themesPage = themesPage.replace(/\{ id: 'minimalist'.*\n/, '');

// Add the new ones after the existing array opens
themesPage = themesPage.replace(/const THEMES: Theme\[\] = \[/, 'const THEMES: Theme[] = [\n' + themesToAdd);

fs.writeFileSync(path.join(__dirname, 'src/pages/ThemesPage.tsx'), themesPage);
