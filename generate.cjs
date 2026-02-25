const fs = require('fs');
const path = require('path');

const files = [
    { file: 'Resume_1_Editorial_Luxe.html', id: 'editorial_luxe', name: 'Editorial Luxe', accent: '#dca47d', bg: '#fdfbf9' },
    { file: 'Resume_2_Dark_Architect.html', id: 'dark_architect', name: 'Dark Architect', accent: '#f5c800', bg: '#121212' },
    { file: 'Resume_3_Bauhaus_Geometric.html', id: 'bauhaus_geometric', name: 'Bauhaus Geometric', accent: '#005bb5', bg: '#fafafa' },
    { file: 'Resume_4_Soft_Pastel.html', id: 'soft_pastel', name: 'Soft Pastel', accent: '#a29bfe', bg: '#fbf9fc' },
    { file: 'Resume_5_Swiss_Grid.html', id: 'swiss_grid', name: 'Swiss Grid', accent: '#e84118', bg: '#ffffff' },
    { file: 'Resume_6_Brutalist_Raw.html', id: 'brutalist_raw', name: 'Brutalist Raw', accent: '#0000ff', bg: '#e0e0e0' },
    { file: 'Resume_7_Warm_Earth.html', id: 'warm_earth', name: 'Warm Earth', accent: '#b96b4b', bg: '#fbf9f6' },
    { file: 'Resume_8_Monochrome_Precision.html', id: 'monochrome_precision', name: 'Monochrome Precision', accent: '#333333', bg: '#ffffff' },
    { file: 'Resume_9_Gradient_Horizon.html', id: 'gradient_horizon', name: 'Gradient Horizon', accent: '#00c6ff', bg: '#ffffff' },
    { file: 'Resume_10_Art_Deco_Revival.html', id: 'art_deco_revival', name: 'Art Deco Revival', accent: '#a08b6d', bg: '#fcfbfa' },
    { file: 'phd-resume.html', id: 'phd', name: 'PhD Academic', accent: '#1a4e8a', bg: '#ffffff' }
];

function processHtml(html, compName, id) {
    let bodyMatch = html.match(/<div class="page"[^>]*>([\s\S]*?)<\/div>\s*<\/body>/i);
    if (!bodyMatch) {
        bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    }

    let jsx = bodyMatch ? bodyMatch[1] : html;

    // Basic JSX fixes
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');
    jsx = jsx.replace(/<hr([^>]*)>/g, '<hr$1 />');
    jsx = jsx.replace(/<br([^>]*)>/g, '<br$1 />');
    jsx = jsx.replace(/<img(.*?)>/g, '<img$1 />');

    // convert inline styles
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        let styleObj = {};
        p1.split(';').forEach(rule => {
            let parts = rule.split(':');
            if (parts.length === 2) {
                let key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                styleObj[key] = parts[1].trim();
            }
        });
        return `style={${JSON.stringify(styleObj)}}`;
    });

    return `
export function ${compName}({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, '${id}')
  return (
    <div className="${id}-wrapper" style={{ zoom: 0.6, transformOrigin: 'top left', width: '166%' }}>
      ${jsx}
    </div>
  )
}
`;
}

let out = `import React from 'react';\nimport { useDynamicData } from './ThemesPreviews';\nimport { PreviewProps } from '../types';\n`;

files.forEach(({ file, id }) => {
    const compName = file.replace(/(_|\.html|-)/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Preview';
    const html = fs.readFileSync(path.join(__dirname, 'src/pages/html', file), 'utf8');
    out += processHtml(html, compName, id);
});

fs.writeFileSync(path.join(__dirname, 'src/pages/ThemesPreviewsNew.tsx'), out);
