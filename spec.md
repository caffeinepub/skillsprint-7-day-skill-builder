# Specification

## Summary
**Goal:** Fix blank day-wise content in the generated 7-day sprint plan by updating both the backend generation logic and the frontend rendering.

**Planned changes:**
- Update `backend/main.mo` to populate all five fields (Objective, Action Task, Practice Exercise, Deliverable, Estimated Time) for each of the 7 days using a structured template approach, with each day having a distinct, progressively advancing theme derived from the user's inputs (skillName, hoursPerDay, skillLevel, desiredOutcome).
- Update `frontend/src/pages/PlanResults.tsx` to correctly map and render all five fields per day card, ensuring field names in JSX match the exact property names returned by the backend.

**User-visible outcome:** When a sprint plan is generated, every day card (Day 1–7) displays meaningful, non-blank content for all five labeled sections: Objective, Action Task, Practice Exercise, Deliverable, and Estimated Time.
