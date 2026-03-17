"use client";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminDataTable({
  rows,
  isLoading,
  onEdit,
  onDelete,
  deletingRowIndex,
}) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Data Admin Tersimpan</h3>
        <p className="text-xs text-slate-500">Total {rows.length} data</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full bg-white text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">Tanggal Input</th>
                <th className="px-4 py-3 font-semibold">List Reseller</th>
                <th className="px-4 py-3 font-semibold">Periode Mulai</th>
                <th className="px-4 py-3 font-semibold">Penjualan</th>
                <th className="px-4 py-3 font-semibold">Benefit</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Mengambil data admin...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Belum ada data admin.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.rowIndex}
                    className="border-t border-slate-200 align-top text-slate-700"
                  >
                    <td className="px-4 py-3">{formatDateTime(row.timestamp)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {row.listReseller || "-"}
                    </td>
                    <td className="px-4 py-3">{formatDateOnly(row.periodeMulai)}</td>
                    <td className="px-4 py-3">{row.penjualan || "-"}</td>
                    <td className="px-4 py-3">{row.benefit || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800"
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
                          Update
                        </button>
                        <button
                          type="button"
                          disabled={deletingRowIndex === row.rowIndex}
                          onClick={() => onDelete(row.rowIndex)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {deletingRowIndex === row.rowIndex ? (
                            "Menghapus..."
                          ) : (
                            <>
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
                              Delete
                            </>
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
