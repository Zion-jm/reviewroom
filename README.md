# Reviewroom

A mobile-first study site for a class: reusable subjects and lessons, source-based notes and flashcards, quizzes, midterms, final exams, saved profiles, and a shared leaderboard.

**Deployment:** GitHub → Render Node web service → Aiven PostgreSQL.

## What is included

- Five lessons prepared from the supplied course materials.
- 38 flashcards and 80 multiple-choice questions, with explanations and source slide/page references.
- Quiz 1 (hardware, 12 questions), Quiz 2 (roles and principles, 20), Quiz 3 (diagnostics and communities, 20), and a 40-question midterm covering all five lessons.
- Custom practice with immediate answer checks; ranked assessments reveal explanations after submission.
- One question per screen, large answer targets, mobile bottom navigation, responsive notes and rankings.
- Display-name profiles, persistent HttpOnly sessions, and private recovery codes for returning on another device.
- Server-side scoring, saved answers, fixed server deadlines, resumable attempts, and per-assessment/per-version rankings.
- Administrator studio to add subjects, lessons, questions, and assessments; select coverage; publish/unpublish; import/edit/export JSON; export results.
- JSON content validation and automatic version changes when assessment rules or question content changes.
- SQLite for local development only. Production refuses to start without PostgreSQL.

Automatic PDF/PPTX ingestion and AI generation are intentionally deferred. Prepare future materials in chat and import the resulting JSON pack, or use the admin forms. No AI API key is required.

## Run locally

Requires Node.js 22.13+ (Node 22 LTS recommended).

```sh
npm ci
cp .env.example .env
npm start
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp` if preferred.

Open `http://localhost:3000`. Local development creates `.data/reviewroom.sqlite`. It is ignored by Git. Set a unique `ADMIN_PASSWORD` with at least 16 characters in `.env` to enable `/#admin`. The placeholder value is blank, so administration is disabled until you configure it.

Run `npm run check` and `npm test` before publishing. A development-only phone viewport is available at `/_preview/mobile?width=390` (also 360 and 430). It is excluded from production routes.

## Set up Aiven PostgreSQL

1. Create a PostgreSQL service in your Aiven account. Use a database dedicated to this reviewer, separate from existing applications.
2. Copy its PostgreSQL connection URI from the service overview.
3. Download the project CA certificate shown in Aiven. Keep the URI and certificate outside Git.
4. Put the URI into Render's `DATABASE_URL` environment variable.
5. Put the complete CA certificate into `DATABASE_CA_CERT`. You can paste PEM text with actual newlines, or replace line breaks with the literal two characters `\n`.
6. If your Aiven service has network restrictions, allow the Render service's outbound IP ranges.

The app verifies the server certificate (`rejectUnauthorized: true`). It does not disable TLS verification. Connection-string `sslmode` options are removed so they cannot override the explicit TLS settings.

Reference: [Aiven Node.js connection guide](https://aiven.io/docs/products/postgresql/howto/connect-node).

## Deploy on Render

Create a **Web Service**, connect this GitHub repository, and choose:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build command | `npm ci && npm run check && npm test` |
| Start command | `npm start` |
| Health check | `/api/health` |
| Node version | `22.16.0` or a newer Node 22 release |

Set these environment variables in Render:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your private Aiven PostgreSQL URI |
| `DATABASE_CA_CERT` | Your Aiven CA certificate |
| `ADMIN_PASSWORD` | A unique password of at least 16 characters |
| `APP_ORIGIN` | Your exact HTTPS Render URL, without a trailing slash |

For example, `APP_ORIGIN=https://your-reviewroom.onrender.com`. Use the actual URL Render assigns, not that example. If you configure a custom domain, update `APP_ORIGIN` to match it. Render supplies `PORT`; the app binds to `0.0.0.0`.

Alternatively, use the included `render.yaml` Blueprint. Its secrets are deliberately `sync: false`, so Render asks you to provide them. The template selects Render's free service plan; check current provider limits before choosing a plan. Database and hosting services can have separate limits and charges.

On startup, the app creates its `rr_`-prefixed tables if absent and seeds the lesson pack **only if the content table is empty**. Existing student results and admin edits are preserved across deploys. Startup also verifies database connectivity through the health check. The migration SQL is in `migrations/001-initial.sql`; `npm run db:migrate` runs it independently.

After deployment:

1. Open `/api/health` and confirm `{"ok":true}`.
2. Visit the website on a phone, create a test profile, save its recovery code, and complete a short quiz.
3. Open the site in another browser and confirm the leaderboard shows the result.
4. Recover the same profile using its code.
5. Visit `/#admin` and sign in with the password configured on Render.
6. Share the website's root URL with classmates.

Reference: [Render Node deployment guide](https://render.com/docs/deploy-node-express-app).

## Add future coverage

In **Content studio**:

1. Add a subject, or reuse System Administration & Maintenance.
2. Add lessons and their source references, notes, flashcards, and questions.
3. Create a quiz, midterm, or final exam and check the lessons it covers.
4. Set question count, timer (0 = untimed), attempt limit (0 = unlimited), and publication status.
5. Publish when ready. An assessment must have enough questions and published lessons.

New assessments initially have version 1. Changing their coverage, rules, title, or question content creates a new version. Previous attempts retain their original question snapshots and explanations. The public leaderboard shows the current published version; students can still review older attempts in their own history.

Use **Import & edit** to export a backup, edit detailed content, or import a pack. Imports replace the content library and preserve profiles and attempts. The browser downloads a backup before replacing content. The `schemaVersion: 1` format is demonstrated in `data/content.json`; see [CONTENT.md](CONTENT.md).

The committed seed file is used on first startup. Editing it on GitHub after the database is initialized does **not** overwrite your live content. Import the updated pack through the admin studio to apply it deliberately.

## Profiles, scores, and privacy

- The display name is public on the leaderboard; no email or real name is required.
- The anonymous session cookie lasts up to one year. Closing a normal browser preserves it. Clearing browser data, private browsing, or switching devices requires the recovery code.
- Recovery codes contain 128 random bits. Only their SHA-256 hashes are stored. The code acts as the credential: keep it private. There is no email-based recovery in this release.
- Admin sessions last eight hours. Administration uses a separate HttpOnly cookie, checked by the server.
- Answers and timing are evaluated on the server. Clients cannot post a score. Answer keys are omitted from active assessment responses.
- Attempts save a copy of the questions. A server deadline continues when a browser closes. Expired attempts are finalized when opened or submitted; pending offline changes after the deadline cannot be accepted.
- Practice has a seven-day resume window and no leaderboard entry. Untimed ranked sessions also have a seven-day resume window.
- Each leaderboard keeps a profile's best completed attempt: score descending, duration ascending, then completion time ascending.
- This is a study tool, not an identity-verified or proctored testing platform. Users can create multiple profiles or consult notes. Questions are available in the private repository and study explanations are intentionally accessible.
- Per-IP request limits are process-local and designed for a single Render instance. A larger multi-instance deployment should use a shared rate-limit store.

## Repository layout

```text
public/         Browser UI, responsive CSS, and icons
server/         API, authentication, scoring, validation, database adapter
data/           First-run course content
migrations/     Database tables and indexes
scripts/        Content validation, seed authoring, database migration
test/           API and content tests
render.yaml     Render service blueprint
.env.example    Required configuration names, without secrets
```

The original PDFs and PPTX files are not committed. They are large classroom source files; the repository includes the derived study content and source references instead.
