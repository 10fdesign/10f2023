uniform float hue;
uniform float faded;
uniform float time;
uniform float startTime;

varying float vUvY;
// varying vec3 vPositionW;
// varying vec3 vNormalW;

void main() {

  // vec4 color = vec4(hue * -24.0 + 1.0 - vUvY / 2.0, 0., 0.6 + vUvY, 0.08);

  float alpha = 0.25 * min(1.0, (time - startTime) / 0.3);
  alpha -= 0.125 * faded; // fade (with scroll)
  alpha = max(0.0, alpha);

  vec4 color = vec4(1.0, vUvY, 1.0 - vUvY, alpha );

  // vec4 color = vec4(1., 0.4, 0., 1.);

  // float r = 0.5 + cos(3.0 + vUvY * 16.14) / 2.0;
  // float b = 0.5 + sin(3.0 + vUvY * 16.14) / 2.0;

  // vec4 color = vec4(r, r, b/2., 0.2);

  gl_FragColor = color;
  // vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
  // float fresnelTerm = dot(viewDirectionW, vNormalW);
	// fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);
  // gl_FragColor = vec4(color.rgb * fresnelTerm, 1.);
  // gl_FragColor = vec4(vec3(1.0 - fresnelTerm), 1.0);
}
