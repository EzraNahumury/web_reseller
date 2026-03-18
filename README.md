# Web Admin Reseller (Next.js + Google Sheets API)

Dashboard admin reseller dengan alur:

`Google Form -> Google Sheets -> Google Apps Script API -> Next.js Dashboard`

## Struktur

- `app/login/page.js`
- `app/dashboard/page.js`
- `app/api/resellers/route.js`
- `app/api/edit/route.js`
- `app/api/delete/route.js`
- `app/api/admin/route.js`
- `app/api/admin-benefits/route.js`
- `app/api/admin-benefits/delete/route.js`
- `components/ResellerTable.jsx`
- `components/EditModal.jsx`
- `components/AdminMenuForm.jsx`
- `components/BenefitManager.jsx`
- `lib/api.js`
- `lib/googleScriptServer.js`
- `google-apps-script/Code.gs`
- `google-apps-script/AdminCode.gs`

## Login Admin

- Email: `admin@gmail.com`
- Password: `admin`
- Session login disimpan di `localStorage` key `reseller_admin_session`.

## Setup Google Apps Script

1. Buat project Apps Script baru.
2. Copy isi `google-apps-script/Code.gs`.
3. Deploy sebagai **Web App**:
   - Execute as: `Me`
   - Who has access: `Anyone`
4. Ambil URL deployment (`.../exec`).
5. Jika update script, lakukan **Deploy > Manage deployments > Edit > Deploy** agar versi terbaru aktif.

Script sudah memakai Spreadsheet ID:

`1vgYfhR9XdC6_me_9eM0GIk1QoLJTw-hFu5dhMyS2m0w`

Default `SHEET_NAME` adalah `Form Responses 1`. Ubah di `Code.gs` jika nama sheet berbeda.

Header kolom reseller yang dipakai Apps Script (minimal):

- `Nama Lengkap`
- `Status Reseller Ayres`
- `Nomor Telepon / WhatsApp` (atau variasi `Nomor Whatsapp`)
- `Alamat Lengkap`
- `Lokasi Toko (Jika Ada)`
- `Jenis Reseller`
- `Omset` (atau variasinya seperti `Omset (Rp)`)

## Setup Google Apps Script Admin (Sheet Berbeda)

1. Buat project Apps Script admin terpisah.
2. Copy isi `google-apps-script/AdminCode.gs`.
3. Deploy sebagai **Web App** dengan akses `Anyone`.
4. Gunakan spreadsheet ID yang sama, dan script sudah diarahkan ke sheet admin dengan GID:

`130319666`

5. Script akan membuat sheet master benefit otomatis bernama `Master Benefit`.

## Setup Frontend

1. Copy `.env.example` menjadi `.env.local`.
2. Isi:

```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
NEXT_PUBLIC_GOOGLE_ADMIN_SCRIPT_URL=https://script.google.com/macros/s/ADMIN_DEPLOYMENT_ID/exec
GOOGLE_ADMIN_SCRIPT_URL=https://script.google.com/macros/s/ADMIN_DEPLOYMENT_ID/exec
```

3. Jalankan:

```bash
npm run dev
```

Catatan:
- Frontend memanggil API internal Next.js (`/api/resellers`, `/api/edit`, `/api/delete`, `/api/admin`, `/api/admin-benefits`) lalu diteruskan ke Apps Script.
- Jika muncul pesan `Apps Script meminta login Google`, deployment Apps Script Anda belum `Who has access: Anyone`.

## Endpoint API (Apps Script)

- `GET /resellers`
- `POST /edit`
- `POST /delete`
- `POST /admin-create` (khusus script AdminCode.gs)
- `GET /admin-benefits` (khusus script AdminCode.gs)
- `POST /admin-benefit-add` (khusus script AdminCode.gs)
- `POST /admin-benefit-delete` (khusus script AdminCode.gs)

Semua response dikembalikan dalam format JSON.
