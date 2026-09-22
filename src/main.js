import './styles.css'
import { gsap } from 'gsap'

const root = document.documentElement
const hero = document.querySelector('.hero')
const canvas = document.querySelector('[data-webgl]')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function initEntrance() {
  const media = gsap.matchMedia()

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
    })

    gsap.set('[data-primary-cta]', { opacity: 1, x: 0, y: 0 })

    timeline
      .from('[data-reveal="brand"]', {
        opacity: 0,
        y: -18,
        duration: 0.65,
        ease: 'power3.out',
      })
      .from(
        '.plan-line--v1, .plan-line--v2',
        {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.inOut',
        },
        0.08,
      )
      .from(
        '.plan-line--h1, .plan-line--h2',
        {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1,
          stagger: 0.1,
          ease: 'expo.inOut',
        },
        0.18,
      )
      .from(
        '[data-project-frame]',
        {
          clipPath: 'polygon(0 0, 8% 0, 8% 100%, 0 100%)',
          duration: 1.25,
          ease: 'expo.inOut',
        },
        0.2,
      )
      .from(
        '[data-project-frame] img',
        {
          scale: 1.08,
          duration: 1.6,
          ease: 'power3.out',
          clearProps: 'transform',
        },
        0.32,
      )
      .from(
        '[data-reveal="eyebrow"]',
        {
          opacity: 0,
          x: -24,
          duration: 0.55,
          ease: 'power3.out',
        },
        0.42,
      )
      .from(
        '[data-title-line]',
        {
          xPercent: -105,
          duration: 0.95,
          stagger: 0.11,
          ease: 'expo.out',
        },
        0.48,
      )
      .from(
        '[data-reveal="support"], [data-reveal="caption"], [data-reveal="facts"]',
        {
          opacity: 0,
          y: 18,
          duration: 0.72,
          stagger: 0.09,
          ease: 'power3.out',
        },
        0.8,
      )
      .from(
        '[data-reveal="nav"], [data-reveal="base"]',
        {
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        },
        0.9,
      )

    return () => timeline.kill()
  })

  media.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('[data-reveal], [data-title-line], [data-project-frame]', { clearProps: 'all' })
  })

  return () => media.revert()
}

function initControlMotion() {
  if (reduceMotion.matches) return () => {}

  const controls = document.querySelectorAll('.primary-cta, .header-cta')
  const cleanups = []

  controls.forEach((control) => {
    const arrow = control.querySelector('svg')
    if (!arrow) return

    const enter = () => gsap.to(arrow, { x: 4, duration: 0.25, ease: 'power2.out' })
    const leave = () => gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.out' })

    control.addEventListener('pointerenter', enter)
    control.addEventListener('pointerleave', leave)
    control.addEventListener('focus', enter)
    control.addEventListener('blur', leave)

    cleanups.push(() => {
      control.removeEventListener('pointerenter', enter)
      control.removeEventListener('pointerleave', leave)
      control.removeEventListener('focus', enter)
      control.removeEventListener('blur', leave)
    })
  })

  return () => cleanups.forEach((cleanup) => cleanup())
}

async function initMaterialGrid() {
  if (!canvas || !hero || reduceMotion.matches) {
    root.classList.add('webgl-fallback')
    return () => {}
  }

  const {
    Clock,
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Vector2,
    WebGLRenderer,
  } = await import('three')

  let renderer
  let animationFrame = 0
  let running = true
  let disposed = false
  const pointer = new Vector2(0, 0)
  const pointerTarget = new Vector2(0, 0)
  const clock = new Clock()

  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
  } catch {
    root.classList.add('webgl-fallback')
    return () => {}
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const geometry = new PlaneGeometry(2, 2)
  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: pointer },
    uResolution: { value: new Vector2(1, 1) },
  }

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform vec2 uResolution;

      float ruledLine(float value, float width) {
        float distanceToLine = abs(fract(value) - 0.5);
        return 1.0 - smoothstep(width, width + 0.012, distanceToLine);
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
        vec2 cursor = vec2(0.5) + uPointer * 0.18;
        float light = smoothstep(0.68, 0.0, length((uv - cursor) * aspect));
        float vertical = ruledLine(uv.x * 8.0 + uPointer.x * 0.06, 0.012);
        float horizontal = ruledLine(uv.y * 5.0 - uPointer.y * 0.04, 0.008);
        float grainWave = sin(uv.y * 94.0 + sin(uv.x * 18.0 + uTime * 0.08) * 2.0);
        float grain = smoothstep(0.93, 1.0, grainWave) * 0.12;
        float alpha = (vertical * 0.08 + horizontal * 0.055 + grain * 0.025) * (0.34 + light);
        vec3 gold = vec3(0.86, 0.60, 0.27);
        gl_FragColor = vec4(gold, alpha);
      }
    `,
  })

  const mesh = new Mesh(geometry, material)
  scene.add(mesh)

  function resize() {
    const width = Math.max(hero.clientWidth, 1)
    const height = Math.max(hero.clientHeight, 1)
    renderer.setSize(width, height, false)
    uniforms.uResolution.value.set(width, height)
  }

  function render() {
    if (!running || disposed) return
    pointer.lerp(pointerTarget, 0.045)
    uniforms.uTime.value = clock.getElapsedTime()
    renderer.render(scene, camera)
    animationFrame = window.requestAnimationFrame(render)
  }

  function setRunning(next) {
    if (disposed || running === next) return
    running = next
    if (running) {
      clock.start()
      render()
    } else {
      window.cancelAnimationFrame(animationFrame)
      clock.stop()
    }
  }

  const onPointerMove = (event) => {
    const bounds = hero.getBoundingClientRect()
    pointerTarget.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
    )
  }

  const onPointerLeave = () => pointerTarget.set(0, 0)
  const onVisibility = () => setRunning(!document.hidden)
  const onContextLost = (event) => {
    event.preventDefault()
    root.classList.add('webgl-fallback')
    setRunning(false)
  }
  const onContextRestored = () => root.classList.add('webgl-fallback')

  const observer = new IntersectionObserver(
    ([entry]) => setRunning(entry.isIntersecting && !document.hidden),
    { threshold: 0.02 },
  )
  const resizeObserver = new ResizeObserver(resize)

  hero.addEventListener('pointermove', onPointerMove, { passive: true })
  hero.addEventListener('pointerleave', onPointerLeave, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)
  observer.observe(hero)
  resizeObserver.observe(hero)
  resize()
  render()

  return () => {
    disposed = true
    window.cancelAnimationFrame(animationFrame)
    observer.disconnect()
    resizeObserver.disconnect()
    hero.removeEventListener('pointermove', onPointerMove)
    hero.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    canvas.removeEventListener('webglcontextrestored', onContextRestored)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
}

const cleanupEntrance = initEntrance()
const cleanupControls = initControlMotion()
let cleanupGrid = () => {}
let pageDidHide = false

initMaterialGrid()
  .then((cleanup) => {
    if (pageDidHide) cleanup()
    else cleanupGrid = cleanup
  })
  .catch(() => root.classList.add('webgl-fallback'))

window.addEventListener(
  'pagehide',
  () => {
    pageDidHide = true
    cleanupEntrance()
    cleanupControls()
    cleanupGrid()
  },
  { once: true },
)
