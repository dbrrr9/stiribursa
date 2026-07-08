const fs = require('fs');

let content = fs.readFileSync('src/lib/news.functions.ts', 'utf-8');

// The schemas in the file are represented as AST objects, we can't easily eval them because they contain comments and references (though mostly static).
// Wait, the easiest way is to use OpenAI without strict mode! Or use zod-to-json-schema if we have zod.
