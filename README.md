# AI Interaction Standards

A reference design system for how AI should look, speak, and behave across a product's surfaces — written down so each team stops reinventing it.

## The problem

Early AI features shipped ad hoc: each team built its own prompt box, its own loading state, its own way of saying "this might be wrong." AI output sat at the same visual weight as verified data, with no consistent way to signal confidence, no shared answer for when AI should live in a sidebar versus an overlay versus inline, and no agreed color or motion language for "this is AI" versus "this is the regular product."

## The decision it unblocked

This system was built alongside a visual-identity pivot for the AI assistant — moving away from an early, colder "Teal" treatment toward a warmer "Ruby Berry" identity meant to read as a proactive partner rather than a utility bolted onto the side of the product. Writing down that decision, the reasoning behind it, and the token values, component specs, and anti-patterns that follow from it is what let other teams start building AI surfaces without re-litigating the same questions project by project.

## What's inside

- `docs/index.html` — the AI Design Hub, leading with a live four-surface playground (Assistant overlay, Copilot sidebar, Canvas, Inline widget)
- `docs/ai-foundations.html` — principles, an AI maturity model, and a decision framework for when to introduce AI into a surface
- `docs/ai-visual-language.html` — color, gradient, and iconography tokens, including the Ruby Berry rationale
- `docs/ai-components.html` — the Glow Prompt Box: states, layouts, and API
- `docs/ai-trust.html` — confidence markers, processing states, and documented anti-patterns
- `docs/components/GlowPromptBox/` — a standalone React implementation of the prompt box
- `dist/styles/zen-style.css` — the compiled base component library stylesheet these docs are built on

## A note on the data

The company name, product name, AI assistant name, and every piece of customer or business data in this repo are made up. This is a sanitized copy of a real internal project — real company and teammate names, and real customer data, have been replaced with placeholders so the design thinking could be shared without exposing anything confidential.
