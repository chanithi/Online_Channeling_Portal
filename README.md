# Online Channeling Portal

## Setup Instructions

1. Clone the repo
2. Go to frontend/web-app
3. Install dependencies:
   npm install

4. Create `.env.local` inside web-app:

NEXT_PUBLIC_SUPABASE_URL= (--url)  
NEXT_PUBLIC_SUPABASE_ANON_KEY=. (--key)

5. Run project:
   npm run dev

---

## System Overview

- Authentication handled by Supabase
- Role-based access:
  - patient
  - doctor
  - centre_admin
  - portal_admin

---

## Folder Responsibilities

Each team works inside:

- patient → frontent/web-app/app/patient
- doctor → frontent/web-app/app/doctor
- centre-admin → frontent/web-app/app/centre-admin
- portal-admin → frontent/web-app/app/portal-admin

---

## Important Rules

- DO NOT change auth logic
- DO NOT change roles
- Use existing Supabase connection