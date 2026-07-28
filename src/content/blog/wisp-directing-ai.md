---
title: "I shipped an app in a stack I did not know. The AI wrote the code, I made every decision."
description: "Wisp is a quit-smoking app built with AI coding tools in a stack I had never used. The interesting part is not that the AI wrote it. It is everything the AI could not decide."
date: 2026-07-18
project: wisp
tags: [AI-assisted development, React Native, Expo, TypeScript, Product design]
lang: en
readingMinutes: 10
tldr:
  - I shipped a React Native app in a stack I had never used, by directing AI coding tools. The tooling wrote the code; it decided nothing that mattered.
  - The load-bearing decision was "a slip must never wipe your history", which killed the streak counter and propagated through the adherence engine, the re-planning logic and the companion's mood.
  - The plan is a deterministic rule engine, never an LLM at runtime, so the app makes zero network calls and every number it shows can be explained and tested.
tldrMetrics:
  - Commits = 95
  - TypeScript files = 140
  - Test files = 21
  - Network calls = 0
---

Wisp is a quit-smoking companion. Fully offline, no account, no backend, no telemetry, no network calls at all. 95 commits, 140 TypeScript files, 21 test files, CI green. Expo and React Native, a stack I had never touched before starting.

The easy story is "AI wrote my app". It is also wrong, and it undersells the part that was actually hard.

![Wisp: the home screen, with the companion reflecting how the week is going](/writeups/wisp-home.webp)

## What the model could not decide

I gave the AI a stack it knew far better than I did. What I could not hand over was the answer to any of these:

- Should the app impose one quitting philosophy, or route people onto different tracks?
- What happens to a user's progress when they slip?
- What does the companion creature do, and why does it exist at all?
- Should the personalised plan come from an LLM at runtime?
- How does a first-time user learn the app without being lectured?
- Should there be sound?

Every one of those is a product decision. Ask a model to make them and you get a plausible average of every quit-smoking app in its training data, which is exactly the app I did not want to build. The model is excellent at "implement this reduction curve in TypeScript with these tests". It has no opinion on whether the curve should exist.

**Directing an AI well is mostly a specification problem.** The clearer the decision, the better the code. Vague direction produces confident, generic output, and generic is worse than wrong because it looks finished.

## The decisions

### A slip must never wipe your history

![The progress screen: a trend line rather than a streak counter](/writeups/wisp-progress.webp)
*No streak counter anywhere. Progress is a trend, so one bad evening bends the line instead of deleting it.*

Almost every habit app is built on a streak counter. Streaks are motivating right up until you break one, at which point the app punishes you with a reset, and one bad evening becomes a reason to stop opening the app entirely. The mechanic that drives engagement is the same one that causes abandonment at the worst possible moment.

So Wisp has no streak. Progress is anchored on a **rolling trend**: adherence is computed over a window, and one bad day moves the line slightly instead of deleting it. The plan re-plans around you rather than declaring you failed.

This is one design rule and it propagated through the whole codebase: the adherence engine, the re-planning logic, the companion's mood, the progress chart. None of that follows from "build a quit-smoking app". All of it follows from *"a slip must never wipe your history"*.

### Two tracks, not one

![The plan screen: today's allowance, the week ahead and the full journey](/writeups/wisp-plan.webp)

Most quit apps pick a philosophy. Cold turkey or gradual reduction, and if you are the other kind of smoker, the app is not for you.

Wisp runs a short onboarding that assigns a track from consumption, dependence and readiness, then builds a dated plan for that track. You can override the suggestion, because a rule engine that will not let you disagree with it is just a lecture.

### The plan is a rule engine, never an LLM

This is the decision I would defend hardest, and it is the one that sounds most backwards in 2026.

The obvious build is: send the onboarding answers to an LLM, get a personalised plan back. It would have taken an afternoon and it would have demoed beautifully.

I wrote a deterministic, fully tested rule engine instead. Reasons, in order:

**Privacy.** An LLM call means the data leaves the device. The data here is how much someone smokes, when they crave, what triggers them, and how they feel about it. That is medical-adjacent and deeply personal. The strongest privacy guarantee is not a policy, it is **an app that makes no network calls at all**, which you can verify by putting the phone in airplane mode and watching it keep working.

**Offline.** Cravings do not wait for signal. An app that needs connectivity to tell you today's allowance is broken on the subway.

**Explainability.** When Wisp says today's allowance is 9, that number came from a formula I can point at. An LLM would produce a number I could only justify with "the model said so". For something a person is trusting with a health goal, that is not good enough.

**Testability.** A deterministic engine can be tested. That is why there are 21 test files. You cannot write an assertion against a language model's opinion of a reduction curve.

The lesson generalises past this app: **knowing when not to use an LLM is a skill.** The default in 2026 is to reach for one, and a lot of the time it buys you a demo and costs you the guarantees.

### The tutorial runs on a fake world

A guided tour that only points at buttons teaches nothing. A guided tour that makes you tap real buttons pollutes your real data with tutorial noise on day one, and then your first chart is a lie.

Wisp's 16-step tour runs against a **throwaway sandbox world**. The user really taps Log, really watches the cigarette land in the chart, really resists a craving and really sees the companion react. When the tour ends, the sandbox is discarded and their actual history starts empty.

This took meaningfully longer than a tooltip overlay. It is also the difference between a user who has read about the app and a user who has used it.

### Silence, on purpose

![The craving toolkit: guided breathing, a wait-it-out timer and distractions](/writeups/wisp-craving.webp)

No sound. Haptics only.

People use this app in situations where a notification chime is the last thing they want: at work, at a bar, standing outside with the people they are trying not to smoke with. A quit-smoking app that announces itself audibly is an app you close in public.

### The companion earns its place

The companion's mood and health track actual behaviour. Not a decoration, a feedback surface. Progress becomes something you feel before you read it off a chart.

Underneath it there is a coin economy that rewards smoke-free **duration** exponentially rather than paying per logged event. Paying per event rewards opening the app; paying for duration rewards the thing the app exists for. Those are not the same incentive, and getting it backwards would have produced an app that is fun to check and useless to use.

## What the AI was genuinely good at

I do not want to undersell the tooling either. In a stack I did not know, it collapsed the cost of the boring 80%:

- Boilerplate: navigation, typed stores, form plumbing.
- Idiom translation. I could describe what I wanted in terms I understood and get it back in React Native conventions I had not learned yet.
- Test scaffolding once I had specified what the behaviour should be.
- Refactors across many files, reliably, which is where I would have made mistakes by hand.

What it did not do was tell me the streak counter was a bad idea. That constraint came from thinking about the person on the other end, having a bad Tuesday, deciding whether to open the app.

## The honest summary

If I claimed I wrote every line, that would be false. If I claimed the AI built the app, that would be more false, and it would give away the only part worth putting on a portfolio.

The code is the cheap part now. What is left, and what got harder rather than easier, is knowing what to build, what to refuse to build, and which constraints are non-negotiable. Wisp works offline because I decided it must, not because a model suggested it. The rule engine is deterministic because I chose reliability over the impressive demo.

The tooling made me faster in an unfamiliar stack. It did not make a single decision that mattered.

---

*Source: [github.com/renteria-luis/wisp](https://github.com/renteria-luis/wisp)*
