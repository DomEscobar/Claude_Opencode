# REGIONAL_MAP.md (Spatial Index)

Use this map to "Agentic GPS" jump to the correct directory. Do NOT grep for these features.

| Business Feature | Code Path | Local Brain (Scoped AGENTS.md) |
| :--- | :--- | :--- |
| **Auth & Security** | `backend/internal/auth/` | `backend/AGENTS.md` |
| **Payment Ingest** | `backend/internal/billing/` | `backend/AGENTS.md` - (PCI Rules Section) |
| **User Dashboard** | `frontend/src/views/dashboard/` | `frontend/AGENTS.md` - (UI Patterns Section) |
| **Database Migrations** | `backend/migrations/` | `backend/AGENTS.md` - (Hard Rules [BE-2]) |

## Edge Cases & Overflow
- Shared logic (Protobufs): `services/proto/`
- DevOps/CI-CD: `.github/workflows/`
- Production Config: `config/prod/`
