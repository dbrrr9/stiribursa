const fs = require('fs');
let code = fs.readFileSync('src/lib/news.functions.ts', 'utf8');
code = code.replace(
  'const response = await openai.chat.completions.create({',
  'const response = await openai.chat.completions.create({\n      ...({}), // hack for syntax\n    }, { timeout: 7000 }); // added timeout to avoid Netlify 500\n//'
);
fs.writeFileSync('src/lib/news.functions.ts', code);
