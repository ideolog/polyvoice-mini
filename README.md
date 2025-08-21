# PolyVoice Mini

Telegram MiniApp + Django backend integration.

## 📌 Overview

This project consists of:

- **Frontend**: Next.js 15 (`app/` directory, TypeScript, React).
- **Backend**: Django 4 + DRF.
- **Authentication**: via Telegram MiniApp **and** Telegram Login Widget.

---

## 🗂️ Frontend Structure

- **`src/app/page.tsx` (Main page)**
    - Detects if opened inside Telegram MiniApp or browser.
    - **MiniApp flow**:
        - Extracts `initDataRaw` + `initDataUnsafe`.
        - Calls `/api/backend/telegram-auth/`.
        - Stores `pv_api_key` + `pv_user` in `localStorage`.
        - Redirects to `/panel`.
    - **Browser flow**:
        - Renders Telegram Login Widget.
        - Redirects user to `/auth/telegram-widget`.

- **`src/app/auth/telegram-widget/page.tsx` (Widget auth page)**
    - Runs after Telegram redirects with query string.
    - Calls `/api/backend/telegram-auth-widget?...`.
    - On success, stores `pv_user` + `pv_api_key`, then redirects to `/panel`.

- **`src/app/panel/page.tsx` (User panel)**
    - Loads `pv_user` from `localStorage`.
    - Calls `/api/backend/me` using `X-API-Key`.
    - Syncs user with Django (`email`, `plan`, `avatar`).
    - Renders user card.
    - `Logout` clears local storage and redirects to `/`.

- **API proxy routes**
    - `src/app/api/backend/telegram-auth/route.ts` → forwards POST to Django `/api/telegram/auth/` (MiniApp).
    - `src/app/api/backend/telegram-auth-widget/route.ts` → forwards GET to Django `/api/telegram/widget-auth/` (Widget).
    - `src/app/api/backend/me/route.ts` → forwards GET to Django `/api/me/`.

---

## 🖥️ Backend Structure

- **Auth (`users/auth.py`)**
    - `ApiKeyAuthentication` → checks `X-API-Key` header.
    - Finds user by API key or rejects with 401.

- **MeView (`users/views.py`)**
    - Endpoint: `/api/me/`.
    - Requires `X-API-Key`.
    - Returns user info (`id`, `email`, `plan`, `avatar`, `api_key_present`).

- **Telegram Auth (`integrations/telegram/views.py`)**
    - **`TelegramLoginVerifyView`** → `/api/telegram/auth/` (POST, MiniApp).  
      Validates MiniApp signature (`initDataRaw` + `initDataUnsafe`).
    - **`TelegramWidgetLoginVerifyView`** → `/api/telegram/widget-auth/` (GET, Widget).  
      Validates HMAC `hash` param from query string.

Both views create or update a user (`ExternalIdentity`) and return `{ ok, user, api_key, avatar }`.

---

## 🔑 Telegram Authentication

PolyVoice supports **two independent login flows**:

### 1. MiniApp Login (inside Telegram)

- **Frontend**: Uses `window.Telegram.WebApp`.
- **Backend**: `POST /api/telegram/auth/` (via proxy).
- **Validation**: MiniApp signature.
- **Result**: Creates/updates user, returns `api_key`.

### 2. Widget Login (outside Telegram)

- **Frontend**: Renders `telegram-widget.js`, redirects to `/auth/telegram-widget`.
- **Backend**: `GET /api/telegram/widget-auth/` (via proxy).
- **Validation**: HMAC-SHA256 `hash` param.
- **Result**: Creates/updates user, returns `api_key`.

### 🔒 Shared Behavior

- Both flows store:
    - `pv_user` → Telegram user object.
    - `pv_api_key` → API key for backend requests.
- Both redirect to `/panel` after login.
- Both update user avatars automatically if `photo_url` changes.

---

## ✅ Current Status

- ✅ MiniApp login works.
- ✅ Widget login works.
- ✅ Proxy routes set up for `/telegram-auth`, `/telegram-auth-widget`, and `/me`.
- ✅ Avatars and user metadata synced in panel.
- ✅ API key hidden from UI (only presence exposed).

---

## 🚀 Next Steps

- Improve browser-only UX (e.g. fallback redirect if widget not loaded).
- Add better error handling for expired/invalid sessions.
- Extend `/me/` with richer user metadata.  
