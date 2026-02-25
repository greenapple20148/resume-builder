const fs = require('fs');
const path = require('path');

const files = [
  'Resume_1_Editorial_Luxe.html',
  'Resume_2_Dark_Architect.html',
  'Resume_3_Bauhaus_Geometric.html',
  'Resume_4_Soft_Pastel.html',
  'Resume_5_Swiss_Grid.html',
  'Resume_6_Brutalist_Raw.html',
  'Resume_7_Warm_Earth.html',
  'Resume_8_Monochrome_Precision.html',
  'Resume_9_Gradient_Horizon.html',
  'Resume_10_Art_Deco_Revival.html',
  'phd-resume.html'
];

const htmlDir = path.join(__dirname, 'src/pages/html');

files.forEach(file => {
  const content = fs.readFileSync(path.join(htmlDir, file), 'utf8');
  // Just print some basic info about the body structure
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    console.log(`File: ${file}`);
    console.log(`Body length: ${bodyMatch[1].length}`);
  }
});
