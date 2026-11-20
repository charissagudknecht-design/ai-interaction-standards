/**
 * Waveform — 5-bar voice visualizer for the Listening state.
 *
 * Uses Framer Motion's staggered spring animation.
 * Bars oscillate scaleY between 0.2 and 1.0.
 */
import { motion } from 'framer-motion';
import { glow } from './tokens';

interface WaveformProps {
  color?: string;
  barCount?: number;
}

const delays = [0, 0.1, 0.2, 0.1, 0.15];

export function Waveform({ color = glow.rubyBerry, barCount = 5 }: WaveformProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 20 }}>
      {Array.from({ length: barCount }, (_, i) => (
        <motion.div
          key={i}
          style={{
            width: 3,
            borderRadius: 1.5,
            backgroundColor: color,
            transformOrigin: 'center',
          }}
          animate={{ scaleY: [0.2, 1.0, 0.2] }}
          transition={{
            duration: glow.waveformDuration,
            repeat: Infinity,
            delay: delays[i % delays.length],
            ease: [0.34, 1.56, 0.64, 1], // spring-like cubic bezier
          }}
          initial={{ height: 20, scaleY: 0.2 }}
        />
      ))}
    </div>
  );
}
