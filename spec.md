# Specification

## Summary
**Goal:** Replace all placeholder and dynamically generated resource URLs in the backend with a fully hardcoded, static conditional mapping of real, publicly accessible learning resources for each supported skill and day.

**Planned changes:**
- In `backend/main.mo`, replace all dynamic/placeholder resource URL logic with a static conditional mapping covering 6 supported skills (Public Speaking, Python, Excel, UI Design, Photography, Writing), each with 2–3 real resource objects (title, URL, descriptor) per day across all 7 days
- Day themes follow a fixed progression: Day 1 = fundamentals/setup, Day 2–3 = core concepts, Day 4 = practice, Day 5 = intermediate application, Day 6 = project/review, Day 7 = final assessment
- Skill level (Beginner/Intermediate/Advanced) determines which resource variant is selected when multiple variants exist for the same skill+day
- Unsupported/custom skills fall back to a generic set of real resource links (e.g., YouTube search URL, freeCodeCamp or Khan Academy links) instead of an empty array
- All URLs must be literal hardcoded strings — no string interpolation or runtime URL construction permitted
- In `backend/migration.mo`, update the upgrade migration to iterate over all stored `SprintPlans` and overwrite each day's resources array using the new fixed mapping, replacing any example.com, placeholder, or empty resource entries with real URLs

**User-visible outcome:** Users viewing their sprint plan study resources will see real, working learning links for every day of every plan, including plans created before this update.
