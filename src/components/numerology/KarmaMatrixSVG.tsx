import React from 'react';
import type { KarmaMatrix } from '@/utils/numerology/calculations';

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
      <circle cx={cx} cy={cy - ringR * 0.55} r={18} fill="hsl(var(--cosmic-accent) / 0.3)" stroke="hsl(var(--cosmic-gold) / 0.5)" />
      <text x={cx} y={cy - ringR * 0.55 + 5} textAnchor="middle" fontFamily="serif" fontSize={16} fill="hsl(var(--foreground))">
        {karma.sky}
      </text>

      <text x={cx} y={cy + ringR * 0.55 + 22} textAnchor="middle" fontSize={10} fill="hsl(var(--cosmic-secondary))">
        {labels.earth ?? 'Earth'}
      </text>
      <circle cx={cx} cy={cy + ringR * 0.55} r={18} fill="hsl(var(--cosmic-accent) / 0.3)" stroke="hsl(var(--cosmic-gold) / 0.5)" />
      <text x={cx} y={cy + ringR * 0.55 + 5} textAnchor="middle" fontFamily="serif" fontSize={16} fill="hsl(var(--foreground))">
        {karma.earth}
      </text>

      {/* planets distributed around */}
      {planetOrder.map((p, i) => {
        const angle = (-Math.PI / 2) + ((i + 1) * (2 * Math.PI)) / (planetOrder.length + 1);
        const x = cx + Math.cos(angle) * ringR;
        const y = cy + Math.sin(angle) * ringR;
        return (
          <g key={p.key} className="animate-fade-in">
            <circle cx={x} cy={y} r={planetR} fill="hsl(var(--cosmic-dark) / 0.7)" stroke="hsl(var(--cosmic-gold) / 0.55)" />
            <text x={x} y={y - 4} textAnchor="middle" fontSize={14} fill="hsl(var(--cosmic-gold))">
              {p.symbol}
            </text>
            <text x={x} y={y + 12} textAnchor="middle" fontFamily="serif" fontSize={14} fill="hsl(var(--foreground))">
              {karma.planets[p.key]}
            </text>
            <text x={x} y={y + planetR + 12} textAnchor="middle" fontSize={9} fill="hsl(var(--cosmic-secondary))">
              {labels.planets?.[p.key] ?? p.key}
            </text>
          </g>
        );
      })}

      {/* center self */}
      <circle cx={cx} cy={cy} r={36} fill="hsl(var(--cosmic-gold) / 0.25)" stroke="hsl(var(--cosmic-gold))" strokeWidth={1.5} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="serif" fontSize={24} fill="hsl(var(--foreground))">
        {karma.center}
      </text>
      <text x={cx} y={cy + 50} textAnchor="middle" fontSize={10} fill="hsl(var(--cosmic-secondary))">
        {labels.center ?? 'Self'}
      </text>
    </svg>
  );
};

export default KarmaMatrixSVG;