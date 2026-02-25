const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/pages/ThemesPreviewsNew.tsx'), 'utf8');

// Replace standard names with {res.name}
content = content.replace(/Elena <span>Vasquez<\/span>/g, '{res.name}');
content = content.replace(/<span className="first">Marcus<\/span> Chen/g, '{res.name}');
content = content.replace(/Priya Nair/g, '{res.name}');
content = content.replace(/Olivia <span>Park<\/span>/g, '{res.name}');
content = content.replace(/Tobias <span className="accent">Keller<\/span>/g, '{res.name}');
content = content.replace(/KAI<br \/><span className="highlight">NAKAMURA<\/span>/g, '{res.name}');
content = content.replace(/Amara Osei/g, '{res.name}');
content = content.replace(/Lena<br \/>Hoffman/g, '{res.name}');
content = content.replace(/Jordan Rivera/g, '{res.name}');
content = content.replace(/Isabelle Fontaine/g, '{res.name}');
content = content.replace(/Eleanor <em>Whitfield<\/em>/g, '{res.name}');

// Since the user asked to "add all the resume templates from html folder", let's append it to ThemesPreviews.tsx
fs.writeFileSync(path.join(__dirname, 'src/pages/ThemesPreviewsNew2.tsx'), content);
