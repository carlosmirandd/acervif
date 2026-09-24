// Validação leve de HTML/JS para o CI: sem dependências externas.
// - Extrai cada <script> ou <script type="module"> inline e checa a
//   sintaxe com `node --check` (scripts com "src" externo são ignorados).
// - Confere se as tags HTML estão balanceadas em cada arquivo.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const root = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

let hasError = false;

function checkInlineScripts(file, content) {
    const regex = /<script(?:\s+type="module")?>([\s\S]*?)<\/script>/g;
    let match;
    let i = 0;
    while ((match = regex.exec(content)) !== null) {
        const isModule = /^\s*import\s/.test(match[1]) || match[0].includes('type="module"');
        const ext = isModule ? 'mjs' : 'js';
        const tmpFile = path.join(os.tmpdir(), `check_${path.basename(file)}_${i}.${ext}`);
        fs.writeFileSync(tmpFile, match[1]);
        try {
            execFileSync(process.execPath, ['--check', tmpFile], { stdio: 'pipe' });
        } catch (e) {
            hasError = true;
            console.error(`FALHA de sintaxe em ${file} (script #${i}):\n${e.stderr}`);
        } finally {
            fs.unlinkSync(tmpFile);
        }
        i++;
    }
}

function checkTagBalance(file, content) {
    // Remove comentários e conteúdo de <script>/<style> pra não confundir o parser com < e > dentro de JS/CSS.
    const cleaned = content
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<style[\s\S]*?<\/style>/g, '');

    const stack = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
    let match;
    while ((match = tagRegex.exec(cleaned)) !== null) {
        const [full, tagName, selfClosingSlash] = match;
        const name = tagName.toLowerCase();
        if (name === '!doctype') continue;
        if (VOID_TAGS.has(name) || selfClosingSlash === '/') continue;
        if (full.startsWith('</')) {
            if (stack.length === 0 || stack[stack.length - 1] !== name) {
                hasError = true;
                console.error(`Tag desbalanceada em ${file}: esperava fechar <${stack[stack.length - 1]}>, achou </${name}>`);
                return;
            }
            stack.pop();
        } else {
            stack.push(name);
        }
    }
    if (stack.length > 0) {
        hasError = true;
        console.error(`Tags não fechadas em ${file}: ${stack.join(', ')}`);
    }
}

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    checkInlineScripts(file, content);
    checkTagBalance(file, content);
}

if (hasError) {
    process.exit(1);
} else {
    console.log(`OK — ${htmlFiles.length} arquivo(s) HTML validados.`);
}
