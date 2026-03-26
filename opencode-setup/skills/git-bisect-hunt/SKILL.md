---
name: git-bisect-hunt
description: >
  Use when tracking down regressions or bugs using git bisect.
  Triggers on: "git bisect", "regression", "find the bad commit", "regression hunting",
  "which commit broke", "bisect", "git blame", "git log", "blame", "regression test",
  "broken since", "last working commit", "first failing commit", "git log --since",
  "git diff", "git show", "git stash", "cherry-pick", "revert".
---

# Git Bisect Hunt Skill

## Decision Tree — What Do You Know?

```
You know WHICH test/behavior is broken, but not WHEN or WHY?
  → Go to: BISECT_WORKFLOW

You know roughly WHEN it broke (date range)?
  → Go to: LOG_BASED_HUNT

You need to understand who changed what and why (blame)?
  → Go to: GIT_BLAME_GUIDANCE

You found a bad commit and need to decide: revert vs fix?
  → Go to: REVERT_DECISION
```

---

## BISECT_WORKFLOW

### The game plan:
```
git bisect = binary search through git history
Best case: log₂(N) tests to find the bad commit
  100 commits → 7 tests
  1000 commits → 10 tests
  10000 commits → 14 tests
```

### Step-by-step:
```bash
# 1. Start bisect session
git bisect start

# 2. Tell it a known BAD commit (current HEAD — it's broken here)
git bisect bad HEAD

# 3. Tell it a known GOOD commit (where it worked)
git bisect good v2.3.0
# or: git bisect good abc1234  # any commit hash you know worked

# 4. Git checks out a commit in the middle of the range
#    Run your test / check your behavior

# 5. After testing, mark result:
git bisect good    # if the bug is NOT present in this commit
git bisect bad     # if the bug IS present in this commit

# 6. Repeat steps 4-5 until git finds the first bad commit
#    git will output something like:
#    "abc1234 is the first bad commit"

# 7. You're done — exit bisect
git bisect reset   # returns to original HEAD
# OR: git bisect reset HEAD~5  # checkout a specific commit to investigate
```

### Automated bisect (no manual testing):
```bash
# Write a script that returns 0 (good) or non-zero (bad)
git bisect start
git bisect bad HEAD
git bisect good v2.3.0
git bisect run ./test-regression.sh
# Runs automatically, returns the bad commit
```

### Example automated test script:
```bash
#!/usr/bin/env bash
# test-regression.sh — returns 0 if bug NOT present, 1 if bug IS present
set -euo pipefail

# Build the project (or skip if already built)
if [[ ! -f "dist/myapp" ]]; then
    make build >/dev/null 2>&1
fi

# Run the specific test that reproduces the bug
./dist/myapp process --input test/fixtures/edge-case.csv > /tmp/output.json 2>&1

# Check if the output contains the expected result (bug: missing "total" field)
if grep -q '"total":' /tmp/output.json; then
    echo "GOOD: Bug NOT present — total field found"
    exit 0
else
    echo "BAD: Bug IS present — total field missing"
    exit 1
fi
```

### Narrowing the range faster:
```bash
# If you know it worked in January and broke in March:
git log --oneline --since="2024-01-01" --until="2024-03-01" | wc -l
# count = ~500 commits

# Start bisect with a narrower window:
git bisect start
git bisect bad HEAD
git bisect good abc123  # the January commit closest to HEAD

# If git history is long (>1000 commits between good and bad):
# First narrow manually with git log until you're within ~50 commits
git log --oneline v2.0.0..HEAD | tail -30  # find an intermediate good point
git bisect good intermediate-good-commit
```

---

## LOG_BASED_HUNT

### When you know roughly when it broke:
```bash
# Find commits that touched the relevant code in the suspect timeframe
git log --oneline --since="2024-02-01" --until="2024-02-15" -- src/checkout/
git log --oneline --since="2024-02-01" --until="2024-02-15" --after="2024-02-14 12:00"

# Find commits that mention the bug type in message
git log --oneline --grep="refactor" --after="2024-02-01"
git log --oneline --grep="performance" --after="2024-02-01"

# Find commits that touched a specific file that might have caused it
git log --oneline --after="2 weeks ago" -- src/order/
git log --oneline --after="2 weeks ago" -p -- src/order/total.py
# The -p flag shows the diff — look for changes that could cause the regression

# Show files most changed in the suspect window (likely caused the issue)
git log --oneline --since="1 week ago" --stat | sort -k5 -h | tail -20
```

### Pattern-based log filtering:
```bash
# Show only merge commits (sometimes regressions come from merged branches)
git log --oneline --merges --since="2 weeks ago"

# Find commits that deleted or renamed critical files
git log --oneline --diff-filter=D --since="2 weeks ago"
git log --oneline --diff-filter=R --since="2 weeks ago"

# Show commits that changed more than N lines (big changes = likely cause)
git log --oneline --shortstat --since="2 weeks ago" | awk '/^[[:space:]]*[0-9]+ files/{f=$0} /[0-9]+ insertions/{i=$0} /[0-9]+ deletions/{d=$0; print f i d}' | sort -k4 -h | tail -10
```

---

## GIT_BLAME_GUIDANCE

### Use blame strategically (not emotionally):
```
git blame shows WHO changed each line, not WHY it was changed.
Use it to:
  1. Find who to ask about a piece of code
  2. See when a line was last changed (to find which commit to bisect)
  3. NOT to assign blame — that creates a culture of fear

If you use blame to find who to blame → you're doing it wrong.
If you use blame to find who to ask → you're doing it right.
```

### Practical blame usage:
```bash
# Who last changed this function?
git blame src/order/total.py | grep calculate_total

# See the commit that introduced this line (ignoring "moved lines" noise)
git blame -w src/order/total.py  # -w ignores whitespace changes

# Blame with history (what did this look like in v2.0?)
git blame v2.0.0 -- src/order/total.py

# Show blame for lines that were REMOVED (not just current state)
git blame -L '/def calculate_total/,/^[^ ]/' src/order/total.py

# Combine with log: who changed this in the last 30 days?
git log --since="30 days ago" --oneline -- src/order/total.py
git blame --since="30 days ago" -- src/order/total.py | head -20
```

### Ignoring certain commits (blame is noisy after mass formatting):
```bash
# Ignore mass-reformatting commits (large style changes)
git blame --ignore-rev 3a4b5c6d src/order/total.py
# Can be made permanent with: git config blame.ignoreRevsFile .git-blame-ignores.txt

# .git-blame-ignores.txt example:
# 3a4b5c6d  # Automated code formatter run
# a1b2c3d4  # Linter fixes
# 9f8e7d6c  # Pre-commit hook formatting
```

---

## REVERT_DECISION (bad commit found — what now?)

### Decision tree:
```
Is the commit already deployed to production?
  YES:
    → Can you hotfix it without reverting? (preferred if fast)
    → If not: revert first, hotfix second
    → Check if revert is safe (were there dependent commits after?)
    NO (only in development):
    → Can you fix forward? (preferred — preserves history)
    → If yes: fix in next commit
    → If not: revert

How many commits are AFTER the bad commit?
  1-2 commits: revert is usually safe
  > 5 commits: reverting may be painful, fix forward or cherry-pick

What's the risk of the bad commit staying in history?
  High (security, data corruption): MUST revert + rewrite history
  Medium (bug in feature): revert + note in changelog
  Low (cosmetic, small bug): fix in next release
```

### How to revert safely:
```bash
# Simple revert (creates a new commit that undoes the bad one)
git revert abc1234
git push
# This is SAFE — doesn't rewrite history, just adds a compensating commit

# Revert a merge commit (need to specify parent)
git revert -m 1 abc1234  # -m 1 means "main" parent
git revert -m 2 abc1234  # -m 2 means the "other" parent (branch that was merged)

# Revert a RANGE of commits (multiple bad commits)
git revert abc1234..def5678
# You may get conflicts — resolve them, git add, git rebase --continue

# After reverting: always verify
git log --oneline -5
git diff HEAD~1..HEAD  # review the revert commit
make test  # run tests
```

### Fix forward (if you choose not to revert):
```bash
# Add a commit that fixes the issue — don't delete the bad commit
# This preserves history for git blame / bisect
git checkout abc1234  # the bad commit (don't panic — you already pushed right?)

# Fix the issue locally
vim src/buggy_file.py
git add src/buggy_file.py
git commit -m "fix: correct off-by-one error in calculate_total

The bug was introduced in abc1234. The issue: when processing
orders with exactly 100 items, the loop counter exceeded the
array bounds. This adds a bounds check before the loop.

Reported-by: customer-support case #1234
Fixes: JIRA-4567"

git push origin your-branch
# Open PR for review
```

### When to do a hard reset (history rewrite):
```
NEVER do this on main/master
ONLY do this on a feature branch before PR is merged
ONLY if: the commit hasn't been shared, is deeply wrong, and revert is impractical

Procedure:
  git checkout your-feature-branch
  git log --oneline -5  # confirm you're on the right branch
  git reset --hard abc1234  # go back to the last good commit
  # Rewrite history, re-run tests, force push (your branch only!)
  git push --force origin your-feature-branch
  # IMPORTANT: tell your team to re-clone, their copies are now stale
```

---

## BISECT GOTCHAS

```
1. The bug might not reproduce in older commits (dependency mismatch)
   → Fix: use make build before each test in automated bisect
   → Fix: install correct dependency version for each commit

2. You marked the wrong commit as good/bad
   → Fix: git bisect reset && git bisect start && try again

3. The commit range is too large (>10,000 commits)
   → Fix: narrow with git log first, find intermediate good/bad points

4. The bug is in a dependency, not your code
   → Fix: git submodule update --init before testing
   → Fix: pin dependency to known-good version

5. Your test script has false positives (sometimes fails, sometimes passes)
   → Fix: run test 3 times in a row, if it passes all 3 times → mark good
   → Fix: git bisect skip (marks commit as untestable, tries another)
```

### Bisect skip — handling untestable commits:
```bash
# If a commit can't be built/tested (e.g., syntax error in that commit)
git bisect skip

# Skip a range of commits (e.g., commits 5-8 that all fail to build)
git bisect skip 5..8

# Note: skipping too many commits can make bisect inconclusive
# If you skip too much: git bisect log to review your skips
```
