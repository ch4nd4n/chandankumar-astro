---
title: How I used Claude + Pi for this blog refresh
date: 2026-06-28
tags:
  - claude
  - pi
  - astro
  - workflow
excerpt: Notes on using claude.ai/design and Claude CLI for the redesign and migration, including what went wrong and how I recovered.
icon: code
---
A quick follow-up to my Gatsby → Astro migration post.

I wanted to document the workflow I used, because it was not a straight line.

## What I used

- **claude.ai/design** for the overall look refresh and design direction
- **Claude CLI** for migrating old content into the new Astro structure
- **Pi** (this coding agent workflow) to help shape and generate the final blog posts

## What worked

Using **claude.ai/design** was a good way to refresh the visual direction quickly. It helped me move from “I know this looks old” to a concrete updated look faster than doing everything from scratch.

## What did not work smoothly

For content migration, **Claude CLI** got parts wrong at first.

The turning point was pointing it to the handoff assets here:

`project/handoff`

After that, the output got better, though there was still some churn and cleanup needed. So this was not one-shot automation — more like assisted migration with iterations.

## Final publishing flow

After the design and migration passes, I used **Pi** to draft and refine the migration write-up itself (including this post).

So in a meta way: the tooling I used for the migration also helped me document it.

## TL;DR

- Design refresh: **claude.ai/design** ✅
- Content migration: **Claude CLI** (with corrections + handoff folder) ⚠️➡️✅
- Final writing/polish: **Pi** ✅

I’ll probably keep using this mixed workflow going forward: AI for speed, manual edits for taste and correctness.
