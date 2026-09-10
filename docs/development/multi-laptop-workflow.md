# Multi-Laptop SciLoop Workflow

## Source of truth

GitHub is the source of truth. Do not synchronize the repository by copying the
project directory through Downloads, USB, or cloud folders.

The canonical remote is:

```text
https://github.com/sciloop-labs07/Sciloop.git
```

## Branches

- `main`: public production candidate;
- `workbench`: protected integration and preview branch;
- `codex/*`: one focused task per branch;
- `codex/migration-checkpoint`: preserved checkpoint from the original laptop.

## New laptop setup

```powershell
git clone https://github.com/sciloop-labs07/Sciloop.git
cd Sciloop
git fetch --all --prune
git switch workbench
npm run setup
```

Create local secrets from the examples. Never commit `.env.local`, `server/.env`,
or provider API keys.

## Daily routine

Before starting:

```powershell
git switch workbench
git pull --rebase origin workbench
```

For a task:

```powershell
git switch -c codex/short-task-name
```

Before pushing:

```powershell
npm run typecheck
npm run lint
npm run validate:physics
npm run build
git diff --check
git add <specific-files>
git commit -m "Describe the change"
git push -u origin HEAD
```

Merge focused branches into `workbench` first. Promote reviewed work from
`workbench` to `main` only after public browser verification.

## Separate nested repository

The local `Sciloop/` directory is a separate repository with its own remote and
working tree. It is intentionally not included in the outer SciLoop repository.
Work on it independently unless a future migration explicitly defines a safe
submodule or archive strategy.

