export const revealFragmentShader = /* glsl */ `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;

  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform vec2 uTrail[5];
  uniform vec2 uResolution;
  uniform vec2 uTexResolution;

  uniform float uRadius;
  uniform float uTime;
  uniform float uReveal;
  uniform float uStretch;
  uniform float uNoiseAmount;
  uniform float uNoiseScale;
  uniform float uEdgeSoftness;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 spin = mat2(0.8, 0.6, -0.6, 0.8);

    for (int i = 0; i < 4; i++) {
      value += amplitude * valueNoise(p);
      p = spin * p * 2.03 + 17.0;
      amplitude *= 0.5;
    }

    return value;
  }

  // object-fit: cover, centred, for a canvas of any aspect ratio.
  vec2 coverUv(vec2 uv) {
    float canvasAspect = uResolution.x / uResolution.y;
    float textureAspect = uTexResolution.x / uTexResolution.y;

    vec2 scale = canvasAspect > textureAspect
      ? vec2(1.0, textureAspect / canvasAspect)
      : vec2(canvasAspect / textureAspect, 1.0);

    return (uv - 0.5) * scale + 0.5;
  }

  float blob(vec2 uv, vec2 center, float radius, vec2 velocity, float seed) {
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - center) * vec2(aspect, 1.0);

    float speed = length(velocity);
    vec2 direction = speed > 0.0001 ? velocity / speed : vec2(1.0, 0.0);

    // Stretch the distance field along the movement direction.
    vec2 local = vec2(dot(p, direction), dot(p, vec2(-direction.y, direction.x)));
    float stretch = clamp(speed * 0.08, 0.0, 1.0) * uStretch;
    local.x /= 1.0 + stretch;
    local.y *= 1.0 + stretch * 0.12;

    float wobble = fbm(local * uNoiseScale + vec2(seed, uTime * 0.12)) - 0.5;
    float distanceToCenter = length(local) + wobble * uNoiseAmount * radius * 2.0;

    float soft = max(radius * uEdgeSoftness, 0.002);
    return 1.0 - smoothstep(radius - soft, radius + soft, distanceToCenter);
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec3 imageA = texture2D(uTexA, uv).rgb;
    vec3 imageB = texture2D(uTexB, uv).rgb;

    float mask = blob(vUv, uMouse, uRadius, uVelocity, 0.0);

    for (int i = 0; i < 5; i++) {
      float weight = 1.0 - float(i) * 0.15;
      float trailBlob = blob(
        vUv,
        uTrail[i],
        uRadius * weight,
        uVelocity,
        float(i) * 9.7 + 3.1
      );
      mask = max(mask, trailBlob * weight);
    }

    mask = clamp(mask, 0.0, 1.0) * uReveal;

    vec3 color = mix(imageA, imageB, mask);
    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
  }
`;
