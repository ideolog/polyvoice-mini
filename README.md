# PolyVoice Mini

Telegram MiniApp + Django backend integration.

## 📌 Overview

This project consists of:

- **Frontend**: Next.js 15 (`app/` directory, TypeScript, React).
- **Backend**: Django 4 + DRF.
- **Authentication**: via Telegram MiniApp + API keys.

---

## 🗂️ Frontend Structure

- **`src/app/page.tsx` (Main page)**
    - Detects if opened inside Telegram MiniApp or browser.
    - MiniApp flow:
        - Extracts `initDataRaw` + `initDataUnsafe`.
        - Calls `/api/backend/telegram-auth/`.
        - Stores `pv_api_key` + `pv_user` in `localStorage`.
        - Redirects to `/panel`.
    - Browser flow: renders Telegram login widget.

- **`src/app/panel/page.tsx` (User panel)**
    - Loads `pv_user` from `localStorage`.
    - Calls `/api/backend/me` using `X-API-Key`.
    - Updates user with Django data (`email`, `plan`, `avatar`).
    - Renders user card.
    - `Logout` → clears local storage → redirect to `/`.

- **API proxy routes**
    - `src/app/api/backend/telegram-auth/route.ts` → forwards POST to Django `/api/telegram/auth/`.
    - `src/app/api/backend/me/route.ts` → forwards GET to Django `/api/me/`.

---

## 🖥️ Backend Structure

- **Auth (`users/auth.py`)**
    - `ApiKeyAuthentication` → checks `X-API-Key` header.
    - Finds user by API key or rejects with 401.

- **MeView (`users/views.py`)**
    - Endpoint: `/api/me/`.
    - Requires `X-API-Key`.
    - Returns:
      ```json
      {
        "id": 1,
        "email": "user@example.com",
        "api_key_present": true,
        "plan": "free",
        "avatar": "http://localhost:8000/media/.../avatar.png"
      }
      ```

- **Telegram Auth (`/api/telegram/auth/`)**
    - Accepts `raw` + `unsafe` from MiniApp.
    - Validates Ed25519 signature.
    - Creates or finds user.
    - Returns `api_key` and Telegram user data.

---

## 🔑 Login Flow (End-to-End)

1. User opens MiniApp.
2. Frontend sends `raw` + `unsafe` → `/api/backend/telegram-auth/`.
3. Django validates → returns `api_key`.
4. Frontend saves `pv_api_key` + `pv_user` in `localStorage`.
5. Redirect → `/panel`.
6. `/panel` requests `/api/backend/me` with `X-API-Key`.
7. Django returns email/plan/avatar.
8. Frontend updates UI.
9. Logout clears local storage.

---

## ✅ Current Status

- ✅ Automatic login via MiniApp works.
- ✅ Proxy routes for `/telegram-auth` and `/me` fixed.
- ✅ Avatar, email, and plan rendering in panel.
- ✅ `api_key` hidden from UI (but presence logged on backend).

---

## 🚀 Next Steps

- Handle **desktop/browser flow** (currently no redirect possible without Telegram).
- Add proper error handling for invalid MiniApp sessions.
- Expand `/me/` with more user metadata.

