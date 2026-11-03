// 히어로 배경 점들이 스크롤 진행도(p)에 따라 낭비 막대로 모인다.
// 상시 루프가 없다. 스크롤·리사이즈·폰트 로드 때 wake()로 한 프레임씩 그린다.

type Rgb = [number, number, number];

const VENDOR_COLORS: Rgb[] = [
  [107, 78, 147],
  [169, 116, 60],
  [156, 163, 175],
];
const VENDOR_WEIGHTS = [0.7, 0.92, 1];
const IDLE: Rgb = [138, 90, 40];
const USE: Rgb = [51, 83, 143];
const SPLIT = 780 / 1228;

type Dot = {
  sx: number;
  sy: number;
  tx: number;
  vc: Rgb;
  sc: Rgb;
  d: number;
  r: number;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeInOutCubic = (k: number) =>
  k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

export function createHeroCanvas(opts: {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  bar: HTMLElement;
  count: number;
  getProgress: () => number;
}) {
  const { stage, canvas, bar, getProgress } = opts;
  const ctx = canvas.getContext("2d");
  const N = Math.max(60, Math.min(600, opts.count));
  let dots: Dot[] = [];
  let W = 0;
  let H = 0;
  let barY = 0;
  let raf = 0;
  let visible = true;
  let dead = false;

  const setup = () => {
    const r = stage.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width;
    H = r.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bx = b.left - r.left;
    const bw = b.width;
    barY = b.top - r.top + b.height / 2;
    const R = mulberry32(7);
    dots = Array.from({ length: N }, (_, i) => {
      const v = R();
      const vi = v < VENDOR_WEIGHTS[0] ? 0 : v < VENDOR_WEIGHTS[1] ? 1 : 2;
      const sx = R() * W;
      let sy = R() * H;
      // 제목 영역은 비워 둔다.
      if (Math.abs(sx - W / 2) < W * 0.28 && Math.abs(sy - H * 0.42) < H * 0.22)
        sy = R() < 0.5 ? R() * H * 0.2 : H * 0.72 + R() * H * 0.28;
      const d = R() * 0.35;
      R(); // 원본 시안의 위상(ph) 값 자리. 같은 배치를 유지하려고 소비한다.
      R(); // 원본 시안의 속도(sp) 값 자리.
      return {
        sx,
        sy,
        tx: bx + ((i + 0.5) / N) * bw,
        vc: VENDOR_COLORS[vi],
        sc: i / N < SPLIT ? IDLE : USE,
        d,
        r: 1.4 + R() * 1.6,
      };
    });
  };

  const draw = () => {
    raf = 0;
    if (!ctx) return;
    const p = getProgress();
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      const e = easeInOutCubic(Math.min(1, Math.max(0, (p - d.d) / 0.6)));
      const X = d.sx + (d.tx - d.sx) * e;
      const Y = d.sy + (barY - d.sy) * e;
      const c = d.vc.map((v, j) => Math.round(v + (d.sc[j] - v) * e));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.45 + 0.55 * e})`;
      ctx.beginPath();
      ctx.arc(X, Y, d.r + (1.7 - d.r) * e, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const wake = () => {
    if (!raf && !dead && visible && !document.hidden)
      raf = requestAnimationFrame(draw);
  };

  const onResize = () => {
    setup();
    wake();
  };

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    wake();
  });

  setup();
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", wake);
  io.observe(stage);
  wake();

  return {
    wake,
    refresh: onResize,
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", wake);
      io.disconnect();
    },
  };
}
