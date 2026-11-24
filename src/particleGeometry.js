export const forms = ['Ribbon', 'Data wave', 'Geometry']

function hash(index) {
  const number = Math.sin(index * 127.1 + 71.7) * 43758.5453123
  return number - Math.floor(number)
}

export function makeParticles(count) {
  const ribbon = new Float32Array(count * 3)
  const wave = new Float32Array(count * 3)
  const prism = new Float32Array(count * 3)
  const seed = new Float32Array(count)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let index = 0; index < count; index++) {
    const offset = index * 3
    const random = hash(index + 1)
    const t = hash(index * 4 + 25) * 2 - 1
    const strand = index % 3
    const lane = strand - 1
    const width = (hash(index * 3 + 7) - .5) * (.62 + .28 * (1 - Math.abs(t)))
    const twist = t * 5.3 + strand * 1.14
    ribbon.set([
      t * 1.77 + .16 * Math.cos(twist) + width * .4 * Math.cos(twist),
      .65 * Math.sin(t * 3.7 + lane * .48) + lane * .21 + width * Math.cos(twist),
      .72 * Math.cos(t * 2.75 + lane * .7) + width * Math.sin(twist),
    ], offset)

    const rows = 34
    const columns = 36
    const waveX = ((index % columns) / (columns - 1) * 2 - 1) * 1.78
    const waveZ = ((Math.floor(index / columns) % rows) / (rows - 1) * 2 - 1) * 1.13
    const band = Math.floor(index / (columns * rows)) % 4
    wave.set([waveX, .42 * Math.sin(waveX * 3.4 + waveZ * 1.6) + waveZ * .35 + band * .075, waveZ], offset)

    const y = 1 - ((index + .5) / count) * 2
    const radius = Math.sqrt(1 - y * y)
    const x = Math.cos(index * golden) * radius
    const z = Math.sin(index * golden) * radius
    const edge = 1.79 / (Math.abs(x) + Math.abs(y) + Math.abs(z))
    const shell = index % 4 ? edge : edge * .62
    prism.set([x * shell, y * shell, z * shell], offset)
    seed[index] = random
  }
  return { ribbon, wave, prism, seed }
}
