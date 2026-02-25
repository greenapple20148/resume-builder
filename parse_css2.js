const fs = require('fs');
const path = require('path');

const files = [
    { file: 'Resume_1_Editorial_Luxe.html', id: 'editorial_luxe' },
    { file: 'Resume_2_Dark_Architect.html', id: 'dark_architect' },
    { file: 'Resume_3_Bauhaus_Geometric.html', id: 'bauhaus_geometric' },
    { file: 'Resume_4_Soft_Pastel.html', id: 'soft_pastel' },
    { file: 'Resume_5_Swiss_Grid.html', id: 'swiss_grid' },
    { file: 'Resume_6_Brutalist_Raw.html', id: 'brutalist_raw' },
    { file: 'Resume_7_Warm_Earth.html', id: 'warm_earth' },
    { file: 'Resume_8_Monochrome_Precision.html', id: 'monochrome_precision' },
    { file: 'Resume_9_Gradient_Horizon.html', id: 'gradient_horizon' },
    { file: 'Resume_10_Art_Deco_Revival.html', id: 'art_deco_revival' },
    { file: 'phd-resume.html', id: 'phd' }
];

let allCss = '';

files.forEach(({ file, id }) => {
    const content = fs.readFileSync(path.join(__dirname, 'src/pages/html', file), 'utf8');
    let styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch) {
        let css = styleMatch[1];

        // Split and filter @media print
        let inMedia = false;
        let braces = 0;
        let cleanCss = '';
        for (let i = 0; i < css.length; i++) {
            let chunk = css.slice(i, i + 15);
            if (!inMedia && chunk.startsWith('@media print')) {
                inMedia = true;
                while (i < css.length && css[i] !== '{') i++;
                braces = 1;
                continue;
            }
            if (inMedia) {
                if (css[i] === '{') braces++;
                if (css[i] === '}') {
                    braces--;
                    if (braces === 0) inMedia = false;
                }
                continue;
            }
            cleanCss += css[i];
        }

        // Remove comments
        cleanCss = cleanCss.replace(/\/\*[\s\S]*?\*\//g, '');

        // Parse
        let currentSelector = '';
        let currentRules = '';
        let inRules = false;
        let finalOutput = '';
        const wrapper = id + '-wrapper';

        for (let i = 0; i < cleanCss.length; i++) {
            let char = cleanCss[i];
            if (char === '{') {
                inRules = true;
            } else if (char === '}') {
                inRules = false;
                let sel = currentSelector.trim();
                if (sel.startsWith('@')) {
                    finalOutput += sel + '{' + currentRules + '}\n';
                } else {
                    let selectors = sel.split(',').map(s => {
                        let sTrim = s.trim();
                        if (!sTrim) return '';
                        if (sTrim === ':root' || sTrim === 'body' || sTrim === 'html') return '.' + wrapper;
                        if (sTrim.includes(':root') || sTrim.includes('body')) {
                            return sTrim.replace(/:root|body|html/g, '.' + wrapper);
                        }
                        if (sTrim === '*, *::before, *::after') {
                            return \`.\${wrapper} *, .\${wrapper} *::before, .\${wrapper} *::after\`;
                    }
                    return '.' + wrapper + ' ' + sTrim;
                }).filter(Boolean).join(', ');
                
                finalOutput += selectors + ' {\n' + currentRules + '\n}\n';
            }
            currentSelector = '';
            currentRules = '';
        } else {
            if (inRules) currentRules += char;
            else currentSelector += char;
        }
    }
    
    allCss += \`/* === \${id} === */\\n\` + finalOutput + '\\n';
  }
});

fs.writeFileSync(path.join(__dirname, 'src/styles/new-themes.css'), allCss);
console.log('done writing style file');
