# Ledgerly

Ledgerly is a generic ledger/accounting document management platform. 

## Features

- Landing Page
- Authentication (Login/Signup via Supabase)
- Protected Dashboard
- PWA Support
- Modern, clean UI (Tailwind CSS)

## Prerequisites

- Node.js (v18 or newer recommended)
- Supabase Account and Project

## Installation

1. Clone or download the repository.
2. Run `npm install` to install all dependencies.
3. Configure environment variables (see below).
4. Run `npm run dev` to start the development server.

## Environment Variables

You need to provide your Supabase project credentials. Create a `.env.local` file (or update the provided `.env`) with the following keys:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these in your Supabase dashboard under Project Settings > API.

## Running Locally

1. `npm run dev` - Starts the Vite development server.
2. `npm run build` - Builds the application for production.
3. `npm run preview` - Locally preview the production build.

## Supabase Configuration

1. Create a new Supabase project.
2. Enable Email Auth provider in Authentication -> Providers.
3. Update the `.env` variables with the provided URL and anon key.
# Ledgerly
