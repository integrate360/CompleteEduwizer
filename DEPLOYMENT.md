# Deployment Guide — NG Eduwizer (EC2 + nginx)

This monorepo has three apps:

| App | Stack | Role | Served as |
|---|---|---|---|
| `EduwizerBackend` | Node + Express + MongoDB | REST API | Node process on `:8081`, proxied at `/api` |
| `frontend` | Vite + React + TS | Public website | Static files via nginx (root domain) |
| `EduwizerAdmin` | Vite + React + Tailwind | Admin panel | Static files via nginx (subdomain or `/admin`) |

---

## 0. Server prerequisites (Ubuntu EC2)

```bash
# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm i -g pm2            # keeps the backend running + restarts on boot

# MongoDB: either install locally, or use MongoDB Atlas (recommended for prod)
```

EC2 **Security Group**: allow inbound 80 (HTTP), 443 (HTTPS), 22 (SSH). Do **not**
expose 8081 publicly — nginx proxies to it on localhost.

---

## 1. Backend — environment variables

Create `EduwizerBackend/.env` (never commit it — it's gitignored):

```ini
# --- core ---
port=8081
DATABASE_URL=mongodb://127.0.0.1:27017/        # or your Atlas SRV string
DATABASE_NAME=eduwizer

# --- auth (use ONE strong secret; code reads process.env.secret) ---
secret=<run: openssl rand -hex 32>
JWT_SECERT=<same value as `secret` — legacy var name kept for safety>
access_key=<random admin access key>

# --- CORS allowlist: production origins (comma-separated) ---
# Built-in defaults already include eduwizer.com / ngeduwizer.com / localhost.
# Add anything extra (e.g. the admin subdomain) here:
CORS_ORIGINS=https://eduwizer.com,https://www.eduwizer.com,https://admin.eduwizer.com

# --- canonical site URL (used by the dynamic sitemap) ---
SITE_URL=https://eduwizer.com

# --- AWS S3 (resume/photo/payment uploads) ---
AWS_ACCESS_KEY=<key>
AWS_SECRET_KEY=<secret>
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_BUCKET_NAME=<bucket>
AWS_REGION=ap-south-1
REGION=ap-south-1

# --- email (SendGrid — OTP + password reset + contact) ---
EMAIL=support@eduwizer.com
SUPPORT_EMAIL=support@eduwizer.com
EMAIL_PROVIDER_AUTH_PASSWORD=<sendgrid api key>

# --- app URLs ---
BASE_URL=https://eduwizer.com
PRODUCTION_BASE_URL=https://eduwizer.com
```

Run it:

```bash
cd EduwizerBackend
npm install --omit=dev
pm2 start index.js --name eduwizer-api
pm2 save && pm2 startup     # run the printed command so it survives reboots
```

---

## 2. Frontend (public site) — build & deploy

The API and site URLs **default to production** in code, so a normal build is
already correct. To override (e.g. staging), create `frontend/.env`:

```ini
VITE_API_URL=https://eduwizer.com/api     # default if unset
VITE_SITE_URL=https://eduwizer.com        # used for canonicals/OG (default if unset)
```

Build and publish:

```bash
cd frontend
npm install
npm run build                       # outputs ./dist
sudo mkdir -p /var/www/eduwizer
sudo cp -r dist/* /var/www/eduwizer/dist/    # or rsync
```

---

## 3. Admin panel — build & deploy

API base defaults to `https://eduwizer.com/api`; override with `EduwizerAdmin/.env`
(`VITE_API_URL=...`) if needed.

```bash
cd EduwizerAdmin
npm install
npm run build                       # outputs ./dist
sudo cp -r dist/* /var/www/eduwizer-admin/dist/
```

Host the admin on a subdomain (`admin.eduwizer.com`) — add its origin to the
backend `CORS_ORIGINS`.

---

## 4. nginx

A ready config is in `frontend/nginx.conf.example`. The **critical** line is the
SPA history fallback — without it, refreshing on `/about-us` 404s:

```nginx
server {
    listen 80;
    server_name eduwizer.com www.eduwizer.com;
    root /var/www/eduwizer/dist;
    index index.html;

    # SPA deep-link fallback (REQUIRED for BrowserRouter clean URLs)
    location / { try_files $uri $uri/ /index.html; }

    # Backend API (Express on :8081) — keeps it same-origin under /api
    location /api/ {
        proxy_pass http://127.0.0.1:8081/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /robots.txt  { try_files $uri =404; }
    location = /sitemap.xml { proxy_pass http://127.0.0.1:8081/sitemap.xml; }  # dynamic

    location /assets/ { expires 30d; add_header Cache-Control "public, immutable"; }
    gzip on; gzip_types text/css application/javascript application/json image/svg+xml;
}

# Admin panel
server {
    listen 80;
    server_name admin.eduwizer.com;
    root /var/www/eduwizer-admin/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

> Note: `sitemap.xml` is generated dynamically by the backend (includes every live
> blog/event), so proxy it to the API rather than serving the static file.

Enable + reload:

```bash
sudo cp frontend/nginx.conf.example /etc/nginx/sites-available/eduwizer
sudo ln -s /etc/nginx/sites-available/eduwizer /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. HTTPS (required for production)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d eduwizer.com -d www.eduwizer.com -d admin.eduwizer.com
```

certbot rewrites the nginx config to add the 443/SSL blocks and auto-renews.

---

## 6. Post-deploy checklist

- [ ] `https://eduwizer.com` loads; refresh on `/about-us` works (no 404)
- [ ] `https://eduwizer.com/api/admin/eduwizer/getBlogs` returns JSON
- [ ] `https://eduwizer.com/sitemap.xml` lists pages + live blogs/events
- [ ] `https://eduwizer.com/robots.txt` resolves
- [ ] Login works; profile loads; logout works
- [ ] Signup → OTP email arrives → verify → login (needs SES/SendGrid live)
- [ ] File uploads (resume/photo) succeed (needs AWS S3 live)
- [ ] Contact form + newsletter submit successfully
- [ ] Admin panel login + SEO Manager saves overrides; they appear on the site
- [ ] Submit `https://eduwizer.com/sitemap.xml` in **Google Search Console**

---

## 7. Redeploying later

```bash
git pull
# backend:
cd EduwizerBackend && npm install --omit=dev && pm2 restart eduwizer-api
# frontend:
cd ../frontend && npm install && npm run build && sudo rsync -a --delete dist/ /var/www/eduwizer/dist/
# admin:
cd ../EduwizerAdmin && npm install && npm run build && sudo rsync -a --delete dist/ /var/www/eduwizer-admin/dist/
```

---

## Known follow-ups (not blockers)
- 6 remaining backend npm vulns need the aws-sdk v2 → v3 migration.
- Auth token is in `localStorage`; moving to httpOnly cookies (more XSS-resistant)
  is feasible **after** this same-origin nginx setup — the `/api` proxy makes it possible.
- For maximum SEO, a future Next.js (SSR) migration renders meta server-side; the
  current SPA injects it via JS (Google handles it, but SSR is stronger).
