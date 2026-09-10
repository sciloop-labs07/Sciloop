# Enterprise Security and Trust Overview

## Current boundary

SciLoop currently has a Next.js / React / TypeScript frontend and a controlled AI/news backend. Legacy admin tooling is quarantined and the public ForLoop bridge returns `410 Gone`. Early Reality Engine services remain behind the controlled backend until a validated buyer use case exists.

## Data boundaries

- Customer data must enter only an approved tenant-scoped interface.
- Provider keys remain server-side and must never be sent to browsers.
- Source URLs and evidence identifiers are retained with generated claims.
- Sensitive customer data should not be used in public demos.
- Pilot data retention and deletion terms must be agreed before onboarding.

## Required enterprise controls before production deployment

- Authentication with organization and role boundaries.
- Tenant-isolated storage for evidence, runs, feedback, and exports.
- Server-side validation, rate limiting, and request size limits.
- Audit events for imports, model runs, exports, reviews, and promotions.
- Configurable retention and deletion workflow.
- SSO/SCIM only when the selected enterprise scope requires it.
- Backup, recovery, dependency patching, and incident response procedure.
- Formal privacy and subprocessor review for the customer’s jurisdiction.

## Model trust

- AI outputs are untrusted drafts until normalized and validated.
- Every scenario separates evidence, inference, speculation, and unknowns.
- Every visual recipe passes guardrails and schema validation.
- Human approval is required before customer-facing publication.
- Structural scores are not empirical accuracy.
- Prediction-versus-outcome comparisons preserve both success and failure.

## Rollback and auditability

Engine packages are versioned. A promoted version can be disabled and the prior validated version restored. Each run should retain engine version, input references, evidence IDs, assumptions, output hash, reviewer decision, and timestamps.

## Current limitations

The repository currently documents local-storage feedback, unavailable database feedback, and incomplete enterprise identity/storage controls. These are pilot-readiness gaps, not claims of completed enterprise compliance.
