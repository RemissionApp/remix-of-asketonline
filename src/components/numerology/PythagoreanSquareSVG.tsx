import React from 'react';
import type { PythagoreanSquare } from '@/utils/numerology/calculations';

interface Props {
  square: PythagoreanSquare;
  size?: number;
  cellLabels?: Record<string, string>;
}

/**
 * 3x3 mystical Pythagorean square with diagonals and star points.
 */
export const PythagoreanSquareSVG: React.FC<Props> = ({
  square,
  size = 320,
  cellLabels = {},
}) => {
  const cell = size / 3;
  const order = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const strengthColor = (count: number) => {
    if (count <= 0) return 'hsl(var(--muted) / 0.15)';
    if (count === 1) return 'hsl(var(--cosmic-accent) / 0.15)';
    if (count === 2) return 'hsl(var(--cosmic-accent) / 0.30)';
    if (count === 3) return 'hsl(var(--cosmic-gold) / 0.45)';
    return 'hsl(var(--cosmic-gold) / 0.65)';
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[320px] h-auto mx-auto drop-shadow-[0_0_20px_hsl(var(--cosmic-gold)/0.25)]"
      role="img"
      aria-label="Pythagorean Square"
    >
      <defs>
        <radialGradient id="psBg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--cosmic-accent) / 0.25)" />
          <stop offset="100%" stopColor="hsl(var(--cosmic-dark) / 0.0)" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={size} height={size} rx={18} fill="url(#psBg)" />

      {/* diagonals */}
      <line x1={0} y1={0} x2={size} y2={size} stroke="hsl(var(--cosmic-gold) / 0.25)" strokeDasharray="3 4" />
      <line x1={size} y1={0} x2={0} y2={size} stroke="hsl(var(--cosmic-gold) / 0.25)" strokeDasharray="3 4" />

      {order.map((n, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const x = col * cell;
        const y = row * cell;
        const count = square.cells[String(n)] ?? 0;
        return (
          <g key={n}>
            <rect
              x={x + 4}
              y={y + 4}
              width={cell - 8}
              height={cell - 8}
              rx={12}
              fill={strengthColor(count)}
              stroke="hsl(var(--cosmic-gold) / 0.4)"
              strokeWidth={1}
              className="transition-all"
            />
            <text
              x={x + cell / 2}
              y={y + cell / 2 - 6}
              textAnchor="middle"
              fontFamily="serif"
              fontSize={cell * 0.32}
              fill="hsl(var(--foreground))"
            >
              {count > 0 ? String(n).repeat(Math.min(count, 4)) : '·'}
            </text>
            <text
              x={x + cell / 2}
              y={y + cell - 14}
              textAnchor="middle"
              fontSize={10}
              fill="hsl(var(--cosmic-secondary))"
              opacity={0.85}
            >
              {cellLabels[String(n)] ?? n}
            </text>
          </g>
        );
      })}

      {/* star points at corners */}
      {[
        [0, 0],
        [size, 0],
        [0, size],
        [size, size],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={3}
          fill="hsl(var(--cosmic-gold))"
          className="animate-pulse"
        />
      ))}
    </svg>
  );
};

export default PythagoreanSquareSVG;