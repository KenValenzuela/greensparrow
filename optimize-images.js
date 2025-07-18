/* optimize-images.js
 * Recursively scans ./public for .jpg, .jpeg, .png files,
 * converts each to WebP, down‑scales anything > MAX_WIDTH,
 * and writes the result to ./public/ preserving
 * the original directory structure.
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.resolve(__dirname, 'public');
const OUTPUT_DIR = path.resolve(__dirname, 'public');
const ALLOWED = new Set(['.jpg', '.jpeg', '.png']);
const MAX_WIDTH = 1920;   // px – adjust if you want a smaller ceiling
const QUALITY = 75;     // WebP quality 0‑100

/* Walk a directory tree and yield absolute file paths */
async function* walk(dir) {
    for (const entry of await fsp.readdir(dir, {withFileTypes: true})) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            yield* walk(fullPath);
        } else {
            yield fullPath;
        }
    }
}

(async () => {
    let converted = 0;
    for await (const absPath of walk(INPUT_DIR)) {
        const ext = path.extname(absPath).toLowerCase();
        if (!ALLOWED.has(ext)) continue;          // skip mp4, svg, etc.

        const relPath = path.relative(INPUT_DIR, absPath);
        const outPath = path.join(OUTPUT_DIR, relPath).replace(/\.(jpe?g|png)$/i, '.webp');
        const outDir = path.dirname(outPath);
        await fsp.mkdir(outDir, {recursive: true});

        try {
            const img = sharp(absPath);
            const {width} = await img.metadata();
            const pipeline = width && width > MAX_WIDTH ? img.resize({width: MAX_WIDTH}) : img;

            await pipeline
                .webp({quality: QUALITY})
                .toFile(outPath);

            converted++;
            console.log(`✓ ${relPath} → ${path.relative(OUTPUT_DIR, outPath)}`);
        } catch (err) {
            console.error(`⚠︎  failed on ${relPath}`, err);
        }
    }
    console.log(`\nDone. Optimized ${converted} image${converted !== 1 ? 's' : ''}.`);
})();
