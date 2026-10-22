# Content guide

## Fixed source wording

The library contains **410 distinct terms and 410 fixed questions** from the five supplied materials. Each term has one canonical question, reused when the term appears in more than one lesson. Combined quizzes and exams include that question only once. Quiz 1 has 134 questions, Quiz 2 has 157, Quiz 3 has 127, and the midterm has all 410. Bundled assessments are untimed; saved attempts can be resumed for seven days.

Text questions use an original source excerpt with only the answer span (and explicit equivalent names, where necessary) replaced by `_____`. Wording and sentence order are retained. Extraction whitespace is normalized; spaced PDF letters are joined back into words. Source spelling, historical terminology, and source errors are retained rather than silently corrected. Table entries are transcribed as labels and cell values in source order. A diagram-only term uses one fixed image identification question. The browser displays a window onto the unchanged source image without its answer label; it does not generate a new illustration or definition.

The reviewer notes contain the source text by page or slide. Glossary entries and flashcard answers quote the same source excerpt used by their question. Original slide/page references remain visible. Generic question instructions and navigation labels are application text, not quotations from the materials.

Materials: `Lesson 1 Intro.pptx`, `Lesson 2  Intro (1).pptx`, `Lesson 3  Principle of Network and  System Administration (1).pptx`, `DIAGNOSTICS, FAULT AND CHANGE MANAGEMENT - GROUP 2.pdf`, and `G3 Networked Communities_20261022_124805_0000.pdf`. Readable diagram labels are included. Decorative artwork, example CPU product model names, presenter names, and classroom game instructions are excluded as study terms. Previously inferred terms without a literal source label were replaced with the wording actually used in the source.

### Rebuilding and future coverage

Run `node scripts/build-seed.js`. `data/source-text.json` holds normalized text and image-label transcriptions. `data/source-terms.json` holds the selected exact excerpts and source image windows. `scripts/build-source.js` validates that each excerpt occurs in its source, merges repeated terms, and produces the single-question bank. Stable term IDs are hashes of the canonical term. Original source images are under `public/source-images/`.

An assessment with `selection: "all"` includes every question in its coverage and recalculates its count when content is saved. This is the default for new quizzes, midterms, and finals created in the studio. A question's `lessonIds` lists every lesson in which it is covered; `lessonId` identifies its quoted source. Existing custom questions without `lessonIds` still use their original lesson. Optional short practice sets remain available, and numbered term sets cover every term in groups of up to 20. Randomization changes ordering only, never question wording.

### Updating an existing database

After deployment, sign in to **Content studio → Import & edit → Preview bundled update → Back up & apply**. This replaces the previous bundled paraphrases and questions with the source-worded bundle. Custom additions are preserved, but edits to bundled entries are replaced; a JSON backup downloads before applying. Existing profiles and attempt snapshots are retained. Changed assessments get new versions and separate rankings. Redeployment alone does not change Aiven content. Reapplying the same bundle is idempotent.

Optional lesson `terms` entries have `id`, `term`, `definition` (the original excerpt), `topic`, and `ref`. Vocabulary questions use `termId`; the server removes this answer mapping from unanswered attempt responses. Public glossary content remains available as study material.

## Content pack format

```json
{
  "schemaVersion": 1,
  "subjects": [{"id":"example","title":"Example subject","code":"EX","description":"Study description"}],
  "lessons": [{
    "id":"example-lesson",
    "subjectId":"example",
    "title":"Lesson title",
    "kicker":"LESSON 01",
    "source":"Lesson 1.pdf",
    "description":"Short lesson summary",
    "published":true,
    "notes":[{"title":"Main idea","body":"Explanation","ref":"Page 2"}],
    "flashcards":[{"front":"Recall prompt","back":"Answer","ref":"Page 2"}]
  }],
  "questions": [{
    "id":"example-q1",
    "lessonId":"example-lesson",
    "topic":"Main idea",
    "prompt":"Question text?",
    "options":["Correct answer","Distractor B","Distractor C","Distractor D"],
    "answer":0,
    "explanation":"Why the correct answer fits the material.",
    "ref":"Page 2",
    "difficulty":"foundation"
  }],
  "assessments": [{
    "id":"example-quiz",
    "subjectId":"example",
    "title":"Quiz 1",
    "type":"quiz",
    "coverage":["example-lesson"],
    "count":1,
    "minutes":5,
    "maxAttempts":0,
    "published":true,
    "version":1
  }]
}
```

IDs must be unique lowercase letters, digits, and hyphens, starting with a letter or digit. Keep existing IDs stable when editing content. Assessment types are `quiz`, `midterm`, and `final`. Version numbers are managed by the server on import; do not manually increment them.

The current unit of coverage is a lesson. For topic-level selection, create smaller lesson entries named after the individual topics. Later automatic PDF/PPTX processing can emit this same format without changing the quiz engine.

## Future material workflow

Ask for a new content pack in chat using the exported current JSON and the new materials. Include source references, plausible distractors, explanations, and all existing content to retain. Review the content, export a backup, then import the complete updated pack in the content studio. The server validates cross-references and question counts before saving anything.
