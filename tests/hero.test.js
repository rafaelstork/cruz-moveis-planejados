import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { test } from 'node:test'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const javascript = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)

test('usa apenas destinos reais e o WhatsApp oficial', () => {
  assert.match(html, /https:\/\/wa\.me\/5519982745455/)
  assert.match(html, /https:\/\/www\.instagram\.com\/cruzmoveis\//)
  assert.match(html, /https:\/\/www\.instagram\.com\/rafaelstork\.dzn\//)
  assert.doesNotMatch(html, /href=["']#["']/)
})

test('mantém a hero limitada aos elementos do MVP', () => {
  assert.equal((html.match(/<main\b/g) || []).length, 1)
  assert.equal((html.match(/<section\b/g) || []).length, 1)
  assert.match(html, /class="site-header"/)
  assert.match(html, /class="hero__composition"/)
  assert.match(html, /class="hero__base"/)
})

test('preserva os ativos oficiais e o crédito obrigatório', () => {
  for (const relativePath of [
    '../public/assets/cozinha-beige-matt.jpg',
    '../public/assets/cruz-logo.jpg',
    '../public/assets/rafael-stork.svg',
  ]) {
    const asset = new URL(relativePath, import.meta.url)
    assert.ok(existsSync(asset), `${relativePath} precisa existir`)
    assert.ok(statSync(asset).size > 1000, `${relativePath} não pode estar vazio`)
  }

  assert.match(html, /Feito por Rafael Stork Design/)
})

test('mantém acessibilidade e responsividade básicas', () => {
  assert.match(html, /lang="pt-BR"/)
  assert.match(html, /aria-labelledby="hero-title"/)
  assert.match(html, /alt="Cozinha sob medida da Cruz Móveis/)
  assert.match(css, /min-width:\s*44px/)
  assert.match(css, /min-height:\s*44px/)
  assert.match(css, /@media \(max-width: 760px\)/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
})

test('inclui GSAP, Three.js e os fallbacks técnicos esperados', () => {
  assert.ok(packageJson.dependencies.gsap)
  assert.ok(packageJson.dependencies.three)
  assert.doesNotMatch(JSON.stringify(packageJson), /scrolltrigger|lenis|swup/i)
  assert.match(javascript, /gsap\.timeline/)
  assert.match(javascript, /import\('three'\)/)
  assert.match(javascript, /webglcontextlost/)
  assert.match(javascript, /IntersectionObserver/)
  assert.match(javascript, /visibilitychange/)
  assert.match(javascript, /\.dispose\(\)/)
})
