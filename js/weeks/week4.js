/* ============================================================
   WEEK 4 — "My Family" (Term 1, 6-10 Jul 2026)

   Requires js/weeks/weeks-core.js loaded first (see index.html).
   ============================================================ */

/* ------------------------------------------------------------
   STOPGAP FILE — the real Week 4 content is missing.
   ------------------------------------------------------------
   What was here before was not Week 4's actual data — it was an
   accidental duplicate of weeks-core.js, complete with its own
   `const WEEKLY_PLAN = {}` etc. Loading two files that each try
   to `const`-declare the same globals is what crashed everything
   after this file (week5.js onward, and anything in teacher.js
   that runs after the <script> tags), which is why My Day was
   showing 0 of 8 / 0.0% even for weeks that DO have real content.

   This stopgap only removes the crash. It does NOT restore Week
   4's actual "My Family" activities, competencies, day topics,
   or interactive activities — none of that data is present here
   or anywhere else in what's been reviewed so far.

   Once the real content is recovered (git history / cPanel /
   spreadsheet), replace this whole file with the real one,
   following the exact pattern in week1.js:

     WEEK_DAY_TOPICS.wk4 = { mon:{value:'...', link:'...'}, ... };
     WEEKLY_PLAN.wk4 = { welcome:{...}, story:{...}, numeracy:{...},
                          language:{...}, create:{...}, outdoor:{...},
                          tidy:{...} };
     ACTIVITY_COMPETENCIES.wk4 = { ... };
     weeksWithContent.push(4);
     INTERACTIVE_ACTIVITIES.wk4 = { ... };

   IMPORTANT: none of those five statements use `const`, `let`, or
   `var` — they all assign onto the shared objects/array that
   weeks-core.js already declared. That's the rule this file broke.

   Until that real content is back, Week 4 is deliberately left
   OUT of weeksWithContent, so it won't appear as a selectable,
   falsely-"available" week in the My Day / Daily Plan dropdowns.
   ------------------------------------------------------------ */