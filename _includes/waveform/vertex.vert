#define PI 3.1415926538

uniform float time;
uniform float expansion;

varying float vUvY;
// varying vec3 vPositionW;
// varying vec3 vNormalW;

// eg:
// newPosition += arm(uv.y * PI * 2.0 - time / 15.0, 1.7);
vec3 arm(float rot, float len) {
  return vec3(cos(rot) * len, 0.0, sin(rot) * len);
}

void main() {
  vec3 newPosition = vec3(0.0);

  //[ArmCalc]

  newPosition += position;
  newPosition += normal * expansion;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  vUvY = uv.x;
  // vPositionW = vec3( vec4( newPosition, 1.0 ) * modelMatrix);
  // vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
}
