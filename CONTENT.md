# Content guide

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
