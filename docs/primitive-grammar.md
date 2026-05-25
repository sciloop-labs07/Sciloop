# Primitive Grammar

Primitives are reusable visual words. They are not decorative effects; each one encodes a semantic meaning.

## Required primitives

- `node`: entity or state.
- `edge`: relation or causal connection.
- `field`: distributed influence.
- `pulse`: discrete information packet.
- `flow`: continuous transfer.
- `particle_stream`: energy, money, matter, or disorder motion.
- `boundary`: constraint or threshold.
- `wave`: oscillation or propagation.
- `attractor`: convergence or gravity.
- `repulsor`: pressure or avoidance.
- `deformation`: changed space or field.
- `temporal_transition`: before/after stage change.
- `state_morph`: growth, decay, or storage.
- `signal_propagation`: signal or feedback loop.

## Global semantic mappings

```text
Energy      -> glowing particles moving source to receiver
Constraint  -> barrier or blocked path
Influence   -> field distortion or curved paths
Growth      -> expansion or higher density
Decay       -> fading or fragmentation
Feedback    -> circular pulses
Conflict    -> opposing vectors or cancellation
Entropy     -> increasing particle dispersion
Optimization-> convergence toward stable path
Stability   -> smooth low-frequency motion
Instability -> noisy oscillation
Information -> discrete pulses
Learning    -> edge thickness and backward error pulse
Money       -> token flow and value pressure
```

## Animation rules

Animations should show causality:

- Propagation: effect travels along a path.
- Diffusion: effect spreads outward and weakens.
- Attraction: path bends toward source.
- Repulsion: path bends away from source.
- Transformation: input enters converter and output exits.
- Accumulation: storage node grows.
- Dampening: amplitude decreases.
- Feedback: pulse returns to an earlier node.
- Threshold event: output changes after a variable crosses a limit.

## Performance rules

- Use Canvas for particles, fields, waves, and deformations.
- Use high contrast labels.
- Cap device pixel ratio at 2.
- Pause animation when the tab is hidden.
- Keep default demo particle counts under 800.
