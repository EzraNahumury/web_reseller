"use client";

export default function ResellerViewModal({ reseller, onClose }) {
  if (!reseller) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
              View Data
            </p>
            <h3 className="mt-2 text-2xl font-bold text-zinc-900">Detail Reseller</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100"
          >
            Tutup
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-zinc-500">Nama Lengkap</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.namaLengkap || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Status Reseller Ayres</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.statusResellerAyres || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Nomor WhatsApp</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.nomorWhatsapp || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Alamat Lengkap</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.alamatLengkap || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Lokasi Toko</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.lokasiToko || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Jaringan Pasar</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.jaringanPasar || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Jenis Reseller</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.jenisReseller || "-"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-zinc-500">Akun Instagram Usaha</p>
            <p className="mt-1 text-sm text-zinc-900">
              {reseller.akunInstagramUsaha || "-"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-zinc-500">
              Pengalaman berjualan jersey
            </p>
            <p className="mt-1 text-sm text-zinc-900">
              {reseller.pengalamanBerjualanJersey || "-"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-zinc-500">
              Pengalaman sebagai reseller Ayres
            </p>
            <p className="mt-1 text-sm text-zinc-900">
              {reseller.pengalamanResellerAyres || "-"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-zinc-500">Omset</p>
            <p className="mt-1 text-sm text-zinc-900">{reseller.omset || "-"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
