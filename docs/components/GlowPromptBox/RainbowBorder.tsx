/**
 * RainbowBorder — Rotating conic-gradient border wrapper.
 *
 * Uses the CSS border-image trick: transparent border on the outer container,
 * with a conic-gradient applied via border-box / padding-box masking.
 *
 * For browsers supporting CSS Houdini (@property), the rotation is smooth
 * via --glow-angle. Fallback uses a rotating pseudo-element.
 */
import { motion } from 'framer-motion';
import { glow } from './tokens';

interface RainbowBorderProps {
  active: boolean;
  colors?: readonly string[];
  children: React.ReactNode;
  borderRadius?: string;
  glow?: string;
}

export function RainbowBorder({
  active,
  colors = glow.gradient,
  children,
  borderRadius = glow.radius,
  glow = 'none',
}: RainbowBorderProps) {
  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        position: 'relative',
        borderRadius,
        padding: glow.borderWidth,
        boxShadow: glow,
      }}
    >
      {/* Spinning gradient background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Inner content with white background */}
      <div
        style={{
          position: 'relative',
          borderRadius: `calc(${borderRadius} - ${glow.borderWidth})`,
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
