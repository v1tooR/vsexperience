/* VS Gradient: o shader do gerador de fundos VS (vs-grad), versão ao vivo para páginas.
   Mesmo campo, listras, rampa OKLab e loop circular; sem exportação. Granulação fica no CSS. */
(function () {
  'use strict';

  var BRAND = { cadmio: '#ee2324', carmim: '#aa1f23', grafite: '#212121', linho: '#efefef' };

  var PRESETS = {
    rasgo: {
      seed: 3031, blobCount: 4, blobSize: 0.3, posX: 0.42, posY: 0.02, spread: 0.6, softness: 0.45,
      noiseAmt: 0.2, noiseScale: 2.2, gradAmt: 0, gradPos: 0, gradWidth: 0.6,
      contrast: 1.2, gamma: 1.0, exposure: -0.2,
      angle: 180, density: 160, trail: 0.45, elong: 1.3, jag: 0.75, thick: 0.5, darkLines: 0.3,
      horizOn: false, horizPos: 0, horizAmp: 0, horizFreq: 1, horizSoft: 0.02,
      stops: [[0, BRAND.grafite], [0.42, BRAND.carmim], [0.85, BRAND.cadmio], [1, BRAND.linho]],
      depthOn: true, depthAmt: 0.8, vigAmt: 0.2, vigRadius: 0.7
    },
    cortina: {
      seed: 812, blobCount: 0, blobSize: 0.4, posX: 0, posY: 0.3, spread: 0.6, softness: 0.6,
      noiseAmt: 0.1, noiseScale: 1.5, gradAmt: 1.15, gradPos: -0.22, gradWidth: 0.5,
      contrast: 1.0, gamma: 1.0, exposure: 0,
      angle: 270, density: 24, trail: 0.22, elong: 2, jag: 0.4, thick: 0.7, darkLines: 0.2,
      horizOn: true, horizPos: 0.05, horizAmp: 0.2, horizFreq: 1.8, horizSoft: 0.02,
      stops: [[0, BRAND.grafite], [0.38, BRAND.carmim], [0.62, BRAND.cadmio], [1, BRAND.linho]],
      depthOn: true, depthAmt: 0.45, vigAmt: 0, vigRadius: 0.7
    },
    nucleo: {
      seed: 1200, blobCount: 3, blobSize: 0.34, posX: 0.32, posY: -0.02, spread: 0.5, softness: 0.7,
      noiseAmt: 0.3, noiseScale: 1.8, gradAmt: 0, gradPos: 0, gradWidth: 0.6,
      contrast: 1.1, gamma: 0.9, exposure: 0,
      angle: 0, density: 200, trail: 0.4, elong: 0.85, jag: 0.5, thick: 0.5, darkLines: 0.35,
      horizOn: false, horizPos: 0, horizAmp: 0, horizFreq: 1, horizSoft: 0.02,
      stops: [[0, BRAND.grafite], [0.3, BRAND.carmim], [0.62, BRAND.cadmio], [1, BRAND.linho]],
      depthOn: true, depthAmt: 0.5, vigAmt: 0.3, vigRadius: 0.6
    }
  };

  // ---------- aleatoriedade com seed (idêntica ao gerador) ----------
  function rng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function subSeed(seed, salt) {
    var h = (seed >>> 0) ^ Math.imul(salt + 0x9E3779B9, 0x85EBCA6B);
    h = Math.imul(h ^ (h >>> 16), 0x7FEB352D);
    h = Math.imul(h ^ (h >>> 15), 0x846CA68B);
    return (h ^ (h >>> 16)) >>> 0;
  }
  function blobLayout(seed) {
    var r = rng(subSeed(seed, 1)), out = [];
    for (var i = 0; i < 8; i++) {
      var ang = r() * Math.PI * 2, rad = Math.sqrt(r());
      out.push({
        ox: i === 0 ? 0 : Math.cos(ang) * rad,
        oy: i === 0 ? 0 : Math.sin(ang) * rad,
        rs: i === 0 ? 1 : 0.5 + r() * 0.7,
        w: i === 0 ? 1 : 0.35 + r() * 0.65,
        ph: r() * Math.PI * 2,
        ph2: r() * Math.PI * 2,
        dir: r() < 0.5 ? -1 : 1,
        amp: 0.5 + r()
      });
    }
    return out;
  }
  function hexToOklab(hex) {
    var h = hex.replace('#', '');
    function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    var r = lin(parseInt(h.slice(0, 2), 16)), g = lin(parseInt(h.slice(2, 4), 16)), b = lin(parseInt(h.slice(4, 6), 16));
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    ];
  }

  // ---------- shaders ----------
  var VERT = '#version 300 es\nin vec2 a_pos;\nvoid main(){gl_Position=vec4(a_pos,0.0,1.0);}';

  var FRAG = [
    '#version 300 es',
    'precision highp float; precision highp int;',
    'uniform vec2 u_res; uniform uint u_seed; uniform vec2 u_circ;',
    'uniform int u_blobCount; uniform vec4 u_blobs[8]; uniform float u_softExp;',
    'uniform float u_noiseAmt, u_noiseScale, u_gradAmt, u_gradPos, u_gradWidth;',
    'uniform vec2 u_dir; uniform float u_density, u_trail, u_elong, u_jag, u_thick, u_darkLines;',
    'uniform float u_horizOn, u_horizPos, u_horizAmp, u_horizFreq, u_horizSoft;',
    'uniform float u_exposure, u_contrast, u_gamma;',
    'uniform int u_stopCount; uniform float u_stopPos[8]; uniform vec3 u_stopLab[8]; uniform float u_depth;',
    'uniform float u_vigAmt, u_vigRadius;',
    'out vec4 outColor;',
    'uint hash(uint x){x^=x>>16;x*=0x7feb352dU;x^=x>>15;x*=0x846ca68bU;x^=x>>16;return x;}',
    'float h2f(ivec2 p,uint s){uint h=hash(uint(p.x)*0x9E3779B1U^hash(uint(p.y)^(s*0x85EBCA77U)));return float(h>>8)*(1.0/16777216.0);}',
    'float vnoise(vec2 x,uint s){vec2 i=floor(x);vec2 f=x-i;vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);ivec2 ii=ivec2(i);',
    ' float a=h2f(ii,s),b=h2f(ii+ivec2(1,0),s),c=h2f(ii+ivec2(0,1),s),d=h2f(ii+ivec2(1,1),s);',
    ' return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
    'float fbm(vec2 x,uint s){float sum=0.0,amp=0.5,tot=0.0;for(int o=0;o<4;o++){sum+=amp*vnoise(x,s+uint(o)*101u);tot+=amp;x=x*2.03+vec2(17.1,3.7);amp*=0.5;}return sum/tot;}',
    'float lineNoise(float b,uint s,vec2 circ){float pxPerUnit=min(u_res.x,u_res.y);float f=b*u_density;',
    ' f+=u_thick*6.0*(vnoise(vec2(f*0.09,0.5)+circ*0.25,s+17u)-0.5);',
    ' float sum=0.0,tot=0.0,amp=1.0,fr=1.0;',
    ' for(int o=0;o<5;o++){float cpp=u_density*fr/pxPerUnit;float w=amp*(1.0-smoothstep(0.22,0.5,cpp));',
    '  sum+=w*vnoise(vec2(f*fr+float(o)*31.7,float(o)*7.3)+circ*(1.0+0.4*float(o)),s+uint(o));tot+=w;amp*=0.58;fr*=2.17;}',
    ' return tot>0.0?sum/tot:0.5;}',
    'float field(float a,float b,vec2 circ,float ah){float F=0.0;',
    ' for(int i=0;i<8;i++){if(i>=u_blobCount)break;vec4 bl=u_blobs[i];float da=(a-bl.x)/(bl.z*u_elong);float db=(b-bl.y)/bl.z;',
    '  float r2=da*da+db*db;F+=bl.w*exp(-pow(r2,0.5*u_softExp));}',
    ' if(u_noiseAmt>0.0){float n=fbm(vec2(a/u_elong,b)*u_noiseScale+circ*0.35+vec2(5.2,1.3),u_seed+300u);F*=mix(1.0,2.2*n,u_noiseAmt);F+=u_noiseAmt*0.6*max(n-0.5,0.0);}',
    ' if(u_gradAmt>0.0){F+=u_gradAmt*(1.0-smoothstep(u_gradPos-u_gradWidth,u_gradPos+u_gradWidth,a));}',
    ' if(u_horizOn>0.5){float w=(vnoise(vec2(b*u_horizFreq,3.0)+circ*0.2,u_seed+41u)-0.5)*2.0+(vnoise(vec2(b*u_horizFreq*2.3,9.0)+circ*0.3,u_seed+43u)-0.5)*0.7;',
    '  float mask=smoothstep(u_horizPos-u_horizSoft,u_horizPos+u_horizSoft,ah+u_horizAmp*w/1.35);F*=1.0-mask;}',
    ' return F;}',
    'vec3 oklabToLinear(vec3 c){float l_=c.x+0.3963377774*c.y+0.2158037573*c.z;float m_=c.x-0.1055613458*c.y-0.0638541728*c.z;float s_=c.x-0.0894841775*c.y-1.2914855480*c.z;',
    ' float l=l_*l_*l_,m=m_*m_*m_,s=s_*s_*s_;',
    ' return vec3(4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.7076147010*s);}',
    'vec3 linearToSrgb(vec3 c){c=clamp(c,0.0,1.0);return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-0.055,step(0.0031308,c));}',
    'vec3 ramp(float t){vec3 col=u_stopLab[0];if(t<=u_stopPos[0])return col;',
    ' for(int i=1;i<8;i++){if(i>=u_stopCount)break;float p0=u_stopPos[i-1],p1=u_stopPos[i];',
    '  if(t<=p1){float k=p1>p0?(t-p0)/(p1-p0):1.0;return mix(u_stopLab[i-1],u_stopLab[i],k);}col=u_stopLab[i];}',
    ' return col;}',
    'void main(){vec2 fc=gl_FragCoord.xy;float m=min(u_res.x,u_res.y);vec2 p=(fc-0.5*u_res)/m;',
    ' float a=dot(p,u_dir);float b=dot(p,vec2(-u_dir.y,u_dir.x));',
    ' float ln=lineNoise(b,u_seed,u_circ);ln=clamp((ln-0.5)*(1.0+5.0*u_jag)+0.5,0.0,1.0);',
    ' float region=0.35+1.3*vnoise(vec2(b*2.5,5.0)+u_circ*0.3,u_seed+5u);float d=u_trail*ln*region;',
    ' float F=field(a-d,b,u_circ,a-d*0.12);',
    ' if(u_darkLines>0.0){float dl=lineNoise(b*1.37+0.31,u_seed+99u,u_circ);F*=1.0-u_darkLines*smoothstep(0.5,0.78,dl);}',
    ' F=1.0-exp(-1.25*max(F*u_exposure,0.0));float Fc=pow(F,u_contrast);F=Fc/(Fc+pow(max(1.0-F,0.0),u_contrast)+1e-6);F=pow(clamp(F,0.0,1.0),u_gamma);',
    ' vec3 lab=ramp(F);float deep=1.0-u_depth*(1.0-smoothstep(0.0,0.45,F));lab*=vec3(deep);vec3 lin=oklabToLinear(lab);',
    ' if(u_vigAmt>0.0){float v=smoothstep(u_vigRadius,u_vigRadius+0.9,length(p*2.0));lin*=1.0-u_vigAmt*v;}',
    ' vec3 col=linearToSrgb(lin);ivec2 ipx=ivec2(fc);col+=(h2f(ipx,991u)-h2f(ipx,997u))/255.0;',
    ' outColor=vec4(clamp(col,0.0,1.0),1.0);}'
  ].join('\n');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function Gradient(canvas, preset, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.p = Object.assign({}, PRESETS[preset] || PRESETS.rasgo, opts.params || {});
    this.scale = opts.scale || 0.5;
    this.duration = (opts.duration || 14) * 1000;
    this.speed = opts.speed == null ? 1 : opts.speed;
    this.offset = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.visible = false;
    this.raf = 0;
    this.t0 = performance.now();
    this.ok = this.init();
    if (!this.ok) { canvas.classList.add('is-fallback'); return; }
    this.layout = blobLayout(this.p.seed);
    this.prepareStatic();
    this.resize();
    var self = this;
    this.ro = new ResizeObserver(function () { self.resize(); self.draw(); });
    this.ro.observe(canvas);
    this.io = new IntersectionObserver(function (entries) {
      self.visible = entries[0].isIntersecting;
      self.visible ? self.play() : self.pause();
    }, { rootMargin: '10% 0px' });
    this.io.observe(canvas);
    document.addEventListener('visibilitychange', function () {
      document.hidden ? self.pause() : (self.visible && self.play());
    });
    reduceMotion.addEventListener('change', function () { self.pause(); if (self.visible) self.play(); });
  }

  Gradient.prototype.init = function () {
    var gl;
    try {
      gl = this.canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' });
    } catch (e) { gl = null; }
    if (!gl) return false;
    this.gl = gl;
    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    try {
      var prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.bindAttribLocation(prog, 0, 'a_pos');
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      this.prog = prog;
    } catch (e) {
      console.warn('[vs-gradient]', e);
      return false;
    }
    this.u = {};
    var n = gl.getProgramParameter(this.prog, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var info = gl.getActiveUniform(this.prog, i);
      this.u[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(this.prog, info.name);
    }
    var buf = gl.createBuffer();
    gl.bindVertexArray(gl.createVertexArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var self = this;
    this.canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); self.pause(); self.lost = true; });
    return true;
  };

  // uniforms que não mudam por quadro
  Gradient.prototype.prepareStatic = function () {
    var gl = this.gl, u = this.u, p = this.p;
    var th = p.angle * Math.PI / 180;
    this.dir = [Math.cos(th), Math.sin(th)];
    gl.uniform1ui(u.u_seed, subSeed(p.seed, 3));
    var s = p.softness;
    gl.uniform1f(u.u_softExp, s < 0.5 ? 6 + (2 - 6) * (s * 2) : 2 + (1 - 2) * ((s - 0.5) * 2));
    gl.uniform1f(u.u_noiseAmt, p.noiseAmt); gl.uniform1f(u.u_noiseScale, p.noiseScale);
    gl.uniform1f(u.u_gradAmt, p.gradAmt); gl.uniform1f(u.u_gradPos, p.gradPos); gl.uniform1f(u.u_gradWidth, p.gradWidth);
    gl.uniform2f(u.u_dir, this.dir[0], this.dir[1]);
    gl.uniform1f(u.u_density, p.density); gl.uniform1f(u.u_trail, p.trail); gl.uniform1f(u.u_elong, p.elong);
    gl.uniform1f(u.u_jag, p.jag); gl.uniform1f(u.u_thick, p.thick); gl.uniform1f(u.u_darkLines, p.darkLines);
    gl.uniform1f(u.u_horizOn, p.horizOn ? 1 : 0); gl.uniform1f(u.u_horizPos, p.horizPos);
    gl.uniform1f(u.u_horizAmp, p.horizAmp); gl.uniform1f(u.u_horizFreq, p.horizFreq); gl.uniform1f(u.u_horizSoft, p.horizSoft);
    gl.uniform1f(u.u_exposure, Math.pow(2, p.exposure)); gl.uniform1f(u.u_contrast, p.contrast); gl.uniform1f(u.u_gamma, p.gamma);
    var pos = new Float32Array(8), lab = new Float32Array(24);
    p.stops.forEach(function (st, i) { pos[i] = st[0]; lab.set(hexToOklab(st[1]), i * 3); });
    gl.uniform1i(u.u_stopCount, p.stops.length);
    gl.uniform1fv(u.u_stopPos, pos); gl.uniform3fv(u.u_stopLab, lab);
    gl.uniform1f(u.u_depth, p.depthOn ? p.depthAmt : 0);
    gl.uniform1f(u.u_vigAmt, p.vigAmt); gl.uniform1f(u.u_vigRadius, p.vigRadius);
  };

  Gradient.prototype.resize = function () {
    var r = this.canvas.getBoundingClientRect();
    var k = this.scale * Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(2, Math.round(r.width * k)), h = Math.max(2, Math.round(r.height * k));
    if (w > 1280) { h = Math.round(h * 1280 / w); w = 1280; }
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
  };

  Gradient.prototype.draw = function (now) {
    if (!this.ok || this.lost) return;
    var gl = this.gl, u = this.u, p = this.p;
    var w = this.canvas.width, h = this.canvas.height, m = Math.min(w, h);
    var still = reduceMotion.matches;
    var phase = still ? 0 : (((now || performance.now()) - this.t0) % this.duration) / this.duration * Math.PI * 2;
    var speed = still ? 0 : this.speed;
    // o deslocamento do cursor alcança o alvo com amortecimento
    this.offset.x += (this.target.x - this.offset.x) * 0.06;
    this.offset.y += (this.target.y - this.offset.y) * 0.06;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.u_res, w, h);
    gl.uniform2f(u.u_circ, speed * 0.5 * (Math.cos(phase) - 1), speed * 0.5 * Math.sin(phase));
    var dx = this.dir[0], dy = this.dir[1];
    var blobs = new Float32Array(32), count = Math.min(8, p.blobCount);
    for (var i = 0; i < count; i++) {
      var L = this.layout[i];
      var x = (p.posX + this.offset.x + p.spread * 0.5 * L.ox) * w / m;
      var y = (p.posY + this.offset.y + p.spread * 0.5 * L.oy) * h / m;
      var k = speed * 0.05 * L.amp;
      x += k * (Math.cos(L.dir * phase + L.ph) - Math.cos(L.ph));
      y += k * (Math.sin(L.dir * phase + L.ph) - Math.sin(L.ph));
      var r = p.blobSize * L.rs * (1 + speed * 0.08 * (Math.sin(phase + L.ph2) - Math.sin(L.ph2)));
      blobs[i * 4] = x * dx + y * dy;
      blobs[i * 4 + 1] = -x * dy + y * dx;
      blobs[i * 4 + 2] = Math.max(0.005, r);
      blobs[i * 4 + 3] = L.w;
    }
    gl.uniform1i(u.u_blobCount, count);
    gl.uniform4fv(u.u_blobs, blobs);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  Gradient.prototype.play = function () {
    if (!this.ok || this.raf) return;
    var self = this;
    if (reduceMotion.matches) { this.draw(); return; }
    var last = 0, slow = 0;
    function loop(now) {
      self.raf = requestAnimationFrame(loop);
      // degrada a resolução se o aparelho não acompanhar
      if (last && now - last > 40) { if (++slow > 20 && self.scale > 0.45) { self.scale = 0.45; self.resize(); slow = 0; } }
      else slow = Math.max(0, slow - 1);
      last = now;
      self.draw(now);
    }
    this.raf = requestAnimationFrame(loop);
  };

  Gradient.prototype.pause = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  };

  // atualiza parâmetros estáticos (ex.: horizonte calculado pelo layout)
  Gradient.prototype.set = function (params) {
    if (!this.ok) return;
    Object.assign(this.p, params);
    this.prepareStatic();
    this.draw();
  };

  // x, y entre -1 e 1 (posição do cursor na área)
  Gradient.prototype.pointer = function (x, y, amount) {
    var a = amount == null ? 1 : amount;
    this.target.x = x * 0.14 * a;
    this.target.y = -y * 0.1 * a;
  };

  window.VSGradient = {
    create: function (canvas, preset, opts) { return new Gradient(canvas, preset, opts); },
    presets: PRESETS
  };
})();
