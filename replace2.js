import fs from 'fs';
import path from 'path';

const replacements = {
  '#09090b': '#0f172a',
  '#18181b': '#1e293b',
  '#27272a': '#334155',
  '#000000': '#020617',
  '#EC4899': '#6366f1',
  '#F59E0B': '#10b981',
  '#A1A1AA': '#94a3b8',
  '#FAFAFA': '#f8fafc',
  'from-\\[#EC4899\\]': 'from-[#6366f1]',
  'to-\\[#F59E0B\\]': 'to-[#10b981]',
  'from-\\[#F59E0B\\]': 'from-[#10b981]',
  'to-\\[#EC4899\\]': 'to-[#6366f1]',
  'shadow-\\[0_0_20px_rgba\\(236,72,153,0.3\\)\\]': 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
  'shadow-\\[0_0_30px_rgba\\(245,158,11,0.4\\)\\]': 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
  'shadow-\\[0_0_15px_rgba\\(245,158,11,0.4\\)\\]': 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
  'shadow-\\[#F59E0B\\]/15': 'shadow-[#10b981]/15',
  
  // Also replace any leftover original colors from earlier:
  '#0A0A14': '#0f172a',
  '#131128': '#1e293b',
  '#1A1A3D': '#334155',
  '#0c0c1b': '#020617',
  '#7C5CFC': '#6366f1',
  '#00E5C3': '#10b981',
  '#7A7A9D': '#94a3b8',
  '#F0F0FF': '#f8fafc',
  'from-\\[#7C5CFC\\]': 'from-[#6366f1]',
  'to-\\[#00E5C3\\]': 'to-[#10b981]',
  'from-\\[#00E5C3\\]': 'from-[#10b981]',
  'to-\\[#7C5CFC\\]': 'to-[#6366f1]',
  'shadow-\\[0_0_20px_rgba\\(124,92,252,0.3\\)\\]': 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
  'shadow-\\[0_0_30px_rgba\\(0,229,195,0.4\\)\\]': 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
  'shadow-\\[0_0_15px_rgba\\(0,229,195,0.4\\)\\]': 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
  'shadow-\\[#00E5C3\\]/15': 'shadow-[#10b981]/15',
  
  'bg-\\[#111128\\]': 'bg-[#1e293b]',
  'bg-\\[#1F174B\\]': 'bg-[#1e293b]',
  'border-\\[#FFB86C\\]/10': 'border-[#6366f1]/10',
  'bg-\\[#FFB86C\\]/10': 'bg-[#6366f1]/10',
  'text-\\[#FFB86C\\]': 'text-[#6366f1]',
  'border-\\[#FFB86C\\]/20': 'border-[#6366f1]/20',
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
