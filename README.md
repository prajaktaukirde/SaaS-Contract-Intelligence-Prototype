<img width="500" height="300" alt="Screenshot 2025-09-20 162043" src="https://github.com/user-attachments/assets/e2ce0a3a-4a2c-4523-9559-30903c1656d8" />
<img width="500" height="300" alt="Screenshot 2025-09-20 162054" src="https://github.com/user-attachments/assets/663bea5b-2885-4ab1-9381-ace7fbc7ab0f" />
<img width="500" height="300" alt="Screenshot 2025-09-20 162101" src="https://github.com/user-attachments/assets/ea45664c-e03d-442b-ab41-f28d6a05b30d" />
<img width="500" height="300" alt="Screenshot 2025-09-20 162118" src="https://github.com/user-attachments/assets/c1048b5f-762d-4e13-80a7-b95e41f4344c" />
<img width="500" height="300" alt="Screenshot 2025-09-20 162355" src="https://github.com/user-attachments/assets/41fc2bf1-1972-46b4-82f8-9d6ec998b044" />
<img width="500" height="300" alt="Screenshot 2025-09-20 162407" src="https://github.com/user-attachments/assets/33915b52-946f-472f-98bf-db67b723b62e" />
<img width="500" height="300" alt="Screenshot 2025-09-20 162414" src="https://github.com/user-attachments/assets/8da7125c-73a6-4987-ab43-e7063b318fdd" />

# SaaS Contract Intelligence Prototype

A full-stack SaaS-style prototype for contract management with AI-driven insights. Designed for non-technical business users to test contract upload, query, and dashboard workflows.

---

## Features

- **Authentication & Multi-Tenancy**
  - Sign up and log in with JWT-based authentication.
  - User-specific data isolation.

- **Upload & Parse Contracts**
  - Drag-and-drop PDF/TXT/DOCX upload.
  - Backend simulates LlamaCloud parsing → splits document into chunks with embeddings.
  - Stores chunks in PostgreSQL + pgvector with metadata.

- **Contracts Dashboard**
  - Table view: Contract Name, Parties, Expiry Date, Status, Risk Score.
  - Search, filter, and pagination.
  - Clear empty/loading/error states.

- **Contract Detail & Insights**
  - Clauses section with confidence scores.
  - AI Insights with risks and recommendations.
  - Evidence Drawer: retrieved snippets with relevance.

- **Natural Language Query**
  - Ask questions about contracts.
  - Vector search on user-specific chunks.
  - Returns mock AI answer and top chunks with metadata.

---

## Tech Stack

- **Frontend:** React + Tailwind CSS  
- **Backend:** Python (FastAPI preferred, Flask acceptable)  
- **Database:** PostgreSQL + pgvector  
- **Parsing:** Mock LlamaCloud response  
- **Auth:** JWT-based multi-user login  
- **Deployment:**  
  - Frontend → Netlify/Vercel  
  - Backend → Render/Heroku/Fly.io  
  - Database → Supabase or Docker

---
