import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, MathUtils, Vector2 } from 'three'
import { makeParticles } from './particleGeometry'

const vertex = /* glsl */ `
  attribute vec3 aWave;
  attribute vec3 aPrism;
  attribute float aSeed;
  uniform float uTime;
  uniform float uMorph;
  uniform float uScroll;
  uniform float uVelocity;
  uniform float uDpr;
  uniform vec2 uPointer;
  uniform float uInfluence;
  varying float vLight;
  varying float vSeed;
  varying float vDepth;

  // Each component varies across the other axes, producing a divergence-free flow.
  vec3 flow(vec3 p, float time) {
    return vec3(
      sin(p.y * 2.3 + time * .91) * cos(p.z * 1.9 - time * .52),
      sin(p.z * 2.6 - time * .72) * cos(p.x * 2.1 + time * .38),
      sin(p.x * 2.2 + time * .66) * cos(p.y * 2.4 - time * .27)
    );
  }
  mat2 spin(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  void main() {
    vec3 p = mix(position, aWave, smoothstep(0.0, 1.0, uMorph));
    p = mix(p, aPrism, smoothstep(1.0, 2.0, uMorph));
    vec3 stream = flow(p, uTime);
    float n = .5 + .5 * stream.y;
    p += stream * (.19 + uVelocity * .24);
    p.y += sin(p.x * 2.4 + uTime * 1.4) * .11 * (1.0 - min(abs(uMorph - 1.0), 1.0));
    p.xz = spin(sin(uTime * .22) * .32 + uScroll * .86) * p.xz;
    p.xy = spin(.33 + sin(uTime * .38) * .12 + uScroll * .32) * p.xy;
    p.yz = spin(.24) * p.yz;
    vec2 delta = p.xy - uPointer;
    float force = exp(-dot(delta, delta) * 2.3) * uInfluence;
    p.xy += delta * force * (.57 + .29 * sin(uTime * 1.9 - length(delta) * 5.0));
    p.xy -= (p.xy - uPointer) * exp(-dot(delta,delta) * .72) * uInfluence * .11;
    p.z += force * .46;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vSeed = aSeed;
    vDepth = smoothstep(-1.55, 1.45, p.z);
    float bands = pow(.5 + .5 * sin(position.y * 28.0 + position.x * 7.0 + n * 2.0), 4.0);
    vLight = .25 + .62 * bands + .24 * n + .19 * vDepth;
    gl_PointSize = clamp((1.75 + aSeed * aSeed * 4.9 + bands * 1.45 + force * 1.5) * uDpr * (4.0 / -mv.z), 1.0, 10.0);
  }
`

const fragment = /* glsl */ `
  varying float vLight;
  varying float vSeed;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - .5;
    float r = length(uv);
    float glow = exp(-r * 6.0) * (1.0 - smoothstep(.24, .5, r));
    float core = 1.0 - smoothstep(.09, .30, r);
    vec3 violet = vec3(.42, .21, .95);
    vec3 lilac = vec3(.83, .73, 1.0);
    vec3 color = mix(violet, lilac, min(1.0, .18 + vLight * .75 + vSeed * .12));
    color = mix(color, vec3(.97,.91,1.0), core * pow(vSeed, 7.0) * .63);
    float alpha = (glow * .76 + core * .79) * vLight * (.48 + vDepth * .50);
    gl_FragColor = vec4(color, alpha);
  }
`

function Points({ signals, count }) {
  const material = useRef(null)
  const elapsed = useRef(0)
  const sample = useRef({ duration: 0, frames: 0 })
  const { setDpr, gl, camera } = useThree()
  const { ribbon, wave, prism, seed } = useMemo(() => makeParticles(count), [count])
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uScroll: { value: 0 },
    uVelocity: { value: 0 },
    uDpr: { value: 1 },
    uPointer: { value: new Vector2() },
    uInfluence: { value: 0 },
  }), [])

  useFrame((_, delta) => {
    const step = Math.min(delta, .05)
    const input = signals.current
    const values = material.current.uniforms
    elapsed.current += step * (input.speed ?? 1)
    values.uTime.value = elapsed.current
    values.uMorph.value = MathUtils.damp(values.uMorph.value, input.form ?? input.scroll * 2, 4, step)
    values.uScroll.value = MathUtils.damp(values.uScroll.value, input.scroll, 5, step)
    values.uVelocity.value = MathUtils.damp(values.uVelocity.value, input.velocity * Math.exp(-(performance.now() - input.updated) / 280), 5, step)
    values.uPointer.value.x = MathUtils.damp(values.uPointer.value.x, input.x * 2.1, 6, step)
    values.uPointer.value.y = MathUtils.damp(values.uPointer.value.y, input.y * 1.9, 6, step)
    values.uInfluence.value = MathUtils.damp(values.uInfluence.value, input.inside ? (input.strength ?? 1) : 0, 5, step)
    values.uDpr.value = gl.getPixelRatio()
    camera.position.x = MathUtils.damp(camera.position.x, (input.inside ? input.x * .27 : 0), 3, step)
    camera.position.y = MathUtils.damp(camera.position.y, input.scroll * .28 + (input.inside ? input.y * .18 : 0), 3, step)
    camera.lookAt(0, 0, 0)

    if (gl.getPixelRatio() > 1) {
      sample.current.duration += delta
      sample.current.frames += 1
      if (sample.current.frames >= 90) {
        if (sample.current.duration / sample.current.frames > .024) setDpr(1)
        sample.current = { duration: 0, frames: 0 }
      }
    }
  })

  return <points frustumCulled={false}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[ribbon, 3]} />
      <bufferAttribute attach="attributes-aWave" args={[wave, 3]} />
      <bufferAttribute attach="attributes-aPrism" args={[prism, 3]} />
      <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
    </bufferGeometry>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment}
      transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
  </points>
}

function RenderStatus({ onReady }) {
  const { gl } = useThree()
  useEffect(() => {
    const lost = () => onReady(false)
    const restored = () => onReady(true)
    gl.domElement.addEventListener('webglcontextlost', lost)
    gl.domElement.addEventListener('webglcontextrestored', restored)
    const frame = requestAnimationFrame(restored)
    return () => {
      cancelAnimationFrame(frame)
      gl.domElement.removeEventListener('webglcontextlost', lost)
      gl.domElement.removeEventListener('webglcontextrestored', restored)
    }
  }, [gl, onReady])
  return null
}

export default function ParticleScene({ signals, onReady, count: density, variant, compact }) {
  const count = density ?? (compact ? 2800 : variant === 'contact' ? 4600 : (navigator.hardwareConcurrency ?? 8) > 6 ? 11000 : 5900)
  return <Canvas dpr={compact ? 1 : [1, 1.55]} camera={{ position: [0, 0, 4.85], fov: 43 }}
    gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
    <Points key={count} signals={signals} count={count} />
    <RenderStatus onReady={onReady} />
  </Canvas>
}
