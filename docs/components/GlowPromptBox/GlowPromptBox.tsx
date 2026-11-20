/**
 * GlowPromptBox — React + Framer Motion implementation of the Glow AI
 * Prompt Box for design system.
 *
 * Dependencies: react, framer-motion
 * Optional: tailwindcss (class names noted in comments)
 *
 * Usage:
 * ```tsx
 * <GlowPromptBox
 *   state="idle"
 *   size="large"
 *   onSubmit={(value) => console.log(value)}
 * />
 * ```
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glow } from './tokens';
import { RainbowBorder } from './RainbowBorder';
import { Waveform } from './Waveform';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PromptState = 'idle' | 'typing' | 'generating' | 'listening';
type PromptSize = 'large' | 'small';

interface GlowPromptBoxProps {
  state: PromptState;
  size?: PromptSize;
  placeholder?: string;
  value?: string;
  streamingText?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  accentColor?: string;
}

// ---------------------------------------------------------------------------
// Sparkle Icon SVG (from Figma export)
// ---------------------------------------------------------------------------

function SparkleIcon({ size = 24, color = glow.rubyBerry }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M14.19 3.45l1.08 2.89a4.5 4.5 0 002.38 2.38l2.9 1.07c.6.22.6 1.07 0 1.29l-2.9 1.07a4.5 4.5 0 00-2.38 2.38l-1.08 2.89c-.22.6-1.07.6-1.29 0l-1.07-2.89a4.5 4.5 0 00-2.39-2.38l-2.9-1.07c-.6-.22-.6-1.07 0-1.29l2.9-1.07a4.5 4.5 0 002.39-2.38l1.07-2.89c.22-.6 1.07-.6 1.29 0z"
        fill={color}
      />
      <path
        d="M6.73 14.98l.33.89c.18.5.58.89 1.08 1.08l.89.33c.49.18.49.87 0 1.05l-.89.33c-.5.18-.9.58-1.08 1.08l-.33.89c-.18.49-.87.49-1.05 0l-.33-.89a1.87 1.87 0 00-1.08-1.08l-.89-.33c-.49-.18-.49-.87 0-1.05l.89-.33c.5-.18.9-.58 1.08-1.08l.33-.89c.18-.49.87-.49 1.05 0z"
        fill={color}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Arrow / Stop / Mic Icons
// ---------------------------------------------------------------------------

function ArrowIcon({ size = 24, color = glow.neutralGray }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 16V4M5 9l5-5 5 5" />
    </svg>
  );
}

function StopIcon({ size = 24, color = glow.rubyBerry }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={1.5}>
      <rect x={5} y={5} width={10} height={10} rx={2} />
    </svg>
  );
}

function MicIcon({ size = 24, color = glow.rubyBerry }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x={7} y={2} width={6} height={10} rx={3} />
      <path d="M4 10v0a6 6 0 0012 0v0" />
      <line x1={10} y1={16} x2={10} y2={19} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function GlowPromptBox({
  state,
  size = 'large',
  placeholder = 'Ask Glow a question...',
  value = '',
  streamingText = '',
  onChange,
  onSubmit,
  onStop,
  onVoiceStart,
  onVoiceEnd,
  accentColor = glow.rubyBerry,
}: GlowPromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(value);
  const [isBuffering, setIsBuffering] = useState(false);

  const isLarge = size === 'large';
  const iconSize = isLarge ? glow.iconSize.large : glow.iconSize.small;
  const minH = isLarge ? glow.minHeight.large : glow.minHeight.small;
  const showRainbow = !isBuffering && (state === 'generating' || state === 'listening');
  const showGlow = isLarge;

  // Buffer: solid accent for 150ms before rainbow starts
  useEffect(() => {
    if (state === 'generating' || state === 'listening') {
      setIsBuffering(true);
      const timer = setTimeout(() => setIsBuffering(false), glow.buffer);
      return () => clearTimeout(timer);
    }
    setIsBuffering(false);
  }, [state]);

  // Auto-expand textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, parseInt(glow.maxHeight))}px`;
    }
  }, [internalValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.(internalValue);
      }
      if (e.key === 'Escape') {
        setInternalValue('');
      }
    },
    [internalValue, onSubmit],
  );

  const handleAction = useCallback(() => {
    if (state === 'idle' || state === 'typing') onSubmit?.(internalValue);
    if (state === 'generating') onStop?.();
    if (state === 'listening') onVoiceEnd?.();
  }, [state, internalValue, onSubmit, onStop, onVoiceEnd]);

  // Border color logic
  const borderColor =
    isBuffering ? accentColor :
    state === 'idle' ? 'rgba(0,0,0,0.12)' :
    state === 'typing' ? accentColor :
    'transparent';

  // Action icon color
  const actionColor = state === 'idle' ? glow.neutralGray : accentColor;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: minH,
        borderRadius: showRainbow ? `calc(${glow.radius} - ${glow.borderWidth})` : glow.radius,
        border: showRainbow ? 'none' : `${glow.borderWidth} solid ${borderColor}`,
        backgroundColor: '#fff',
        overflow: 'hidden',
        transition: `border-color ${glow.transitionDuration}ms ease-out`,
        boxShadow: showGlow && !showRainbow ? glow.glow.large : 'none',
      }}
    >
      {/* Input Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: isLarge ? glow.padding.large.input : glow.padding.small.input,
        }}
      >
        {/* Sparkle */}
        <motion.div
          animate={state === 'idle' ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={state === 'idle' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          <SparkleIcon size={iconSize} color={accentColor} />
        </motion.div>

        {/* Text / Waveform / Stream */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {(state === 'idle' || state === 'typing') && (
            <textarea
              ref={textareaRef}
              value={internalValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'Lato, sans-serif',
                fontSize: 16,
                lineHeight: '24px',
                letterSpacing: '0.16px',
                color: glow.textPrimary,
                background: 'transparent',
                maxHeight: glow.maxHeight,
                overflowY: 'auto',
              }}
            />
          )}

          {state === 'generating' && (
            <div
              style={{
                fontSize: 16,
                lineHeight: '24px',
                letterSpacing: '0.16px',
                color: glow.textPrimary,
                fontFamily: 'Lato, sans-serif',
                maxHeight: `calc(${glow.maxHeight} - 40px)`,
                overflowY: 'auto',
              }}
            >
              {streamingText || placeholder}
            </div>
          )}

          {state === 'listening' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  flex: 1,
                  fontSize: 16,
                  lineHeight: '24px',
                  letterSpacing: '0.16px',
                  color: glow.textGhost,
                  fontFamily: 'Lato, sans-serif',
                }}
              >
                I'm listening...
              </span>
              <Waveform color={accentColor} />
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isLarge ? glow.padding.large.toolbar : glow.padding.small.toolbar,
        }}
      >
        {/* Plus / Stop (left) */}
        <button
          onClick={state === 'listening' ? onStop : undefined}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: glow.neutralGray,
            fontSize: 20,
            fontWeight: 300,
            padding: 0,
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Add context"
        >
          {state === 'listening' ? (
            <StopIcon size={iconSize - 4} color={glow.neutralGray} />
          ) : (
            '+'
          )}
        </button>

        {/* Action (right) */}
        <button
          onClick={handleAction}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0,
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={
            state === 'generating' ? 'Stop' :
            state === 'listening' ? 'Microphone' :
            'Send'
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            >
              {(state === 'idle' || state === 'typing') && (
                <ArrowIcon size={iconSize} color={actionColor} />
              )}
              {state === 'generating' && (
                <StopIcon size={iconSize} color={actionColor} />
              )}
              {state === 'listening' && (
                <MicIcon size={iconSize} color={actionColor} />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  // Wrap in RainbowBorder when generating or listening
  if (showRainbow) {
    return (
      <RainbowBorder
        active
        glow={showGlow ? glow.glow.large : 'none'}
      >
        {content}
      </RainbowBorder>
    );
  }

  return content;
}
