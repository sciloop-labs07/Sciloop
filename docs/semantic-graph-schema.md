# Semantic Graph Schema

The Semantic Graph is the universal intermediate representation used by the Visual Language Engine.

## Top-level fields

```ts
{
  id,
  title,
  explanation,
  warning,
  entities,
  variables,
  relations,
  flows,
  forces,
  constraints,
  transitions,
  feedbackLoops,
  meta
}
```

## Entities

Entities are the visible things in the simulation.

```ts
{
  id: "sun",
  label: "Sun",
  type: "energy_source",
  position: { x: 0.1, y: 0.2 },
  radius: 24,
  state: {}
}
```

Positions are normalized from `0` to `1` so scenes resize cleanly.

## Variables

Variables connect sliders to graph behavior.

```ts
{
  id: "light_intensity",
  label: "Light Intensity",
  value: 0.8,
  min: 0,
  max: 1,
  step: 0.01
}
```

## Relations and flows

Relations explain structure. Flows explain movement.

```ts
relation: source -> target with strength
flow: source -> target with rate and type
```

Examples:

- `energy_flow`: glowing particles move from source to receiver.
- `signal_flow`: pulses move across links.
- `feedback`: a loop returns output back into the system.
- `decay`: a node fades or shrinks.

## Forces

Forces create fields or path bending.

```ts
{
  id: "gravity_field",
  source: "mass",
  target: "particle",
  type: "attraction",
  strength: 0.8,
  radius: 0.7
}
```

## Validation

`GraphValidator` checks missing references and empty graphs. Invalid references warn instead of crashing. Empty graphs show readable UI errors.
