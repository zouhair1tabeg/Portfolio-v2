export const revealVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Full-screen quad: the plane already spans clip space.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;
