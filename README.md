# BioBactor Project Structure

This project is organized into two main directories: **frontend** and **backend**.

## Directory Structure

```
biofactor/
├── frontend/                      # React/Vite frontend application
│   ├── src/                       # React source code
│   │   ├── components/            # React components
│   │   ├── contexts/              # React context providers
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── integrations/
│   │   │   ├── sap/               # SAP integration
│   │   │   └── supabase/          # Supabase client & types (frontend only)
│   │   ├── lib/                   # Utility libraries
│   │   ├── pages/                 # Page components
│   │   └── ...                    # Other frontend assets
│   ├── public/                    # Static assets
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── .env                       # Frontend environment variables
│   └── ...                        # Other frontend config files
│
└── backend/                       # Backend configuration & Supabase
    ├── supabase/                  # Supabase project configuration
    │   ├── config.toml            # Supabase project config
    │   ├── migrations/            # SQL migration files
    │   └── ...                    # Other Supabase files
    └── .gitignore                 # Backend ignore rules
```

## Running the Project

### Frontend Development Server

The frontend development server runs on its own port and serves the React/Vite application.

```bash
cd frontend
npm run dev
```

This starts the Vite dev server. The server will be available at `http://localhost:8080` (or the next available port if 8080 is in use).

### Frontend Build

To create a production build:

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`.

### Supabase CLI Commands

Supabase CLI commands must be run from the `backend/supabase` directory:

```bash
cd backend/supabase
npx supabase status
npx supabase migration list
npx supabase db pull
npx supabase db push
npx supabase start      # Start local development instance
npx supabase stop       # Stop local development instance
```

Alternatively, you can use npx from any directory with the `--workdir` flag:

```bash
npx supabase --workdir backend/supabase status
```

## Environment Variables

### Frontend (.env in frontend/ directory)

The frontend requires Supabase credentials to connect to the backend:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

These are Vite environment variables (prefixed with `VITE_`) and are available in frontend code via `import.meta.env`.

### Backend (.env in backend/supabase/ directory, if needed)

For local Supabase development, you can create environment files in `backend/supabase/`:

```env
SUPABASE_DB_PASSWORD=your-password
```

## Project Features

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query (React Query) for data fetching
- **Database**: Supabase PostgreSQL with Row-Level Security
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with PostCSS
- **Linting**: ESLint

## Key Import Paths

The frontend uses path aliases configured in `vite.config.ts`:

- `@/` - Maps to `frontend/src/`
- `@/components` - Component folder
- `@/integrations/supabase/client` - Supabase client initialization
- `@/hooks` - Custom React hooks
- `@/contexts` - React context providers

## Notes

1. **Supabase Types**: TypeScript types for the Supabase database are generated in `frontend/src/integrations/supabase/types.ts`. Regenerate after schema changes using the Supabase CLI.

2. **Migrations**: All database migrations are stored in `backend/supabase/migrations/`. Apply migrations using `npx supabase db push`.

3. **RLS Policies**: Row-Level Security policies are defined in SQL migrations. Check the Supabase dashboard for policy configuration.

4. **Frontend Build**: The frontend is a standalone SPA that communicates with Supabase via its REST/RealtimeAPI. No backend server is required beyond Supabase.
