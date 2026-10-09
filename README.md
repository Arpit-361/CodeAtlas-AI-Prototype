# CodeAtlas AI — Frontend Prototype

Interactive prototype of **CodeAtlas AI**: an intelligent software architecture visualization and developer intelligence platform.

This is a **frontend-only** demo. Repository import, analysis stages, architecture graphs, and AI answers use **centralized mock data**. Nothing is fetched from GitHub, unpacked from ZIP files, or inferred by a live LLM.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Cytoscape.js (architecture graph)
- Lucide icons
- Recharts
- React Router

## Install & run

```bash
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Features

- Overview dashboard with branding, stats, recent projects, quick actions
- Import flow (GitHub URL / ZIP) with validation — **simulated** analysis only
- Staged analysis progress UI
- Architecture explorer (Cytoscape): zoom/pan/fit, search/filter, selection highlights, details panel
- Dependencies and components views
- Mock AI assistant with suggested prompts
- Project details and metrics

## Sample data

The built-in project is **TaskFlow API**, a small Python Flask-style web app (routes, services, models, utils, DB modules). All screens share the same typed mock layer under `src/data/`.
