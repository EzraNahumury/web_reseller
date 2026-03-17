"use client";

import { useMemo, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const keyword = String(searchTerm || "").trim().toLowerCase();

    if (!keyword) {
      return rows;
    }

    return rows.filter((row) => {
      const searchableText = [
        row.timestamp,
        formatDateTime(row.timestamp),
        row.listReseller,
        row.periodeMulai,
        formatDateOnly(row.periodeMulai),
        row.penjualan,
        row.benefit,
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");

      return searchableText.includes(keyword);
    });
  }, [rows, searchTerm]);

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-zinc-900">Data Admin Tersimpan</h3>
          <p className="text-xs text-zinc-500">
            Total {filteredRows.length} dari {rows.length} data
          </p>
        </div>

        <div className="w-full sm:w-[320px]">
          <label htmlFor="search-admin-data" className="sr-only">
            Cari data admin tersimpan
          </label>
          <input
            id="search-admin-data"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cari reseller, periode, benefit..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full bg-white text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
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
                    className="px-4 py-10 text-center text-sm text-zinc-500"
                  >
                    Mengambil data admin...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-zinc-500"
                  >
                    Data admin tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.rowIndex}
                    className="border-t border-zinc-200 align-top text-zinc-700"
                  >
                    <td className="px-4 py-3">{formatDateTime(row.timestamp)}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">
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
                          aria-label="Update data admin"
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
                          disabled={deletingRowIndex === row.rowIndex}
                          onClick={() => onDelete(row.rowIndex)}
                          aria-label="Delete data admin"
                          title="Delete"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-700 text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                        >
                          {deletingRowIndex === row.rowIndex ? (
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

