# Mada Bank

🌐 **[View Live Demo](https://mg-bank.vercel.app/)**

A modern digital banking demo focused on Madagascar. It lets users link bank accounts, view balances and transactions, and send money — including cross‑border transfers to/from U.S. bank accounts (Plaid sandbox + Dwolla). This repository is for learning/demo purposes only, not production use.

## Overview
- Madagascar‑focused digital banking experience
- Bank linking via Plaid (sandbox)
- Transfers via Dwolla (supports U.S. bank accounts)
- Secure authentication and sessions with Appwrite
- **🌐 [Live Demo](https://mg-bank.vercel.app/)**

## Tech Stack
- TypeScript, Next.js 15 (App Router)
- Tailwind CSS, shadcn/ui (Radix UI), Lucide Icons
- Appwrite (Auth + Database)
- Plaid, Dwolla, Sentry

## Features
- Email sign‑up/sign‑in with secure server session (cookie `appwrite-session`)
- Link bank accounts via Plaid; create Dwolla funding source
- Dashboard: accounts, balances, institutions, transactions (Plaid + transfers)
- Send money via Dwolla (supports U.S. transfers)
- Logout and session management

## Key Folders
- `lib/appwrite.ts`, `lib/plaid.ts`, `lib/actions/*` (user, bank, transactions, dwolla)
- `app/(auth)` (sign‑in, sign‑up), `app/(root)` (my-banks, payment-transfer, transaction-history)

## Environment Variables (essential)
- Appwrite: `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT`, `NEXT_APPWRITE_KEY`, `APPWRITE_DATABASE_ID`, `APPWRITE_USER_COLLECTION_ID`, `APPWRITE_BANK_COLLECTION_ID`, `APPWRITE_TRANSACTION_COLLECTION_ID`
- Plaid: `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_PRODUCTS`, `PLAID_COUNTRY_CODES`
- Dwolla: `DWOLLA_ENV` (`sandbox` or `production`), `DWOLLA_KEY`, `DWOLLA_SECRET`
- Sentry (optional): DSN / Next.js config

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```
