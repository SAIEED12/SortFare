// Fragment shader: Aurora + noise flow field with mouse influence and grain
// Uniforms provided by React Three Fiber:
//   u_time      (float)  — seconds since mount
//   u_resolution (vec2)   — canvas width/height in pixels
//   u_mouse     (vec2)   — cursor position, normalized 0–1

export const fragmentShader = /* glsl */ `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 vUv;

// --- 1. Noise foundation ---
// Simple hash: deterministically maps a vec2 to a pseudo-random float
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Value noise: smooth random field from interpolated hash values
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Smooth Hermite interpolation between grid points
  vec2 u = f * f * (3.0 - 2.0 * f);

  // Bilinear interpolation of 4 corner hashes
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractal Brownian Motion: layered noise at increasing frequencies
// Each octave adds detail; amplitude halves each layer
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// --- 2. Aurora effect ---
// Builds layered, flowing ribbons of color using distorted sine waves.
// The distortion comes from fbm, giving organic movement.
vec3 aurora(vec2 uv, float time) {
  // Create flow distortion from noise — this warps the UV space
  vec2 q = vec2(
    fbm(uv * 2.0 + time * 0.1),
    fbm(uv * 2.0 + vec2(5.2, 1.3) + time * 0.12)
  );

  // Second layer of distortion for more complexity
  vec2 r = vec2(
    fbm(uv * 3.0 + q * 2.0 + time * 0.08 + vec2(1.7, 9.2)),
    fbm(uv * 3.0 + q * 2.0 + time * 0.1 + vec2(8.3, 2.8))
  );

  // Final noise value drives the aurora intensity
  float f = fbm(uv * 2.0 + r * 1.5 + time * 0.05);

  // Color palette: deep blue base → primary blue → teal highlight
  // These match the site's --color-primary tokens
  vec3 deepBlue  = vec3(0.118, 0.227, 0.541); // #1e3a8a
  vec3 blue      = vec3(0.145, 0.388, 0.922); // #2563eb
  vec3 teal      = vec3(0.188, 0.690, 0.776); // #30b0c6
  vec3 dark      = vec3(0.067, 0.067, 0.090); // near-black

  // Mix colors based on noise value f
  vec3 col = dark;
  col = mix(col, deepBlue, smoothstep(0.1, 0.5, f));
  col = mix(col, blue,     smoothstep(0.3, 0.8, f));
  col = mix(col, teal,     smoothstep(0.6, 1.0, f));

  return col;
}

// --- 3. Mouse influence ---
// The mouse position gently pulls the aurora flow field.
// Effect falls off with distance so it feels organic, not mechanical.
vec2 mouseWarp(vec2 uv, vec2 mouse) {
  // Distance from current pixel to mouse
  float d = distance(uv, mouse);
  // Smooth falloff: strong near cursor, fades out
  float influence = smoothstep(0.5, 0.0, d);
  // Apply a subtle offset — not a full displacement
  return uv + (mouse - 0.5) * influence * 0.15;
}

// --- 4. Grain overlay ---
// Film grain adds texture and hides color banding on 8-bit displays.
// Blended at low opacity so it's felt, not seen.
float grain(vec2 uv, float time) {
  // Pseudo-random per-pixel, changes every frame for a "live" feel
  return fract(sin(dot(uv * u_resolution, vec2(12.9898, 78.233)) + time) * 43758.5453);
}

// --- Main ---
void main() {
  vec2 uv = vUv;

  // Aspect-corrected UV for noise that doesn't stretch
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

  // Warp UV with mouse influence before feeding to aurora
  vec2 warpedUv = mouseWarp(uv, u_mouse);

  // Compute aurora color
  vec3 color = aurora(warpedUv * aspect, u_time);

  // Layer grain on top at ~4% opacity
  float g = grain(warpedUv, u_time);
  color += (g - 0.5) * 0.04;

  // Subtle vignette: darkens edges, draws eye to center
  float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.8);
  color *= mix(0.6, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`;

export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
