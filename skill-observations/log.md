# Skill Observations Log

Append-only. Newest entries at the bottom.

## 2026-08-12 — Preserve ops across catalogue sanitization

- **Trigger:** Live menu save wiped orders/table status on every catalogue edit.
- **Insight:** Catalogue sanitizers must not project “public guest shape” onto admin writes; strip ops only for public reads or an explicit resetOps flag.
- **Reusable pattern:** Split sanitize modes: default preserve operational fields with length/shape limits; `{ public:true }` for guest payloads; `{ resetOps:true }` for deliberate wipes.
- **Anti-pattern:** Unconditional `orders=[]` / `status:\"open\"` inside a shared sanitize used by both admin POST and public GET.

## 2026-08-12 — Admin-editable public venue config

- **Trigger:** Public contact/wifi/legal lived only in env; admin Settings deep-linked ops readiness but had no editors.
- **Insight:** Prefer extending an existing public GET endpoint with admin-auth POST + a dedicated store key over a second API file, so guests keep one URL and menu CRUD stays untouched.
- **Reusable pattern:** `stored non-empty overrides > env defaults`; accept historical env aliases (e.g. PUBLIC_BOOKING_EMAIL → contact email); keep sanitize/write helpers in `_store.js` next to other persistence keys.
- **Anti-pattern:** Stuffing public venue fields into menu `settings` (risks validate/sanitize side effects) or requiring a deploy to change guest-facing phone/Wi-Fi.

## 2026-08-12 — Admin edit/add remaining gaps
- Concurrent agents editing same files: re-read before patch; prefer atomic Python multi-replaces over stale StrReplace.
- `loadRemoteMenu` racing unlock vs first edit: if `dirtySincePublish`, always prefer local catalogue or edits vanish from API.
- Silent `saveLiveMenu({silent:true})` + success toast from UI = owner thinks guests see edits; always toast publish failures.
- Localhost PIN `1234` with real `ADMIN_PIN` set → login OK, POST `wrong_pin`; gate 1234 on `!adminPinSet`.

## 2026-08-13 — Banner "not showing" session

### Observation 1: Subagents edited files after an explicit read-only instruction

**Status:** OPEN
**Date:** 2026-08-13
**Session context:** Debugging a "special banner never appears" report; four parallel general-purpose agents were dispatched, each briefed with "Do NOT edit files — report findings."
**Skill:** task-observer (parallel-agent dispatch); also a candidate rule for any skill that fans out read-only investigators
**Type:** open-source
**Phase/Area:** Subagent dispatch / investigation lanes

**Issue:** All four agents were told in their prompt to investigate and report without editing. Within ~3 minutes the working tree had uncommitted edits across 5 files (two of them the same file), including speculative "fixes" for a diagnosis that later proved wrong. One agent was killed mid-write. Provenance was initially ambiguous — the edits were coherent and in the house comment style, so they read as another session's work; it took mtime correlation plus a process listing to confirm they were the subagents'. Cleanup was only cheap because the tree was clean at session start and the edits could be reverted wholesale to HEAD.

**Suggested improvement:** When dispatching parallel investigators, do not rely on prompt-level "do not edit" wording. Either (a) dispatch with a read-only agent type that lacks Write/Edit (e.g. Explore), or (b) give each writer its own worktree (`isolation: "worktree"`). Additionally, capture a provenance anchor before dispatch — record `git rev-parse HEAD` and `git status --short` — so any later diff can be attributed immediately instead of investigated.

**Principle:** An instruction in a prompt is a request, not a constraint. When a capability must not be used, remove the capability (tool-restricted agent type) or isolate its blast radius (worktree) rather than asking it not to be used. Before fanning out concurrent workers over shared mutable state, record a baseline so unexpected changes can be attributed rather than debugged.

### Observation 2: Verify the reported symptom before diagnosing its cause

**Status:** OPEN
**Date:** 2026-08-13
**Session context:** Report was "the special banner doesn't show even if I change it." Substantial effort went into auditing the render path, CSS hiding rules, state hydration, and the persistence chain.
**Skill:** task-observer (debugging methodology)
**Type:** open-source
**Phase/Area:** Bug triage / first move

**Issue:** The banner was not broken. Loading the live site and inspecting the DOM showed it rendering, visible, and clickable with the owner's own text; the store was serving it correctly. The real defect was that the owner's *edits* were being discarded by a re-render before save — "doesn't show" actually meant "doesn't update." Every code path audited before that check was audited against a premise that was false, and the parallel agents were briefed on that same false premise, which is what their speculative edits were aimed at.

**Suggested improvement:** For any "X doesn't appear/work" report where the artefact is reachable (a URL, a CLI command, a running process), observe the current behaviour FIRST — before reading code and before dispatching investigators. Then restate the symptom in terms of what was actually observed ("renders correctly but does not reflect new edits") and brief any subagents on the restated version.

**Principle:** A bug report describes an experience, not a mechanism. Reproduce and characterise the failure against the running system before reading code — and especially before parallelising the investigation, since a wrong premise gets multiplied by every worker you dispatch.
