import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledMainContainer = styled.canvas`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  pointer-events: none;

  z-index: -1;
`;

interface RainOverlayProps {
  dropCount?: number;
}

class RainDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.vx = -1;
    this.vy = 5;

    this.length = 15 + Math.random() * 20;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y > height + this.length) {
      this.y = -this.length;
      this.x = Math.random() * width;
    }

    if (this.x < -this.length) {
      this.x = width + this.length;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    ctx.moveTo(this.x, this.y);

    ctx.lineTo(
      this.x + this.length * -0.2,
      this.y + this.length
    );

    ctx.stroke();
  }
}

const RainBackground = ({dropCount = 800}: RainOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const parent = canvas.parentElement;

      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();

    const drops: RainDrop[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push(
        new RainDrop(
          canvas.width,
          canvas.height
        )
      );
    }

    const render = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.globalCompositeOperation = "destination-out";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.globalCompositeOperation = "source-over";

      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;

      drops.forEach((drop) => {
        drop.update(
          canvas.width,
          canvas.height
        );

        drop.draw(ctx);
      });

      animationFrameId =
        requestAnimationFrame(render);
    };

    render();

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [dropCount]);

  return <StyledMainContainer ref={canvasRef} />;
};

export default RainBackground;