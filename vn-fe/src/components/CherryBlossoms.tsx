import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

function createPetal(width: number, height: number): Petal {
  return {
    x: Math.random() * width,
    y: Math.random() * -height,
    size: 4 + Math.random() * 8,
    speedY: 0.3 + Math.random() * 0.7,
    speedX: -0.2 + Math.random() * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.03,
    opacity: 0.15 + Math.random() * 0.25,
    wobble: 0,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
  };
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  petal: Petal,
) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation);
  ctx.globalAlpha = petal.opacity;

  ctx.beginPath();
  const s = petal.size;
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(s * 0.4, -s * 0.3, s, -s * 0.2, s * 0.5, s * 0.4);
  ctx.bezierCurveTo(s * 0.2, s * 0.6, -s * 0.1, s * 0.3, 0, 0);
  ctx.fillStyle = "#ffb7c5";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-s * 0.4, -s * 0.3, -s, -s * 0.2, -s * 0.5, s * 0.4);
  ctx.bezierCurveTo(-s * 0.2, s * 0.6, s * 0.1, s * 0.3, 0, 0);
  ctx.fillStyle = "#ffa0b4";
  ctx.fill();

  ctx.restore();
}

export default function CherryBlossoms() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const petals: Petal[] = [];
    const petalCount = 60;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < petalCount; i++) {
      const p = createPetal(canvas.width, canvas.height);
      p.y = Math.random() * canvas.height;
      petals.push(p);
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const petal of petals) {
        petal.wobble += petal.wobbleSpeed;
        petal.x += petal.speedX + Math.sin(petal.wobble) * 0.5;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;

        if (petal.y > canvas.height + 20) {
          petal.y = -20;
          petal.x = Math.random() * canvas.width;
        }
        if (petal.x > canvas.width + 20) petal.x = -20;
        if (petal.x < -20) petal.x = canvas.width + 20;

        drawPetal(ctx, petal);
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
