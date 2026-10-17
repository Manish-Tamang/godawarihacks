// Picks one representative per near-duplicate cluster (largest file = most detail).
import {readFile, writeFile, stat} from 'node:fs/promises'
import {join} from 'node:path'

const SRC =
  '/mnt/c/Users/ACER/Downloads/Godawari Hacks 2026-20261017T111127Z-1-001/Godawari Hacks 2026/Photos'
const [groupsPath, manifestPath, outPath] = process.argv.slice(2)

const groups = JSON.parse(await readFile(groupsPath, 'utf8'))
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const idxByFile = new Map(manifest.map((m) => [m.file, m.idx]))

const reps = []
for (const group of groups) {
  const sized = await Promise.all(
    group.map(async (f) => ({file: f, size: (await stat(join(SRC, f))).size})),
  )
  sized.sort((a, b) => b.size - a.size)
  const best = sized[0].file
  reps.push({
    file: best,
    thumb: idxByFile.get(best),
    clusterSize: group.length,
    alsoDropped: group.filter((f) => f !== best),
  })
}

// Keep chronological-ish order by filename so the gallery reads as a timeline.
reps.sort((a, b) => a.file.localeCompare(b.file))
reps.forEach((r, i) => (r.order = i + 1))

await writeFile(outPath, JSON.stringify(reps, null, 2))
console.log('representatives:', reps.length)
console.log('thumbs to review:', reps.map((r) => r.thumb).join(' '))
