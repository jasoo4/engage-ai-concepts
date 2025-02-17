
import { useEffect, useRef } from "react";

export function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 },
  TRANSPARENT = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;

    try {
      gl = canvas.getContext("webgl2");
    } catch (e) {
      console.log("webgl2 not supported");
    }

    if (!gl) {
      console.log("webgl not supported");
      return;
    }

    let ext = gl.getExtension("EXT_color_buffer_float");
    if (!ext) {
      alert("Your device does not support rendering to floating point textures.");
      return;
    }

    const supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    if (!supportLinearFiltering) {
      alert("Your device does not support linear filtering with floating point textures.");
      return;
    }

    gl.clearColor(BACK_COLOR.r, BACK_COLOR.g, BACK_COLOR.b, 1.0);

    let textureWidth = SIM_RESOLUTION;
    let textureHeight = SIM_RESOLUTION;
    let dyeWidth = DYE_RESOLUTION;
    let dyeHeight = DYE_RESOLUTION;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main () {
          vUv = aPosition * 0.5 + 0.5;
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);
    gl.compileShader(vertexShader);

    const baseFragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `;

    const clearShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main() {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `);

    const displayShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
          vec3 tex = texture2D(uTexture, vUv).rgb;
          gl_FragColor = vec4(tex, 1.0);
      }
    `);

    const captureShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
          vec3 tex = texture2D(uTexture, vUv).rgb;
          gl_FragColor = vec4(tex, 1.0);
      }
    `);

    const blurShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main() {
        vec4 color = vec4(0.0);
        color += texture2D(uTexture, vUv) * 0.404239;
        color += texture2D(uTexture, vUv + vec2(texelSize.x, 0.0)) * 0.227027;
        color += texture2D(uTexture, vUv - vec2(texelSize.x, 0.0)) * 0.227027;
        color += texture2D(uTexture, vUv + vec2(0.0, texelSize.y)) * 0.227027;
        color += texture2D(uTexture, vUv - vec2(0.0, texelSize.y)) * 0.227027;
        gl_FragColor = color;
      }
    `);

    const blurShader2 = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main() {
        vec4 color = vec4(0.0);
        color += texture2D(uTexture, vUv) * 0.227027;
        color += texture2D(uTexture, vUv + vec2(texelSize.x, 0.0)) * 0.316216;
        color += texture2D(uTexture, vUv - vec2(texelSize.x, 0.0)) * 0.316216;
        color += texture2D(uTexture, vUv + vec2(0.0, texelSize.y)) * 0.316216;
        color += texture2D(uTexture, vUv - vec2(0.0, texelSize.y)) * 0.316216;
        gl_FragColor = color;
      }
    `);

    const blurShader3 = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main() {
        vec4 color = vec4(0.0);
        color += texture2D(uTexture, vUv) * 0.06;
        color += texture2D(uTexture, vUv + vec2(texelSize.x * 1.0, 0.0)) * 0.09;
        color += texture2D(uTexture, vUv - vec2(texelSize.x * 1.0, 0.0)) * 0.09;
        color += texture2D(uTexture, vUv + vec2(0.0, texelSize.y * 1.0)) * 0.09;
        color += texture2D(uTexture, vUv - vec2(0.0, texelSize.y * 1.0)) * 0.09;
        color += texture2D(uTexture, vUv + vec2(texelSize.x * 2.0, 0.0)) * 0.1;
        color += texture2D(uTexture, vUv - vec2(texelSize.x * 2.0, 0.0)) * 0.1;
        color += texture2D(uTexture, vUv + vec2(0.0, texelSize.y * 2.0)) * 0.1;
        color += texture2D(uTexture, vUv - vec2(0.0, texelSize.y * 2.0)) * 0.1;
        gl_FragColor = color;
      }
    `);

    const copyShader = createShader(gl, baseFragmentShader);

    const divergenceShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform vec2 texelSize;
      void main () {
          float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
          float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          if (L == R) { L = -velocity.x; R = velocity.x; }
          if (T == B) { T = -velocity.y; B = velocity.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform vec2 texelSize;
      void main () {
          float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
          float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
          float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
          float curl = 0.5 * (T - B - R + L);
          gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform vec2 texelSize;
      void main () {
          float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
          vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));
          force *= curl;
          gl_FragColor = vec4(force, 0.0, 1.0);
      }
    `);

    const pressureShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uDivergence;
      uniform sampler2D uPressure;
      uniform vec2 texelSize;
      void main () {
          float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      uniform vec2 texelSize;
      void main () {
          float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const advectionShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dissipation;
      void main () {
          vec2 coord = vUv - texelSize * texture2D(uVelocity, vUv).xy * dissipation;
          gl_FragColor = texture2D(uSource, coord);
          gl_FragColor.rgb *= 0.99;
      }
    `);

    const splatShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float uRadius;
      uniform vec3 uColor;
      uniform vec2 uPoint;
      void main () {
          vec3 tex = texture2D(uTarget, vUv).rgb;
          float dist = distance(vUv, uPoint);
          float alpha = smoothstep(uRadius, 0.0, dist);
          gl_FragColor = vec4(tex + uColor * alpha, 1.0);
      }
    `);

    const shadingShader = createShader(gl, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uDye;
      uniform float colorUpdateSpeed;
      void main() {
        vec3 velocity = texture2D(uVelocity, vUv).xyz;
        float speed = length(velocity);
        vec3 baseColor = texture2D(uDye, vUv).rgb;
        vec3 colorShift = vec3(speed * colorUpdateSpeed);
        vec3 finalColor = baseColor + colorShift;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `);

    function createShader(gl, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      const shader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, fragmentShader);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.trace(gl.getShaderInfoLog(shader));
      }
      gl.attachShader(program, shader);
      gl.linkProgram(program);
      gl.deleteShader(shader);
      return program;
    }

    const texelSizeX = 1 / textureWidth;
    const texelSizeY = 1 / textureHeight;
    const texelSize = [texelSizeX, texelSizeY];

    const floatParams = {
      internalformat: gl.RGBA32F,
      format: gl.RGBA,
      type: gl.FLOAT,
    };

    const halfFloatParams = {
      internalformat: gl.RGBA16F,
      format: gl.RGBA,
      type: gl.HALF_FLOAT,
    };

    let density = createDoubleBuffer(gl, textureWidth, textureHeight, floatParams);
    let velocity = createDoubleBuffer(gl, textureWidth, textureHeight, floatParams);
    let pressure = createDoubleBuffer(gl, textureWidth, textureHeight, halfFloatParams);
    let divergenceTexture = createTexture(gl, textureWidth, textureHeight, halfFloatParams);
    let curlTexture = createTexture(gl, textureWidth, textureHeight, halfFloatParams);

    let dye = createDoubleBuffer(gl, dyeWidth, dyeHeight, floatParams);

    function createDoubleBuffer(gl, width, height, params) {
      let texture0 = createTexture(gl, width, height, params);
      let texture1 = createTexture(gl, width, height, params);
      return {
        get read() {
          return texture0;
        },
        set read(value) {
          texture0 = value;
        },
        get write() {
          return texture1;
        },
        set write(value) {
          texture1 = value;
        },
        swap() {
          let temp = texture0;
          texture0 = texture1;
          texture1 = temp;
        },
      };
    }

    function createTexture(gl, width, height, params) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        params.internalformat,
        width,
        height,
        0,
        params.format,
        params.type,
        null
      );
      return texture;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function updateFrame() {
      gl.viewport(0, 0, textureWidth, textureHeight);

      // Calculate Divergence
      gl.useProgram(divergenceShader);
      gl.uniform2fv(gl.getUniformLocation(divergenceShader, "texelSize"), texelSize);
      gl.uniform1i(gl.getUniformLocation(divergenceShader, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read);
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        divergenceTexture,
        0
      );
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

      // Calculate Curl
      gl.useProgram(curlShader);
      gl.uniform2fv(gl.getUniformLocation(curlShader, "texelSize"), texelSize);
      gl.uniform1i(gl.getUniformLocation(curlShader, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read);
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        curlTexture,
        0
      );
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

      // Calculate Vorticity Force
      gl.useProgram(vorticityShader);
      gl.uniform2fv(gl.getUniformLocation(vorticityShader, "texelSize"), texelSize);
      gl.uniform1i(gl.getUniformLocation(vorticityShader, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read);
      gl.uniform1i(gl.getUniformLocation(vorticityShader, "uCurl"), 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, curlTexture);
      gl.uniform1f(gl.getUniformLocation(vorticityShader, "curl"), CURL);
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        velocity.write,
        0
      );
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      velocity.swap();

      // Calculate Pressure
      gl.useProgram(pressureShader);
      gl.uniform2fv(gl.getUniformLocation(pressureShader, "texelSize"), texelSize);
      gl.uniform1i(gl.getUniformLocation(pressureShader, "uDivergence"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, divergenceTexture);
      gl.uniform1i(gl.getUniformLocation(pressureShader, "uPressure"), 1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());

      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          pressure.write,
          0
        );
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        pressure.swap();
      }

      // Correct Velocity
      gl.useProgram(gradientSubtractShader);
      gl.uniform2fv(gl.getUniformLocation(gradientSubtractShader, "texelSize"), texelSize);
      gl.uniform1i(gl.getUniformLocation(gradientSubtractShader, "uPressure"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read);
      gl.uniform1i(gl.getUniformLocation(gradientSubtractShader, "uVelocity"), 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read);
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        velocity.write,
        0
      );
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      velocity.swap();

      // Advection for velocity
      gl.useProgram(advectionShader);
      gl.uniform2fv(gl.getUniformLocation(advectionShader, "texelSize"), texelSize);
      gl.uniform2f(gl.getUniformLocation(advectionShader, "dissipation"), VELOCITY_DISSIPATION, VELOCITY_DISSIPATION);
      gl.uniform1i(gl.getUniformLocation(advectionShader, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read);
      gl.uniform1i(gl.getUniformLocation(advectionShader, "uSource"), 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read);
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        velocity.write,
        0
      );
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      velocity.swap();

      // Advection for density
      gl.useProgram(advectionShader);
      gl.uniform2fv(gl.getUniformLocation(advectionShader, "texelSize"), texelSize);
      gl.uniform2f(gl.getUniformLocation(advectionShader, "dissipation"), DENSITY_DISSIPATION, DENSITY_DISSIPATION);
      gl.uniform1i(gl.getUniformLocation(advectionShader, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read);
      gl.uniform1i(gl.getUniformLocation(advectionShader, "uSource"), 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, dye.read);
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        dye.write,
        0
      );
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      dye.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

      if (SHADING) {
        gl.useProgram(shadingShader);
        gl.uniform1i(gl.getUniformLocation(shadingShader, "uVelocity"), 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read);
        gl.uniform1i(gl.getUniformLocation(shadingShader, "uDye"), 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, dye.read);
        gl.uniform1f(gl.getUniformLocation(shadingShader, "colorUpdateSpeed"), COLOR_UPDATE_SPEED);
      } else {
        gl.useProgram(displayShader);
        gl.uniform1i(gl.getUniformLocation(displayShader, "uTexture"), 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, dye.read);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

      requestAnimationFrame(updateFrame);
    }

    let lastX = null;
    let lastY = null;

    function handleMouseMove(e) {
      if (lastX == null || lastY == null) {
        lastX = e.offsetX;
        lastY = e.offsetY;
        return;
      }

      let dx = e.offsetX - lastX;
      let dy = e.offsetY - lastY;

      lastX = e.offsetX;
      lastY = e.offsetY;

      splat(e.offsetX, gl.drawingBufferHeight - e.offsetY, dx, dy);
    }

    function handleTouchMove(e) {
      e.preventDefault();
      let touch = e.touches[0];
	  let rect = canvas.getBoundingClientRect();
      let x = touch.clientX - rect.left;
      let y = touch.clientY - rect.top;

      splat(x, gl.drawingBufferHeight - y, 0, 0);
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchstart", handleTouchMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    function splat(x, y, dx, dy) {
      gl.viewport(0, 0, textureWidth, textureHeight);
      gl.useProgram(splatShader);
      gl.uniform1i(gl.getUniformLocation(splatShader, "uTarget"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dye.read);
      gl.uniform1f(gl.getUniformLocation(splatShader, "uRadius"), SPLAT_RADIUS);
      gl.uniform3f(gl.getUniformLocation(splatShader, "uColor"), dx, -dy, 0.0);
      gl.uniform2f(
        gl.getUniformLocation(splatShader, "uPoint"),
        x / gl.drawingBufferWidth,
        y / gl.drawingBufferHeight
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        dye.write,
        0
      );
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      dye.swap();
    }

    updateFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
  ]);

  return (
    <div className="fixed top-0 left-0 z-50 pointer-events-none">
      <canvas ref={canvasRef} id="fluid" className="w-screen h-screen" />
    </div>
  );
}
