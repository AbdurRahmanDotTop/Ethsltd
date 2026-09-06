import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 460 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <image href="/logo-circle.png" x="0" y="10" width="100" height="100" />
      
      <text
        x="280"
        y="68"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="58"
        letterSpacing="0.12em"
      >
        <tspan fill="#FFFFFF">ETHS</tspan>
        <tspan fill="#00C087" dx="8">LTD</tspan>
      </text>

      <text
        x="280"
        y="102"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="22"
        fill="#9CA3AF"
        letterSpacing="0.22em"
      >
        TRADE · P2P · GROW
      </text>
    </svg>
  );
}
