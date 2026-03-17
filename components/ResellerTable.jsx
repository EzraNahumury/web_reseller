"use client";

export default function ResellerTable({
  resellers,
  isLoading,
  deletingRowIndex,
  onEdit,
  onDelete,
}) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">Data Reseller</h2>
        <p className="text-xs text-slate-500">
          Total {resellers.length} data reseller
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full bg-white text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">Nama Lengkap</th>
                <th className="px-4 py-3 font-semibold">Status Reseller Ayres</th>
                <th className="px-4 py-3 font-semibold">Nomor WhatsApp</th>
                <th className="px-4 py-3 font-semibold">Alamat Lengkap</th>
                <th className="px-4 py-3 font-semibold">Lokasi Toko</th>
                <th className="px-4 py-3 font-semibold">Jenis Reseller</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Mengambil data reseller...
                  </td>
                </tr>
              ) : resellers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Belum ada data reseller.
                  </td>
                </tr>
              ) : (
                resellers.map((item) => (
                  <tr
                    key={item.rowIndex}
                    className="border-t border-slate-200 align-top text-slate-700"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.namaLengkap || "-"}
                    </td>
                    <td className="px-4 py-3">{item.statusResellerAyres || "-"}</td>
                    <td className="px-4 py-3">{item.nomorWhatsapp || "-"}</td>
                    <td className="px-4 py-3">{item.alamatLengkap || "-"}</td>
                    <td className="px-4 py-3">{item.lokasiToko || "-"}</td>
                    <td className="px-4 py-3">{item.jenisReseller || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingRowIndex === item.rowIndex}
                          onClick={() => onDelete(item.rowIndex)}
                          className="rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {deletingRowIndex === item.rowIndex
                            ? "Menghapus..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
