import fs from 'fs';
import path from 'path';

const replacements = {
  '#0A0A14': '#09090b', // Background dark zinc
  '#131128': '#18181b', // Cards zinc-900
  '#1A1A3D': '#27272a', // Cards hover zinc-800
  '#0c0c1b': '#000000', // Deepest background
  '#7C5CFC': '#EC4899', // Pink-500
  '#00E5C3': '#F59E0B', // Amber-500
  '#7A7A9D': '#A1A1AA', // Zinc 400
  '#F0F0FF': '#FAFAFA', // Zinc 50
  'from-\\[#7C5CFC\\]': 'from-[#EC4899]',
  'to-\\[#00E5C3\\]': 'to-[#F59E0B]',
  'from-\\[#00E5C3\\]': 'from-[#F59E0B]',
  'to-\\[#7C5CFC\\]': 'to-[#EC4899]',
  'shadow-\\[0_0_20px_rgba\\(124,92,252,0.3\\)\\]': 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
  'shadow-\\[0_0_30px_rgba\\(0,229,195,0.4\\)\\]': 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
  'shadow-\\[0_0_15px_rgba\\(0,229,195,0.4\\)\\]': 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
  'shadow-\\[#00E5C3\\]/15': 'shadow-[#F59E0B]/15',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('./src');
if (fs.existsSync('./index.html')) files.push('./index.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'gi'), value);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
