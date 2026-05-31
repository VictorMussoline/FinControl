# 💰 FinControl v2

FinControl is a modern, clean, and efficient personal finance tracking application designed to help users take control of their expenses and income. 

This repository marks the **version 2.0** of the project, built entirely from scratch to upgrade the developer experience and system architecture.

## 🛠️ Tech Stack & Evolution

- **Framework:** React (via Vite)
- **Language:** TypeScript (Migrated from JavaScript for type safety and better DX)
- **Styling:** Tailwind CSS (For a fully custom, utility-first UI)
- **Backend/Database:** Supabase (Transitioning from a legacy Firebase setup to a relational PostgreSQL database)

## 🏗️ Architecture & Development Strategy

To ensure rapid frontend development without blockers, the project uses a strict decoupled data layer:
1. **Mocked Services First:** The app currently runs 100% locally using TypeScript interfaces and structured mock data. This allows complete UI/UX building before database integration.
2. **Supabase Transition:** Once the interface is polished, the local service layer will be swapped with Supabase API clients without affecting the UI components.

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Cards, Tables, Buttons)
├── screens/        # Application pages (Dashboard, Analytics, etc.)
├── types/          # Strict TypeScript definitions
├── mocks/          # Static in-memory mock data
└── services/       # Data-fetching layer (Simulated API delays)
