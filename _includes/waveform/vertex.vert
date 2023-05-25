#define PI 3.1415926538

uniform float time;
uniform float expansion;

varying float vUvY;

vec3 arm(float rot, float len) {
  return vec3(cos(rot) * len, 0.0, sin(rot) * len);
}

void main() {
  vec3 newPosition = vec3(0.0);

  //[ArmCalc]


  // example of arm() usage:
  // newPosition += arm(uv.y * PI * 2.0 - time / 15.0, 1.7);
  // newPosition *= 0.5;
  newPosition += position;
  newPosition += normal * expansion;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  vUvY = uv.y;
}
