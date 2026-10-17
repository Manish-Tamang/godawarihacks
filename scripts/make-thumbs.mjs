import {readdir, mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import sharp from 'sharp'

const SRC =
  '/mnt/c/Users/ACER/Downloads/Godawari Hacks 2026-20261017T111127Z-1-001/Godawari Hacks 2026/Photos'
const OUT = process.argv[2]

await mkdir(OUT, {recursive: true})

const files = (await readdir(SRC))
  .filter((f) => /\.(jpe?g)$/i.test(f))
  .sort()

const manifest = []
let i = 0

for (const file of files) {
  const idx = String(++i).padStart(3, '0')
  const src = join(SRC, file)
  const meta = await sharp(src).metadata()
  // EXIF orientation 5-8 swap width/height when rendered
  const rotated = (meta.orientation ?? 1) >= 5
  const width = rotated ? meta.height : meta.width
  const height = rotated ? meta.width : meta.height

  await sharp(src)
    .rotate()
    .resize({width: 360, height: 360, fit: 'inside'})
    .jpeg({quality: 58})
    .toFile(join(OUT, `${idx}.jpg`))

  manifest.push({
    idx,
    file,
    width,
    height,
    orientation: width > height ? 'landscape' : width < height ? 'portrait' : 'square',
  })
}

await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))

const by = (k) =>
  manifest.reduce((a, m) => ((a[m[k]] = (a[m[k]] ?? 0) + 1), a), {})
console.log('thumbs:', manifest.length)
console.log('orientation:', by('orientation'))
