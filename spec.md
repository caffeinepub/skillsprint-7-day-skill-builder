# Specification

## Summary
**Goal:** Debug and fix the backend `createPlan` function in SkillSprint so that plan generation succeeds end-to-end, and improve frontend error handling to clearly surface any backend or network errors.

**Planned changes:**
- Identify and fix the root cause of the Motoko runtime trap in `backend/main.mo`'s `createPlan` logic (e.g., array index out of bounds, unhandled Option unwrap, type mismatch, or loop error) so it returns a valid `#ok` `SprintPlan` with all 7 days populated for any valid input.
- Update `frontend/src/hooks/useQueries.ts` and `frontend/src/pages/SkillInputForm.tsx` to correctly distinguish between a backend `#err` variant response and a network/call-level error, surfacing the appropriate error message to the user in each case.
- Ensure the "Generate My Sprint" button re-enables after an error so the user can retry.
- Prevent silent navigation to the PlanResults page when plan generation has failed.

**User-visible outcome:** Users can submit the SkillInputForm with any valid combination of inputs and successfully navigate to the PlanResults page. If an error does occur, a clear and specific error message is shown on the form page, and the user can retry.
