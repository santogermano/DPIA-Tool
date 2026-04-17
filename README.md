# DPIA Tool — TU/e template

A modern, collaborative DPIA editor. Runs entirely in the browser. No backend. No AI API calls. No vendor lock-in.

## What it does

- **DPIA editor** — Step-by-step wizard mapped to the TU/e Data Protection Impact Assessment template (12 numbered sections + conclusion + consultation + risk matrix annex).
- **Real-time collaboration** — Y.js + y-webrtc peer-to-peer. Share the DPIA URL; colleagues see edits live.
- **Offline-first** — y-indexeddb persists every DPIA locally. Works without internet once loaded.
- **Auto-generated data flow diagram** — React Flow + Dagre. Reads sections 5 & 6, draws subjects → data → purpose → storage → processors → retention. Updates live.
- **Risk matrix** — TU/e 5×5 impact × likelihood matrix baked in. Auto-calculates Low/Medium/High/Critical. Article 36 GDPR check flags high residual risks.
- **PDF export** — `@react-pdf/renderer` produces a styled, printable PDF with the data diagram embedded.
- **JSON export/import** — Portable `.dpia.json` backups.
- **Multi-DPIA** — Dashboard lists every DPIA in your browser. Each has its own collaboration room.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn-style UI · Zod · Y.js · y-webrtc · y-indexeddb · React Flow · Dagre · React Hook Form · @react-pdf/renderer · React Router.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Settings → Pages → Source: **GitHub Actions**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds and deploys.

The app uses `HashRouter` so it runs under any path, including a GitHub Pages sub-path.

## How collaboration works

- Each DPIA is a Y.js document identified by a UUID (the "room").
- When two users open the same URL, y-webrtc uses a public signaling server (`wss://signaling.yjs.dev` and a backup) to discover each other. After discovery, all DPIA data syncs **directly peer-to-peer via WebRTC**. The signaling server never sees your data.
- If you do not trust the public signaling server, self-host one (see https://github.com/yjs/y-webrtc#signaling) and edit `SIGNALING` in `src/hooks/useYDoc.ts`.
- There is no server-side persistence. The data lives in collaborators' browsers (IndexedDB). Always export JSON as a backup.

## Template source

Content model derived directly from TU/e's Word DPIA template:

- **A. Description:** 1 Overview · 2 Reasons for DPIA · 3 Data subjects · 4 Data collection · 5 Data flow table · 5.1 Data diagram · 6 Involved parties · 7 Privacy by Design & by Default.
- **B. Security:** 8 Processing tech & method · 8.1 Security assessment.
- **C. Legal:** 9 Legal basis · 9.1 Compatible purpose · 10 Data subjects' rights.
- **D. Necessity:** 11 Proportionality · 12 Subsidiarity.
- **E. Risk assessment & treatment** (impact × likelihood matrix, treatment, residual risk).
- **Conclusion** · **Consultation** (DPO + CISO).

## Limitations

- No authentication. URL = access. Treat the share link like a shared Google Doc link.
- Data durability depends on collaborators' browsers. If everyone clears storage and nobody has the JSON, the DPIA is gone. **Export JSON as backup.**
- The PDF is a simplified layout — not a pixel copy of the browser UI.
- Very large DPIAs (many rows, many parties) produce dense diagrams. Dagre lays them out; you can drag nodes.

## License

MIT.
