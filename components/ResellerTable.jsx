"use client";

import { useMemo, useState } from "react";

export default function ResellerTable({
  resellers,
  isLoading,
  deletingRowIndex,
  onEdit,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResellers = useMemo(() => {
    const keyword = String(searchTerm || "").trim().toLowerCase();

    if (!keyword) {
      return resellers;
    }

    return resellers.filter((item) => {
      const searchableText = [
        item.namaLengkap,
        item.statusResellerAyres,
        item.nomorWhatsapp,
        item.alamatLengkap,
        item.lokasiToko,
        item.jenisReseller,
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");

      return searchableText.includes(keyword);
    });
  }, [resellers, searchTerm]);

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Data Reseller</h2>
          <p className="text-xs text-zinc-500">
            Total {filteredResellers.length} dari {resellers.length} data reseller
          </p>
        </div>

        <div className="w-full sm:w-[320px]">
          <label htmlFor="search-reseller" className="sr-only">
            Cari data reseller
          </label>
          <input
            id="search-reseller"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cari nama, status, nomor, alamat..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full bg-white text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
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
                    className="px-4 py-10 text-center text-sm text-zinc-500"
                  >
                    Mengambil data reseller...
                  </td>
                </tr>
              ) : filteredResellers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-zinc-500"
                  >
                    Data reseller tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredResellers.map((item) => (
                  <tr
                    key={item.rowIndex}
                    className="border-t border-zinc-200 align-top text-zinc-700"
                  >
                    <td className="px-4 py-3 font-semibold text-zinc-800">
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
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-700 text-white transition hover:bg-red-800"
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
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-700 text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
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

