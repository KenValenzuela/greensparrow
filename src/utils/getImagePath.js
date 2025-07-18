/**
 * Build a public URL for any image.
 *
 * ─ artist      eg. 'Joe'  (leave blank for non‑artist assets)
 * ─ filename    original name eg. 'joe_1.jpg'
 * ─ folder      sub‑folder under the artist dir (default 'work')
 * ─ opts.webp   true  → use /public + .webp   ← default
 *               false → keep original folder + suffix
 *
 * Examples
 *   getImagePath({artist:'Joe',filename:'joe_1.jpg'})
 *     ➜ /public/images/artists/joe/work/joe_1.webp
 *
 *   getImagePath({filename:'background.png', folder:'' , webp:false})
 *     ➜ /images/background.png
 */
export default function getImagePath({
                                         artist = '',
                                         filename,
                                         folder = 'work',
                                         webp = true,
                                     }) {
    if (!filename) throw new Error('filename required');

    const baseName = filename.replace(/\.[^.]+$/, '');          // strip extension
    const ext = webp ? '.webp' : filename.match(/\.[^.]+$/)[0];
    const root = webp
        ? '/public/images'           // optimised path
        : '/images';                           // original path

    // artist assets live in /artists/{artist}/{folder}/
    if (artist) {
        return `${root}/artists/${artist.toLowerCase()}/${folder}/${baseName}${ext}`;
    }

    // generic assets live directly under /images/
    return `${root}/${folder ? folder + '/' : ''}${baseName}${ext}`;
}
