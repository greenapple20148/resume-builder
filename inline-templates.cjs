const fs = require('fs');
const path = require('path');
const juice = require('juice');

const templatesDir = path.join(__dirname, 'supabase', 'templates');
const distDir = path.join(__dirname, 'supabase', 'templates', 'inlined');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const templates = [
    'change-email.html',
    'confirm-signup.html',
    'invite-user.html',
    'magic-link.html',
    'reset-password.html'
];

templates.forEach(file => {
    const filePath = path.join(templatesDir, file);
    if (!fs.existsSync(filePath)) return;

    const html = fs.readFileSync(filePath, 'utf-8');

    // Apply juice to inline styles
    const inlinedHtml = juice(html, {
        preserveMediaQueries: true,
        preserveFontFaces: true,
        applyWidthAttributes: true,
        applyHeightAttributes: true,
        insertPreservedExtraCss: true
    });

    const destPath = path.join(distDir, file);
    fs.writeFileSync(destPath, inlinedHtml);
    console.log(`Inlined: ${file}`);
});
