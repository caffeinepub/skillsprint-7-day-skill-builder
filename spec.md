# Specification

## Summary
**Goal:** Fix the Bonus Resource links in SkillSprint so they use real, working HTTPS URLs instead of placeholder/example.com domains.

**Planned changes:**
- In `backend/main.mo`, replace the bonusResource URL generation logic with a hardcoded lookup table of verified, real public HTTPS URLs (e.g., Wikipedia, MDN, YouTube, freeCodeCamp) keyed by skill name, ensuring every generated plan returns a valid, reachable URL and an accurate title.
- In `frontend/src/pages/PlanResults.tsx`, bind the Bonus Resource anchor's `href` to `bonusResource.url`, add `target="_blank"` and `rel="noopener noreferrer"`, and hide the Bonus Resource card entirely if the URL is missing or empty.
- In `frontend/src/components/DownloadPdfButton.tsx`, update the PDF template to display the `bonusResource.title` and its URL as visible text in the PDF output.

**User-visible outcome:** The Bonus Resource link opens a real, publicly accessible webpage in a new tab without any "site cannot be reached" errors, and the downloaded PDF also shows the valid URL.
