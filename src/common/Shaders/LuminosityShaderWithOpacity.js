/**
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

var LuminosityShaderWithOpacity = {

	uniforms: {

        'tDiffuse': { value: null },
        "opacity":  { type: "f", value: 1.0 }


	},

	vertexShader: [

		'varying vec2 vUv;',

		'void main() {',

		'	vUv = uv;',

		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'

	].join( '\n' ),

	fragmentShader: [

		'#include <common>',

		'uniform sampler2D tDiffuse;',

        'uniform float opacity;',

		'varying vec2 vUv;',

		'void main() {',

		'	vec4 texel = texture2D( tDiffuse, vUv );',

		'	float l = linearToRelativeLuminance( texel.rgb );',

        '   vec3 finalColor = vec3(',
                '(opacity * l) + ((1.0 - opacity) * texel.x),',
                '(opacity * l) + ((1.0 - opacity) * texel.y),',
                '(opacity * l) + ((1.0 - opacity) * texel.z)',
        '   );',

        '   gl_FragColor = vec4( finalColor, texel.w );',

		'}'

	].join( '\n' )

};

export { LuminosityShaderWithOpacity };