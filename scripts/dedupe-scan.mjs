// Groups near-duplicate photos via dHash + Hamming distance.
import {readdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import sharp from 'sharp'

const SRC =
  '/mnt/c/Users/ACER/Downloads/Godawari Hacks 2026-20261017T111127Z-1-001/Godawari Hacks 2026/Photos'
const THRESHOLD = 12 // bits differing out of 64

async function dhash(file) {
  const px = await sharp(join(SRC, file))
    .rotate()
    .greyscale()
    .resize(9, 8, {fit: 'fill'})
    .raw()
    .toBuffer()
  const bits = []
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++)
      bits.push(px[y * 9 + x] > px[y * 9 + x + 1] ? 1 : 0)
  return bits
}

const dist = (a, b) => a.reduce((n, bit, i) => n + (bit !== b[i] ? 1 : 0), 0)

const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort()
const hashes = []
for (const f of files) hashes.push({file: f, bits: await dhash(f)})

const groups = []
const used = new Set()
for (let i = 0; i < hashes.length; i++) {
  if (used.has(i)) continue
  const group = [hashes[i].file]
  used.add(i)
  for (let j = i + 1; j < hashes.length; j++) {
    if (used.has(j)) continue
    if (dist(hashes[i].bits, hashes[j].bits) <= THRESHOLD) {
      group.push(hashes[j].file)
      used.add(j)
    }
  }
  groups.push(group)
}

groups.sort((a, b) => b.length - a.length)
await writeFile(process.argv[2], JSON.stringify(groups, null, 2))

console.log('total photos :', files.length)
console.log('unique scenes:', groups.length)
console.log('redundant    :', files.length - groups.length)
console.log('\nlargest clusters:')
for (const g of groups.slice(0, 8)) console.log(`  ${g.length}x  ${g[0]}`)
