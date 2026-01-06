# HabitFlow - Habit Tracking Application

## Overview
HabitFlow is a React-based habit tracking application that helps users build and maintain positive habits. Users can create habits, track daily progress, and view weekly/monthly statistics.

## Project Structure
- `src/` - Main source code
  - `components/` - React components
    - `ui/` - Reusable UI components (shadcn/ui)
    - `AddHabitDialog.tsx` - Dialog for adding new habits
    - `HabitCard.tsx` - Individual habit display card
    - `WeeklyProgress.tsx` - Weekly progress visualization
    - `MonthlyProgress.tsx` - Monthly progress visualization
    - `MonthlyReport.tsx` - Monthly statistics report
    - `StatsOverview.tsx` - Overview statistics component
  - `hooks/` - Custom React hooks
    - `useHabits.ts` - Habit management hook
  - `lib/` - Utility functions and types
    - `habitTypes.ts` - TypeScript types for habits
    - `utils.ts` - General utilities
  - `pages/` - Page components
    - `Index.tsx` - Main page
    - `NotFound.tsx` - 404 page

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- TanStack Query for data fetching
- date-fns for date manipulation
- Recharts for charts

## Development
Run `npm run dev` to start the development server on port 5000.

## Recent Changes
- Migrated from Lovable to Replit environment
- Updated Vite config for Replit compatibility (port 5000, allowedHosts)
