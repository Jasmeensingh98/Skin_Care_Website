# Skin Analysis & Dermatologist Panel

## Customer flow

1. **Register / Login** at http://localhost:3000
2. Go to **Skin Analysis** (`/skin-analysis`)
3. **Open camera** or **upload** a clear face photo
4. Click **Run AI analysis** — instant report (acne, redness, oiliness, dryness)
5. Click **Send to dermatologist** — report saved in MongoDB with status `pending_review`
6. View reports at **My Reports** (`/my-skin-reports`)
7. When a dermatologist reviews, status becomes `reviewed` and **recommended products** appear on the report

## Dermatologist flow

1. Login with dermatologist account:
   - **Email:** `derm@vulpine.com`
   - **Password:** `derm123456`
2. Open **Derm Panel** (`/dermatologist`)
3. Select a **pending** report
4. Add **notes** and **select products** from the catalog
5. Click **Send recommendations to customer**
6. Customer sees products on their report page

## Create dermatologist account

```bash
cd Backend
node seedDerm.js
```

## API endpoints

| Method | Route | Who |
|--------|-------|-----|
| POST | `/api/skin/analyze` | Public (preview only) |
| POST | `/api/skin/reports` | Logged-in customer |
| GET | `/api/skin/reports/my` | Customer |
| GET | `/api/skin/reports/:id` | Customer or dermatologist |
| GET | `/api/skin/reports/derm/all` | Dermatologist |
| PUT | `/api/skin/reports/:id/review` | Dermatologist |

## Optional: Azure Vision

Set in `Backend/.env` for real AI analysis:

```
AZURE_VISION_ENDPOINT=your_endpoint
AZURE_VISION_KEY=your_key
```

Without these, analysis uses image-based scoring (still unique per photo).
