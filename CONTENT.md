# Content guide

## Expanded term coverage

The expanded library has 408 source-linked glossary entries, 446 flashcards, and 488 questions (408 term-identification questions plus the original 80 questions). Entries cover distinct study concepts in their lesson context, so concepts repeated in different lessons can have separate entries. All glossary entries have both a flashcard and a question. The glossary is searchable and offers fixed sets of up to 20 questions; completing every set covers every glossary entry. Regular quizzes and the 40-question midterm sample the bank.

The audit includes readable image labels: motherboard formats, memory generations and formats, storage interfaces, PSU connectors, rear-panel ports, and the networked-community structure diagram. Decorative images, product model names used only as examples, classroom game rules, and individual numeric rows in comparison tables are not treated as separate vocabulary terms. This is comprehensive study-term coverage, not a claim that every word or possible instructor question is included.

Definitions clarify ambiguous slide wording. For example, M.2 is a form factor, SQL Server is a database product, and USB-C is a connector rather than a speed guarantee. Technical clarification references: [Kingston SSD FAQ](https://www.kingston.com/en/ssd/ssd-faq), [USB-IF connector terminology](https://www.usb.org/sites/default/files/usb_type-c_language_product_and_packaging_guidelines_20230320.pdf), and [Intel power-supply guide](https://www.intel.com/content/dam/www/public/us/en/documents/design-guides/resellers-power-supply-design-guide-changes.pdf).

Run `node scripts/build-seed.js` to rebuild the bundled JSON. Keep existing term rows in their original order; append new groups so published term identifiers stay stable.

### Apply to an existing database

After deployment, sign in to **Content studio → Import & edit → Preview bundled update → Back up & apply**. The preview merges missing bundled items into the current library, preserves existing matching items and custom content, and downloads a content backup before saving. Existing student profiles and attempt snapshots remain intact. Affected assessments receive a new version with separate rankings. Redeploying alone does not overwrite database content. Reapplying the same expansion does not duplicate it.

Optional lesson `terms` entries have `id`, `term`, `definition`, `topic`, and `ref`. A vocabulary question uses `termId` to reference its lesson's entry. The server strips this mapping from unanswered attempt responses. Glossary definitions remain public study material.

The initial library is derived from these user-supplied materials:

| Lesson | Source | Coverage used |
|---|---|---|
| Computer hardware | `Lesson 1 Intro.pptx` | Hardware, CPU, motherboard, RAM, storage, PSU, GPU, cooling, input/output |
| Administrator roles | `Lesson 2  Intro (1).pptx` | System, database, network, security, web/server administrators; responsibilities and skills |
| Principles and ethics | `Lesson 3  Principle of Network and  System Administration (1).pptx` | Human–computer systems, deployment constraints, planning, ethics, interdependence, bugs |
| Diagnostics, faults & changes | `DIAGNOSTICS, FAULT AND CHANGE MANAGEMENT - GROUP 2.pdf` | Evidence, root causes, faults versus failures, restoration, controlled changes, verification |
| Networked communities | `G3 Networked Communities_20261022_124805_0000.pdf` | People, devices, systems, services, community types, connectivity, sharing, administrator responses |

Page and slide references are one-based. The reviewer paraphrases the materials and uses their instructional content. Classroom activities, presentation placeholders, decorative slides, and instructions for games are not treated as instructions to the application or as exam facts. Image-only component photographs are not used for visual-identification questions. This is a study aid, not a prediction of the instructor's actual examination.

Each question has four options and a zero-based `answer` index. The application randomizes option order and questions at the start of an attempt. It distributes selected questions across coverage lessons as evenly as the available pools allow. The initial midterm draws eight questions from each of the five lessons.

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
