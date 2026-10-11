/**
 * Strumenti del barbiere in 3D (three.js): forbici, rasoio a mano libera e
 * pettine, modellati con geometrie procedurali e materiali fisici (acciaio
 * cromato, alluminio, manico rosso). Nessun modello esterno da scaricare.
 *
 * La scena e' guidata da un solo valore, `progress` (0..1), che arriva dallo
 * scorrimento: ogni strumento entra, compie il suo gesto e lascia il posto
 * al successivo. In modalita' statica i tre strumenti sono affiancati.
 */
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  BackSide,
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { TOOL_WINDOWS } from "./toolWindows";

export type ToolsLayout = "wide" | "narrow" | "static";

export interface ToolsScene {
  setProgress(p: number): void;
  setLayout(layout: ToolsLayout): void;
  start(): void;
  stop(): void;
  dispose(): void;
}


const extrude = (shape: Shape, depth: number, bevel = 0.012) => {
  const g = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 28,
  });
  g.translate(0, 0, -depth / 2);
  return g;
};

// ---------- Studio fotografico (solo per i riflessi) ----------
/**
 * Stanza scura con pannelli luminosi a strisce, come uno studio di still
 * life: l'acciaio cromato riflette bande nette chiaro/scuro invece di un
 * grigio uniforme. Una striscia rossa richiama il palo da barbiere.
 */
function studioEnvironment() {
  const room = new Scene();
  const walls = new Mesh(new BoxGeometry(20, 12, 20), new MeshBasicMaterial({ color: 0x5a5954, side: BackSide }));
  room.add(walls);
  const panel = (w: number, h: number, color: Color, x: number, y: number, z: number, ry = 0, rx = 0) => {
    const mesh = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color, side: DoubleSide }));
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, 0);
    room.add(mesh);
  };
  const white = new Color(1, 1, 1).multiplyScalar(6);
  const soft = new Color(1, 1, 1).multiplyScalar(2.2);
  const red = new Color(1, 0.16, 0.08).multiplyScalar(5);
  panel(16, 3, white, 0, 5.8, 0, 0, Math.PI / 2); // soffitto: grande striscia
  panel(2.5, 10, soft, -9.8, 0, -1, Math.PI / 2); // lato sinistro
  panel(1.6, 10, white, 9.8, 0, 3, -Math.PI / 2); // lato destro
  panel(12, 1, red, 0, -2.6, -9.8); // fondo, rosso
  panel(12, 4, soft, 0, 2.2, 9.8, Math.PI); // davanti, alle spalle della camera
  panel(16, 1.2, soft, 0, -5.8, 2, 0, -Math.PI / 2); // pavimento, riflesso tenue
  return room;
}

// ---------- Materiali ----------
function materials() {
  const steel = new MeshPhysicalMaterial({ color: 0xf2f0ea, metalness: 1, roughness: 0.16 });
  const darkSteel = new MeshPhysicalMaterial({ color: 0x77756f, metalness: 1, roughness: 0.22 });
  const red = new MeshPhysicalMaterial({ color: 0xa31c0f, metalness: 0, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.06 });
  // Pettine in alluminio spazzolato: leggibile sul fondo scuro.
  const aluminium = new MeshPhysicalMaterial({ color: 0xc9c7c0, metalness: 1, roughness: 0.34 });
  return { steel, darkSteel, red, aluminium };
}
type Materials = ReturnType<typeof materials>;

// ---------- Forbici ----------
function scissorsHalf(m: Materials, mirrored: boolean) {
  const half = new Group();

  const blade = new Shape();
  blade.moveTo(-0.28, 0.1);
  blade.lineTo(0.35, 0.15);
  blade.quadraticCurveTo(1.95, 0.17, 3.15, 0.02);
  blade.quadraticCurveTo(1.85, -0.03, 0.35, -0.07);
  blade.lineTo(-0.28, -0.07);
  blade.quadraticCurveTo(-0.36, 0.015, -0.28, 0.1);
  half.add(new Mesh(extrude(blade, 0.05, 0.02), m.steel));

  // Gambo curvo dal perno all'anello.
  const shank = new CatmullRomCurve3([
    new Vector3(-0.2, 0.0, 0),
    new Vector3(-0.62, -0.12, 0),
    new Vector3(-0.98, -0.26, 0),
  ]);
  half.add(new Mesh(new TubeGeometry(shank, 24, 0.068, 14, false), m.steel));

  const ring = new Mesh(new TorusGeometry(0.34, 0.072, 20, 56), m.steel);
  ring.position.set(-1.3, -0.42, 0);
  ring.scale.set(1.12, 0.92, 1);
  half.add(ring);

  if (!mirrored) {
    // Appoggiadito: piccolo sperone sotto l'anello inferiore.
    const tang = new CatmullRomCurve3([
      new Vector3(-1.5, -0.74, 0),
      new Vector3(-1.66, -0.9, 0),
      new Vector3(-1.84, -0.94, 0),
    ]);
    half.add(new Mesh(new TubeGeometry(tang, 16, 0.05, 12, false), m.steel));
  }

  if (mirrored) {
    half.scale.y = -1;
    half.position.z = 0.055;
  }
  return half;
}

function scissors(m: Materials) {
  const tool = new Group();
  const pivot = new Group();
  const a = scissorsHalf(m, false);
  const b = scissorsHalf(m, true);
  pivot.add(a, b);
  const screw = new Mesh(new CylinderGeometry(0.1, 0.1, 0.16, 28), m.darkSteel);
  screw.rotation.x = Math.PI / 2;
  screw.position.z = 0.03;
  pivot.add(screw);
  pivot.position.x = -0.55; // centra lo strumento attorno all'origine
  tool.add(pivot);
  return {
    group: tool,
    setOpen(angle: number) {
      a.rotation.z = angle / 2;
      b.rotation.z = -angle / 2;
    },
  };
}

// ---------- Rasoio a mano libera ----------
function razor(m: Materials) {
  const tool = new Group();
  const body = new Group();

  const scale = new Shape();
  scale.moveTo(-0.18, -0.15);
  scale.quadraticCurveTo(1.4, -0.24, 2.78, -0.12);
  scale.quadraticCurveTo(2.96, 0, 2.78, 0.12);
  scale.quadraticCurveTo(1.4, 0.21, -0.18, 0.15);
  scale.quadraticCurveTo(-0.34, 0, -0.18, -0.15);
  const scaleGeo = extrude(scale, 0.05, 0.02);
  const front = new Mesh(scaleGeo, m.red);
  front.position.z = 0.065;
  const back = new Mesh(scaleGeo, m.red);
  back.position.z = -0.065;
  body.add(front, back);

  for (const x of [0, 2.62]) {
    const pin = new Mesh(new CylinderGeometry(0.045, 0.045, 0.2, 20), m.steel);
    pin.rotation.x = Math.PI / 2;
    pin.position.x = x;
    body.add(pin);
  }

  // Lama: ruota attorno al perno (origine) da chiusa (dentro il manico) ad aperta.
  const bladePivot = new Group();
  // Lama larga con dorso dritto, tallone e punta squadrata leggermente arrotondata.
  const blade = new Shape();
  blade.moveTo(-0.12, -0.07);
  blade.lineTo(0.36, -0.08);
  blade.quadraticCurveTo(0.44, -0.12, 0.46, -0.24);
  blade.lineTo(0.5, -0.4);
  blade.quadraticCurveTo(1.35, -0.43, 2.32, -0.38);
  blade.quadraticCurveTo(2.44, -0.36, 2.44, -0.24);
  blade.lineTo(2.42, 0.08);
  blade.quadraticCurveTo(2.4, 0.15, 2.3, 0.15);
  blade.lineTo(0.48, 0.15);
  blade.quadraticCurveTo(0.4, 0.15, 0.36, 0.08);
  blade.lineTo(-0.12, 0.07);
  blade.quadraticCurveTo(-0.22, 0, -0.12, -0.07);
  bladePivot.add(new Mesh(extrude(blade, 0.035, 0.012), m.steel));
  // Filo del rasoio: sottile fascia piu' chiara lungo il tagliente.
  const edge = new Mesh(new BoxGeometry(1.84, 0.03, 0.05), m.darkSteel);
  edge.position.set(1.42, -0.39, 0);
  bladePivot.add(edge);
  // Coda (tang) con la presa per il pollice.
  const tail = new Shape();
  tail.moveTo(-0.1, -0.06);
  tail.quadraticCurveTo(-0.55, -0.12, -0.72, 0.02);
  tail.quadraticCurveTo(-0.55, 0.1, -0.1, 0.06);
  bladePivot.add(new Mesh(extrude(tail, 0.035, 0.012), m.steel));
  body.add(bladePivot);

  body.position.x = -0.35;
  tool.add(body);
  return {
    group: tool,
    setOpen(amount: number) {
      bladePivot.rotation.z = -amount * Math.PI * 1.08;
      body.position.x = MathUtils.lerp(-1.3, 0.1, amount);
    },
  };
}

// ---------- Pettine ----------
function comb(m: Materials) {
  const parts: BufferGeometry[] = [];
  const spine = new BoxGeometry(3.9, 0.34, 0.08);
  spine.translate(0, 0.2, 0);
  parts.push(spine);
  const count = 36;
  for (let i = 0; i < count; i++) {
    const coarse = i < count / 2;
    const x = -1.86 + (i / (count - 1)) * 3.72;
    const width = coarse ? 0.07 : 0.042;
    const length = coarse ? 0.82 : 0.68;
    const tooth = new BoxGeometry(width, length, 0.07);
    tooth.translate(x, 0.03 - length / 2, 0);
    parts.push(tooth);
  }
  const geometry = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  const mesh = new Mesh(geometry, m.aluminium);
  const group = new Group();
  group.add(mesh);
  return { group };
}

// ---------- Utilita' di posa ----------
const smooth = (x: number) => MathUtils.smoothstep(x, 0, 1);
const local = (p: number, [a, b]: [number, number]) => (p - a) / (b - a);

interface Pose {
  x: number;
  y: number;
  scale: number;
}

const LAYOUTS: Record<Exclude<ToolsLayout, "static">, Pose> = {
  wide: { x: 1.9, y: -0.05, scale: 0.86 },
  narrow: { x: 0, y: 1.15, scale: 0.6 },
};

export function createToolsScene(canvas: HTMLCanvasElement, initial: ToolsLayout): ToolsScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(new Color(0x000000), 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const studio = studioEnvironment();
  const env = pmrem.fromScene(studio, 0.02).texture;
  studio.traverse((obj) => {
    if (obj instanceof Mesh) {
      obj.geometry.dispose();
      (obj.material as Material).dispose();
    }
  });
  scene.environment = env;

  const camera = new PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0, 11);

  const key = new DirectionalLight(0xffffff, 0.8);
  key.position.set(-3, 4, 6);
  scene.add(key);
  const rim = new PointLight(0xff3b25, 26, 14);
  rim.position.set(3.5, -1.5, -2.5);
  scene.add(rim);

  const m = materials();
  const s = scissors(m);
  const r = razor(m);
  const c = comb(m);
  const tools = [s.group, r.group, c.group];
  tools.forEach((t) => scene.add(t));

  let layout: ToolsLayout = initial;
  let target = 0;
  let current = 0;
  let running = false;
  let raf = 0;
  let t0 = performance.now();
  let last = t0;

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Su schermi stretti si allontana la camera per non tagliare gli strumenti.
    camera.position.z = camera.aspect < 0.8 ? 14 : 11;
    camera.updateProjectionMatrix();
  }

  function poseStatic(time: number) {
    const slots = [-3.1, 0, 3.1];
    const bob = (i: number) => Math.sin(time * 0.0006 + i) * 0.04;
    tools.forEach((tool, i) => {
      tool.visible = true;
      tool.position.set(slots[i], bob(i), 0);
      tool.scale.setScalar(0.62);
      tool.rotation.set(0.35, -0.35, 0.95);
    });
    s.setOpen(0.42);
    r.setOpen(1);
    if (camera.aspect < 1.4) {
      // Colonna: uno sopra l'altro.
      tools.forEach((tool, i) => {
        tool.position.set(0, 1.9 - i * 1.9, 0);
        tool.rotation.z = 0.25;
      });
    }
  }

  function poseScroll(p: number, time: number) {
    const base = LAYOUTS[layout === "narrow" ? "narrow" : "wide"];
    const bob = Math.sin(time * 0.0009) * 0.05;
    tools.forEach((tool, i) => {
      const t = local(p, TOOL_WINDOWS[i]);
      tool.visible = t > -0.02 && t < 1.02;
      if (!tool.visible) return;
      const enter = smooth(MathUtils.clamp(t / 0.24, 0, 1));
      const exit = smooth(MathUtils.clamp((t - 0.76) / 0.24, 0, 1));
      const k = MathUtils.clamp((t - 0.24) / 0.52, 0, 1); // fase del gesto

      const x = base.x + (1 - enter) * 3.4 - exit * 3.4;
      const y = base.y + bob - (1 - enter) * 2.6 + exit * 2.6;
      const z = -(1 - enter) * 2.5 - exit * 2.5;
      tool.position.set(x, y, z);
      tool.scale.setScalar(base.scale * (0.75 + 0.25 * enter) * (1 - 0.25 * exit));

      const spin = (1 - enter) * 1.4 - exit * 1.2;
      tool.rotation.set(0.32 + Math.sin(k * Math.PI) * 0.1, -0.55 + k * 1.1 + spin * 0.5, 0.42 + spin);

      if (i === 0) {
        // Due colpi di forbice durante il gesto.
        const snip = Math.abs(Math.sin(k * Math.PI * 2));
        s.setOpen(0.08 + snip * 0.62 * enter);
      } else if (i === 1) {
        r.setOpen(smooth(MathUtils.clamp((k - 0.05) / 0.55, 0, 1)) * enter);
      } else {
        // Passata di pettine: scorre lungo il proprio asse.
        tool.position.x += Math.sin(k * Math.PI * 2) * 0.35 * base.scale;
        tool.rotation.z += Math.sin(k * Math.PI) * 0.18;
      }
    });
    rim.position.x = 3.5 - p * 6;
  }

  function frame(time: number) {
    // Smorzamento a tempo (non a fotogrammi): stessa resa a 30 o a 120 Hz.
    const dt = Math.min(0.1, Math.max(0, (time - last) / 1000));
    last = time;
    current += (target - current) * (1 - Math.exp(-dt * 9));
    if (layout === "static") poseStatic(time);
    else poseScroll(current, time);
    renderer.render(scene, camera);
  }

  function loop(time: number) {
    frame(time);
    if (running) raf = requestAnimationFrame(loop);
  }

  const ro = new ResizeObserver(() => {
    resize();
    frame(performance.now());
  });
  ro.observe(canvas);
  resize();
  frame(t0);

  return {
    setProgress(p) {
      target = MathUtils.clamp(p, 0, 1);
      if (!running) {
        current = target;
        frame(performance.now());
      }
    },
    setLayout(next) {
      layout = next;
      resize();
      frame(performance.now());
    },
    start() {
      if (running) return;
      running = true;
      t0 = performance.now();
      last = t0;
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((mat: Material) => mat.dispose());
        }
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
