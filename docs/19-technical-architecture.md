# Technical Architecture

System design for AeroSync MRO—a simplified, portfolio-grade SaaS inspired by MRO platforms.

---

## Architecture overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     Nuxt 3 Frontend                          │
│  Pages · Components · Composables · Permission directives    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST
┌──────────────────────────▼──────────────────────────────────┐
│              API Layer (choose one)                          │
│  Option A: Supabase (PostgREST + Edge Functions)             │
│  Option B: NestJS modules + Prisma                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    PostgreSQL                                │
│  Tenant data · RLS policies · audit_logs                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Object Storage (S3 / Supabase Storage)          │
│  Defect and WO attachments                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Recommended stack

| Layer | Technology |
|-------|------------|
| Frontend | Nuxt 3, Vue 3, TypeScript, Pinia |
| UI | Tailwind CSS + headless component library |
| Backend | Supabase **or** NestJS |
| Database | PostgreSQL 15+ |
| ORM | Prisma (NestJS path) |
| Auth | Supabase Auth, Auth.js, Clerk, or Keycloak |
| Storage | S3-compatible or Supabase Storage |
| Hosting | Cloudflare Pages, Render, Fly.io, Supabase, AWS |

---

## Backend option A: Supabase

**Best for:** Fast MVP, small team, built-in auth and RLS.

```text
Nuxt → Supabase client → PostgREST → PostgreSQL (RLS)
                    → Storage API
                    → Edge Functions (reference numbers, webhooks)
```

- Row Level Security enforces `account_id` isolation
- Edge function for reference number generation and status side-effects
- Realtime optional for availability board updates

---

## Backend option B: NestJS + Prisma

**Best for:** Full control, complex business rules, enterprise auth.

```text
Nuxt → REST API → NestJS modules → Prisma → PostgreSQL
                              → S3 adapter
```

### Suggested modules

| Module | Responsibility |
|--------|----------------|
| AuthModule | JWT/session, permission guard |
| UsersModule | Users, profiles |
| AircraftModule | Registry, availability |
| FleetModule | Plans, assignments |
| DefectsModule | Defect lifecycle |
| WorkOrdersModule | WO + tasks |
| SignOffModule | Sign-off + maintenance records |
| AuditModule | Audit logging interceptor |
| InventoryModule | V2 |

---

## Authorization implementation

```text
@RequirePermissions('work_order.update')
@Patch(':id')
updateWorkOrder() { ... }
```

1. Auth guard validates session
2. Permissions guard loads effective permissions from cache
3. Optional AssignedResourceGuard checks `assigned_to`

Cache permissions in Redis or JWT with 5-minute TTL; invalidate on profile change.

---

## Key services

### AvailabilityService

Centralizes rules when defects/WOs/sign-offs change:

```text
onWorkOrderStatusChange(wo, newStatus)
  → update aircraft_availability
  → update aircraft.status if needed
  → update flight.maintenance_risk_status
  → audit log
```

### ReferenceNumberService

Generates DEF-/WO-/SO- numbers atomically per account/year.

### AuditService

Called from interceptors or explicit service calls; never skip on mutations.

---

## Frontend structure (Nuxt 3)

```text
/pages              Route screens (see 16-main-screens.md)
/components         Shared UI
/composables        usePermissions, useAircraft, etc.
/stores             Pinia: auth, notifications
/middleware         auth.global.ts, permission.ts
/server/api         Optional BFF if hiding Supabase keys
```

### Permission directive

```vue
<button v-permission="'signoff.perform'">Sign Off</button>
```

---

## Data flow: core workflow

```text
Pilot UI → POST /defects → DefectService.create
    → AuditService.log
    → NotificationService.notifyControllers

Controller UI → POST /work-orders → WorkOrderService.createFromDefect
    → AvailabilityService.onWorkOrderOpened
    → DefectService.linkWorkOrder

Engineer UI → PATCH /work-orders/:id/tasks → TaskService.complete

LE UI → POST /sign-offs → SignOffService.create
    → WorkOrderService.close
    → AvailabilityService.onRelease
    → MaintenanceRecordService.create
```

---

## Deployment topology (demo)

```text
Cloudflare Pages  → Nuxt static/SSR
Supabase Cloud    → DB + Auth + Storage
                  OR
Render Web Service → NestJS
Render PostgreSQL  → Managed DB
```

Environment variables: `DATABASE_URL`, `AUTH_SECRET`, `STORAGE_BUCKET`, `PUBLIC_API_URL`.

---

## Observability

| Concern | Tool |
|---------|------|
| Errors | Sentry |
| Logs | Structured JSON to stdout |
| Uptime | Better Stack / Pingdom |
| Audit | audit_logs table (primary) |

---

## Security practices

- HTTPS only
- HttpOnly cookies for session (or secure JWT storage)
- Rate limit login and defect creation
- Validate all uploads (type, size)
- No secrets in frontend
- Service role key server-side only (Supabase)

---

## MVP notes

- Pick one backend path; do not hybrid until necessary.
- Monolith first; extract services only at V2 scale.
- Use database transactions for sign-off + WO close + availability update.

## Future improvements

- Event bus (Redis Streams) for async notifications
- Read model for availability board (materialized view)
- API versioning `/v1/`
- OpenAPI spec for external integrations
