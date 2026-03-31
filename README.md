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

   Open browser:

   http://localhost:3000

---

## System Overview

- Authentication handled by Supabase
- Role-based access:
  - patient
  - doctor
  - centre_admin
  - portal_admin

---

## Authentication Flow

User registers via /register
User logs in via /login
System checks user role
Redirects to appropriate dashboard

## Folder Responsibilities

Each team works inside:

- patient → frontent/web-app/app/patient
- doctor → frontent/web-app/app/doctor
- centre-admin → frontent/web-app/app/centre-admin
- portal-admin → frontent/web-app/app/portal-admin

---

## Important Rules

- DO NOT change auth logic
- DO NOT change roles (patient, doctor, centre_admin, portal_admin)
- Use existing Supabase connection


--------------------------------------------------------------

# Git Workflow Guide 

To avoid conflicts and maintain clean code integration, follow this Git workflow strictly.

---

# Branch Structure

   main                         → Final stable code
   feature/patient              → Patient team integration branch
   feature/doctor               → Doctor team integration branch
   feature/centre-admin         → Centre admin team integration branch
   feature/portal-admin         → Portal admin team integration branch

   feature/patient_<name>       → Individual patient member branches
   feature/doctor_<name>        → Individual doctor member branches
   ...


---

# 🚀 Workflow Overview

Each member will:

   1. Create their own feature branch
   2. Work only on their module
   3. Create a Pull Request (PR) to their **team branch**
   4. Team branch will be tested
   5. Team branch will be merged into `main`

---

# Step-by-Step Guide

## 1.Get Latest Code

   Always start with latest updates:

   git checkout feature/<your-team>
   git pull origin feature/<your-team>


   Example:

   git checkout feature/patient
   git pull origin feature/patient


---

## 2.Create Your Personal Branch

   Create your own working branch from your team branch:

   git checkout -b feature/<team>_<yourname>


   Example:

   git checkout -b feature/patient_nipuni

---

## 3. Do Your Work

   * Work ONLY inside your module folder
   * Do NOT modify other team areas
   * Do NOT change authentication logic

---

## 4. Commit and Push

   git add .
   git commit -m "Added patient profile page"
   git push origin feature/<team>_<yourname>


---

## 5. Create Pull Request (PR)

   Create PR:


   FROM: feature/<team>_<yourname>
   TO:   feature/<team>


   Example:


   feature/patient_nipuni → feature/patient


---

## 6. Team Integration

   * Team members review and test changes
   * Fix conflicts if any
   * Merge into team branch

---

## 7. Final Merge to Main

   After testing:

   feature/<team> → main


   Example:

   feature/patient → main


   This should be done carefully 

---

# ⚠️ Important Rules

❗ ALWAYS pull before starting work
❗ NEVER push directly to `main`
❗ NEVER work on someone else's module
❗ DO NOT change:

* authentication logic
* role names
* Supabase configuration

---

# 🧠 Best Practices

* Use clear commit messages
* Test before creating PR
* Keep changes small and focused
* Communicate with your team

---

# 🚨 Common Mistakes to Avoid

❌ Creating branches from outdated code
❌ Pushing directly to main
❌ Mixing multiple features in one branch
❌ Editing unrelated files

---

# 🎯 Summary

```text
Your Branch → Team Branch → Main
```

This ensures:

* Clean collaboration
* Reduced conflicts
* Safe integration
* Easy debugging

---

