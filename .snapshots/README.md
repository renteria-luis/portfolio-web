# Snapshots

Frozen copies of designs worth being able to return to. Nothing here is built,
imported or deployed; it exists so a past version can be recovered without
digging through history.

## hero-v1-deployed

The hero exactly as it was live on luisrenteria.me before the July 2026
redesign, captured from the deployed site at commit `12f4632`.

- `hero-v1-deployed.webp` — the deployed page, dark theme, 1300x1000
- `Hero.jsx` — the component source at that commit, byte for byte

That version was a two-column layout: terminal card on the left with `whoami`
and `cat title.txt`, headshot card on the right, the "Building end-to-end ML
systems" tagline underneath, and `./view-projects` as the primary button.

Restore it with either:

```bash
git checkout hero-v1-deployed -- src/components/Hero.jsx   # via the tag
cp .snapshots/Hero.jsx src/components/Hero.jsx             # via this copy
```

The tag `hero-v1-deployed` points at `12f4632`. Push it with
`git push origin hero-v1-deployed` so it survives losing this machine.

Note that the old file references i18n keys that later changed
(`ui.hero.viewProjects`, `personal.tagline`), so restoring it also means
restoring those strings.
