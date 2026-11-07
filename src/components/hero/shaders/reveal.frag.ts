export const revealFragmentShader = /* glsl */ `
  uniform sampler2D uTexB;
  uniform sampler2D uNameFill;
  uniform sampler2D uNameOutline;

  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform vec2 uTrail[5];
  uniform vec2 uResolution;

  // x, y, width, height in hero UV space (origin bottom-left).
  uniform vec4 uNameRect;
  uniform vec4 uPortraitRect;
  uniform float uNameOpacity;

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

  float rectMask(vec2 local) {
    return step(0.0, local.x) *
      step(local.x, 1.0) *
      step(0.0, local.y) *
      step(local.y, 1.0);
  }

  // Distance field in portrait-height units. "wobble" is the single FBM value
  // shared by every blob for this pixel, so the contour noise costs one lookup.
  float blob(
    vec2 uv,
    vec2 center,
    float radius,
    vec2 velocity,
    float wobble
  ) {
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - center) * vec2(aspect, 1.0);

    float speed = length(velocity);
    vec2 direction = speed > 0.0001 ? velocity / speed : vec2(1.0, 0.0);

    vec2 local = vec2(
      dot(p, direction),
      dot(p, vec2(-direction.y, direction.x))
    );
    float stretch = clamp(speed * 0.08, 0.0, 1.0) * uStretch;
    local.x /= 1.0 + stretch;
    local.y *= 1.0 + stretch * 0.12;

    float distanceToCenter =
      length(local) + wobble * uNoiseAmount * radius * 2.0;
    float soft = max(radius * uEdgeSoftness, 0.0015);

    return 1.0 - smoothstep(radius - soft, radius + soft, distanceToCenter);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    vec2 nameUv =
      (uv - uNameRect.xy) / max(uNameRect.zw, vec2(0.0001));
    float nameInside = rectMask(nameUv);

    vec2 portraitUv =
      (uv - uPortraitRect.xy) / max(uPortraitRect.zw, vec2(0.0001));
    float portraitInside = rectMask(portraitUv);

    // Outside the name and with no blob running, this pixel can only be empty.
    if (nameInside < 0.5 && uReveal < 0.001) discard;

    vec4 portrait = portraitInside > 0.5
      ? texture2D(uTexB, portraitUv)
      : vec4(0.0);
    float portraitAlpha = portrait.a * portraitInside;

    float blobMask = 0.0;
    if (uReveal > 0.001) {
      vec2 noisePos =
        vec2(uv.x * aspect, uv.y) * uNoiseScale +
        vec2(13.7, uTime * 0.12);
      float wobble = fbm(noisePos) - 0.5;

      blobMask = blob(uv, uMouse, uRadius, uVelocity, wobble);

      for (int i = 0; i < 5; i++) {
        float weight = 1.0 - float(i) * 0.15;
        float trailBlob = blob(
          uv,
          uTrail[i],
          uRadius * weight,
          uVelocity,
          wobble
        );
        blobMask = max(blobMask, trailBlob * weight);
      }

      blobMask = clamp(blobMask, 0.0, 1.0) * uReveal;
    }

    float hover = smoothstep(0.08, 0.92, blobMask);

    vec4 name = vec4(0.0);
    if (nameInside > 0.5) {
      vec4 fill = texture2D(uNameFill, nameUv);
      vec4 outline = texture2D(uNameOutline, nameUv);

      // Mix in premultiplied space so the fill disappears cleanly at the
      // stroke edge instead of dimming to a muddy half-colour.
      name = mix(
        vec4(fill.rgb * fill.a, fill.a),
        vec4(outline.rgb * outline.a, outline.a),
        hover
      );
    }

    // The portrait stays in front of the name: where its alpha is solid the
    // name is hidden, everywhere else it paints on the page background.
    float nameCoverage =
      name.a * nameInside * uNameOpacity * (1.0 - portraitAlpha);
    vec3 nameColor = name.a > 0.0001 ? name.rgb / name.a : vec3(0.0);
    vec4 namePremul = vec4(nameColor * nameCoverage, nameCoverage);

    float revealAlpha = portraitAlpha * blobMask;
    vec4 outPremul =
      vec4(portrait.rgb * revealAlpha, revealAlpha) +
      namePremul * (1.0 - revealAlpha);

    if (outPremul.a < 0.002) discard;

    gl_FragColor = vec4(outPremul.rgb / outPremul.a, outPremul.a);

    #include <colorspace_fragment>
  }
`;
