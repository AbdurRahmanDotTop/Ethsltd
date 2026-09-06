import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 420 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <image href="/logo-icon.png" x="0" y="10" width="100" height="100" />
      
      <text
        x="115"
        y="72"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="58"
        letterSpacing="0.01em"
      >
        <tspan fill="#FFFFFF">ETHS</tspan>
        <tspan fill="#00C087">LTD</tspan>
      </text>

      <text
        x="120"
        y="102"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="18"
        fill="#9CA3AF"
        letterSpacing="0.15em"
      >
        TRADE · P2P · GROW
      </text>
    </svg>
  );
}
