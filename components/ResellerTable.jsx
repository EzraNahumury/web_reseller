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
                          aria-label="Update data reseller"
                          title="Update"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white transition hover:bg-teal-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              d="M12 20h9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          disabled={deletingRowIndex === item.rowIndex}
                          onClick={() => onDelete(item.rowIndex)}
                          aria-label="Delete data reseller"
                          title="Delete"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-700 text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {deletingRowIndex === item.rowIndex ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="h-3.5 w-3.5 animate-spin"
                            >
                              <path
                                d="M21 12a9 9 0 11-9-9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="h-3.5 w-3.5"
                            >
                              <path
                                d="M3 6h18"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8 6V4h8v2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M19 6l-1 14H6L5 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
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
