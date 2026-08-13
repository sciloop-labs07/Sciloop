# Feedback Storage Architecture

## Current mode

SciLoop uses a `FeedbackStorageAdapter` boundary:

`Feedback UI → Storage Manager → Local Adapter → Analyzer → Evolution Notes`

Browser `localStorage` is the default. If it is unavailable, the manager falls back to an in-memory adapter. Memory feedback is not persistent and disappears when the page session ends.

The database adapter is intentionally unavailable until a real database client, credentials, migrations, and deployment configuration exist.

## Adapter contract

Every adapter supports saving, querying by recipe/pattern/engine, deleting, clearing, JSON export, and storage health reporting.

Existing UI continues to use `feedbackStore.ts`, which is now a compatibility facade over the manager.

## Future database model

Recommended table or collection fields:

- `id`
- `recipeId`
- `patternId`
- `engineId`
- `concept`
- `visualType`
- `rating`
- `clarityScore`
- `complexityScore`
- `motionScore`
- `usefulnessScore`
- `selectedIssues`
- `selectedImprovements`
- `freeText`
- `audienceLevel`
- `source`
- `createdAt`
- `updatedAt`

Arrays may use native array/JSON columns or normalized relation tables depending on the chosen database.

Useful indexes:

- `recipeId, createdAt`
- `patternId, createdAt`
- `engineId, createdAt`
- `rating`

## Privacy

Feedback can contain free text. Before server persistence:

- publish a retention and deletion policy;
- avoid collecting names or sensitive personal data;
- rate-limit writes;
- validate length and controlled values server-side;
- authenticate administrative export and deletion;
- separate anonymous product analytics from user identity;
- document whether feedback may be used to improve future AI output.

## Relationships

- `recipeId` measures one generated explanation.
- `patternId` measures reusable explanation structures.
- `engineId` measures whether a rendering technology helped.
- Visual-language analysis aggregates repeated issues across all three.
- The AI translator may receive summarized feedback context later, but cannot bypass recipe validation or overwrite controlled visual language.

## Migration path

1. Select and configure a database already approved for the project.
2. Add migrations for the model above.
3. Implement `DatabaseFeedbackAdapter`.
4. Add authenticated server-side validation and rate limiting.
5. Replace the disabled route handler with database-backed GET/POST/DELETE operations.
6. Add a one-time, user-approved import of exported local JSON.
7. Keep local or memory storage as an offline fallback.

Never expose database credentials or service-role keys to browser code.
