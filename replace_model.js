import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/gemini-2.5-flash-8b/g, 'gemini-2.5-flash'); 
content = content.replace(/gemini-3.5-flash/g, 'gemini-2.5-flash'); 
fs.writeFileSync('server.ts', content);
console.log('Updated server.ts models to gemini-2.5-flash');
