# 🚦 TBR Guardrails

## Roles
- **ChatGPT** = planner/architect, not the applier.  
- **Cursor** = scalpel editor, not repo surgeon.  

## Output Rules
- ChatGPT must produce one **fenced block** labeled `cursor-prompt`.  
- Inside that block:  
  - `BEGIN CURSOR PROMPT`  
  - Plan (files + purpose)  
  - Unified diff(s)  
  - Rollback instructions  
  - Changelog stub  
  - `END CURSOR PROMPT`  
- Cursor prompts must never include testing or verification commands.  
- Cursor scope is limited to ≤5 files per run.  
- ChatGPT must not alter configs, deps, lockfiles, envs, or Tailwind setup unless explicitly requested.  
- ChatGPT must not relax TypeScript strictness or invent schemas.  

## Outside the Cursor Block
ChatGPT must provide to the human developer (not Cursor):  
- Goal (one sentence)  
- Manual Verification steps  
- Risks/Side-effects  

## Style & Quality
- Preserve Tailwind classes, safelists, and configs.  
- Respect Next.js routes/layouts.  
- No repo-wide reformatting.  
- Add concise JSDoc for new exports.  
- Flag size/perf issues if >10kB gzipped or heavy deps.  

---

## Deliverable Shape (Example)

```cursor-prompt
BEGIN CURSOR PROMPT

Goal: Fix Recharts Tooltip typings

Plan:
- Touch: app/(routes)/reviews/[slug]/page.tsx – adjust prop typing
- Touch: components/Chart.tsx – fix Tooltip generics
- No other files

*** Unified Diff Starts (git apply) ***

diff --git a/components/Chart.tsx b/components/Chart.tsx
index abc123..def456 100644
--- a/components/Chart.tsx
+++ b/components/Chart.tsx
@@ -12,7 +12,8 @@
 [ ...minimal diff... ]

diff --git a/app/reviews/[slug]/page.tsx b/app/reviews/[slug]/page.tsx
index 111111..222222 100644
--- a/app/reviews/[slug]/page.tsx
+++ b/app/reviews/[slug]/page.tsx
@@ -20,6 +20,10 @@
 [ ...minimal diff... ]

*** Unified Diff Ends ***

Rollback:
- Revert these two files to prior commit

Changelog:
- fix(chart): correct Tooltip typings to prevent runtime error on /reviews

END CURSOR PROMPT


Outside block (ChatGPT → human developer):

Verification: Run npm run build, visit /reviews/m601, hover chart points; tooltip renders typed payload.

Risks: Recharts generics may still conflict; rollback if typecheck fails.