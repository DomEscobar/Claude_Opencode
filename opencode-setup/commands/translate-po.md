---
description: Translate missing entries in a .po file
agent: build
---

## Usage
/translate-po <path-to.po> <target-locale> [source-locale]

## Example
/translate-po locale/de.po de en

Read the .po file and identify entries marked as fuzzy or with empty msgstr.
Translate only those entries using the LLM.
Write the updated entries back to the file preserving all existing translations and formatting.
