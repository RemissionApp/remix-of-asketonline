import React from 'react';
import type { KarmaMatrix } from '@/utils/numerology/calculations';
import { isMasterNumber } from '@/utils/numerology/calculations';

interface Props {
  karma: KarmaMatrix;
  size?: number;
  labels?: {
    center?: string;
    sky?: string;
    earth?: string;
    planets?: Partial<Record<keyof KarmaMatrix['planets'], string>>;
  };
}

/**
 * Karma Matrix circle: center self + 7 planetary positions on the wheel.
 */
export const KarmaMatrixSVG: React.FC<Props> = ({ karma, size = 400, labels = {} }) => {
  const cx = size / 2;
  const cy = size / 2;
  const ringR = size * 0.38;
  const planetR = 26;

  const planetOrder: Array<{ key: keyof KarmaMatrix['planets']; symbol: string }> = [
    { key: 'sun', symbol: '☉' },
    { key: 'venus', symbol: '♀' },
    { key: 'mercury', symbol: '☿' },
    { key: 'moon', symbol: '☽' },
    { key: 'mars', symbol: '♂' },
    { key: 'jupiter', symbol: '♃' },
    { key: 'saturn', symbol: '♄' },
  ];

  const masterStroke = (n: number) =>
    isMasterNumber(n) ? 'hsl(var(--cosmic-gold))' : 'hsl(var(--cosmic-gold) / 0.5)';
  const masterStrokeW = (n: number) => (isMasterNumber(n) ? 2.2 : 1);
  const masterFill = (n: number) =>
    isMasterNumber(n)
      ? 'hsl(var(--cosmic-gold) / 0.55)'
      : 'hsl(var(--cosmic-accent) / 0.3)';

  const MasterMark: React.FC<{ x: number; y: number; n: number }> = ({ x, y, n }) =>
    isMasterNumber(n) ? (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={11}
        fill="hsl(var(--cosmic-gold))"
        className="animate-pulse"
        aria-label="master number"
      >
        ✦
      </text>
    ) : null;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[400px] h-auto mx-auto drop-shadow-[0_0_24px_hsl(var(--cosmic-gold)/0.25)]"
      role="img"
      aria-label="Karma Matrix"
    >
      <defs>
        <radialGradient id="kmBg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="hsl(var(--cosmic-gold) / 0.25)" />
          <stop offset="100%" stopColor="hsl(var(--cosmic-dark) / 0)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={size * 0.48} fill="url(#kmBg)" />

      {/* outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={ringR}
        fill="none"
        stroke="hsl(var(--cosmic-gold) / 0.35)"
        strokeDasharray="4 6"
      />
      {/* inner ring */}
      <circle
        cx={cx}
        cy={cy}
        r={ringR * 0.55}
        fill="none"
        stroke="hsl(var(--cosmic-accent) / 0.4)"
      />

      {/* axes: sky-earth (vertical) */}
      <text x={cx} y={cy - ringR * 0.55 - 10} textAnchor="middle" fontSize={10} fill="hsl(var(--cosmic-secondary))">
        {labels.sky ?? 'Sky'}
      </text>
      <circle
        cx={cx}
        cy={cy - ringR * 0.55}
        r={isMasterNumber(karma.sky) ? 21 : 18}
        fill={masterFill(karma.sky)}
        stroke={masterStroke(karma.sky)}
        strokeWidth={masterStrokeW(karma.sky)}
      />
      <text x={cx} y={cy - ringR * 0.55 + 5} textAnchor="middle" fontFamily="serif" fontSize={16} fill="hsl(var(--foreground))">
        {karma.sky}
      </text>
      <MasterMark x={cx + 22} y={cy - ringR * 0.55 - 10} n={karma.sky} />

      <text x={cx} y={cy + ringR * 0.55 + 22} textAnchor="middle" fontSize={10} fill="hsl(var(--cosmic-secondary))">
        {labels.earth ?? 'Earth'}
      </text>
      <circle
        cx={cx}
        cy={cy + ringR * 0.55}
        r={isMasterNumber(karma.earth) ? 21 : 18}
        fill={masterFill(karma.earth)}
        stroke={masterStroke(karma.earth)}
        strokeWidth={masterStrokeW(karma.earth)}
      />
      <text x={cx} y={cy + ringR * 0.55 + 5} textAnchor="middle" fontFamily="serif" fontSize={16} fill="hsl(var(--foreground))">
        {karma.earth}
      </text>
      <MasterMark x={cx + 22} y={cy + ringR * 0.55 - 8} n={karma.earth} />

      {/* planets distributed around */}
      {planetOrder.map((p, i) => {
        const angle = (-Math.PI / 2) + ((i + 1) * (2 * Math.PI)) / (planetOrder.length + 1);
        const x = cx + Math.cos(angle) * ringR;
        const y = cy + Math.sin(angle) * ringR;
        const v = karma.planets[p.key];
        return (
          <g key={p.key} className="animate-fade-in">
            <circle
              cx={x}
              cy={y}
              r={isMasterNumber(v) ? planetR + 3 : planetR}
              fill="hsl(var(--cosmic-dark) / 0.7)"
              stroke={masterStroke(v)}
              strokeWidth={masterStrokeW(v)}
            />
            <text x={x} y={y - 4} textAnchor="middle" fontSize={14} fill="hsl(var(--cosmic-gold))">
              {p.symbol}
            </text>
            <text x={x} y={y + 12} textAnchor="middle" fontFamily="serif" fontSize={14} fill="hsl(var(--foreground))">
              {v}
            </text>
            <MasterMark x={x + planetR - 4} y={y - planetR + 6} n={v} />
            <text x={x} y={y + planetR + 12} textAnchor="middle" fontSize={9} fill="hsl(var(--cosmic-secondary))">
              {labels.planets?.[p.key] ?? p.key}
            </text>
          </g>
        );
      })}

      {/* center self */}
      <circle
        cx={cx}
        cy={cy}
        r={isMasterNumber(karma.center) ? 40 : 36}
        fill="hsl(var(--cosmic-gold) / 0.25)"
        stroke="hsl(var(--cosmic-gold))"
        strokeWidth={isMasterNumber(karma.center) ? 2.5 : 1.5}
      />
      <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="serif" fontSize={24} fill="hsl(var(--foreground))">
        {karma.center}
      </text>
      <MasterMark x={cx + 28} y={cy - 28} n={karma.center} />
      <text x={cx} y={cy + 50} textAnchor="middle" fontSize={10} fill="hsl(var(--cosmic-secondary))">
        {labels.center ?? 'Self'}
      </text>
    </svg>
  );
};

export default KarmaMatrixSVG;