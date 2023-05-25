uniform float hue;

varying float vUvY;

void main() {

  // vec4 color = vec4(0.8 + vUvY * 0.2 + hue, 0.0, 1.0 - vUvY * 0.2 - hue, 0.1);

  vec4 color = vec4(hue * -24.0 + 1.0 - vUvY / 2.0, 0., 0.6 + vUvY, 0.08);

  // float r = 0.5 + cos(3.0 + vUvY * 16.14) / 2.0;
  // float b = 0.5 + sin(3.0 + vUvY * 16.14) / 2.0;

  // vec4 color = vec4(r, r, b/2., 0.2);

  gl_FragColor = color;
  // vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
  // float fresnelTerm = dot(viewDirectionW, vNormalW);
	// fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);
  // gl_FragColor = vec4(color * pow(1.0 - fresnelTerm, 2.0));
}
