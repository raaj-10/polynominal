async function main() {
  const statusEl = document.getElementById("status");
  const cEl = document.getElementById("c-value");

  try {
    
    const res = await fetch("data.json?ts=" + Date.now());
    if (!res.ok) throw new Error("Failed to load data.json");
    const data = await res.json();

    const n = Number(data.n);
    const pts = Array.isArray(data.y)
      ? [{ x: 0, y: Number(data.y[0]) },
         { x: 1, y: Number(data.y[1]) },
         { x: 2, y: Number(data.y[2]) }]
      : data.points.slice(0, 3).map(p => ({ x: Number(p.x), y: Number(p.y) }));

    const [p0, p1, p2] = pts;

    
    const Y1 = p1.y - p0.y;
    const Y2 = p2.y - p0.y;

    const A11 = (p1.x ** n)     - (p0.x ** n);
    const A12 = (p1.x ** (n-1)) - (p0.x ** (n-1));
    const A21 = (p2.x ** n)     - (p0.x ** n);
    const A22 = (p2.x ** (n-1)) - (p0.x ** (n-1));

    const det = A11 * A22 - A12 * A21;
    if (Math.abs(det) < 1e-12) throw new Error("Bad/degenerate points for this n");

    const a = (Y1 * A22 - A12 * Y2) / det;
    const b = (A11 * Y2 - Y1 * A21) / det;
    const c = p0.y - a * (p0.x ** n) - b * (p0.x ** (n - 1));

    statusEl.textContent = "Done";
    cEl.textContent = Number.isFinite(c) ? c.toFixed(2) : String(c);
    console.log({ a, b, c, n, pts });
  } catch (err) {
    statusEl.textContent = "Error";
    document.getElementById("c-value").textContent = err.message;
    console.error(err);
  }
}

main();