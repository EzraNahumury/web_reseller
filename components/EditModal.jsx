"use client";

import { useState } from "react";

const FIELD_CONFIG = [
  { id: "namaLengkap", label: "Nama Lengkap", type: "text", required: true },
  {
    id: "statusResellerAyres",
    label: "Status Reseller Ayres",
    type: "select",
    options: ["Ayres", "Non Ayres"],
    required: true,
  },
  {
    id: "nomorWhatsapp",
    label: "Nomor Telepon / WhatsApp",
    type: "text",
    required: true,
  },
  {
    id: "alamatLengkap",
    label: "Alamat Lengkap",
    type: "text",
    required: true,
  },
  { id: "lokasiToko", label: "Lokasi Toko (Jika Ada)", type: "text" },
  {
    id: "jenisReseller",
    label: "Jenis Reseller",
    type: "select",
    options: ["Online", "Offline", "Online dan Offline"],
    required: true,
  },
];

function normalizeStatusResellerAyres(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "ayres") {
    return "Ayres";
  }
  if (text === "non ayres") {
    return "Non Ayres";
  }
  return "";
}

function normalizeJenisReseller(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "online") {
    return "Online";
  }
  if (text === "offline") {
    return "Offline";
  }
  if (
    text === "online & offline" ||
    text === "online dan offline" ||
    text === "online and offline" ||
    text === "online/offline"
  ) {
    return "Online dan Offline";
  }
  return "";
}

function mapResellerToForm(reseller) {
  return {
    namaLengkap: reseller?.namaLengkap || "",
    statusResellerAyres: normalizeStatusResellerAyres(
      reseller?.statusResellerAyres,
    ),
    nomorWhatsapp: reseller?.nomorWhatsapp || "",
    alamatLengkap: reseller?.alamatLengkap || "",
    lokasiToko: reseller?.lokasiToko || "",
    jenisReseller: normalizeJenisReseller(reseller?.jenisReseller),
  };
}

export default function EditModal({ reseller, isSaving, onClose, onSave }) {
  const [form, setForm] = useState(() => mapResellerToForm(reseller));

  if (!reseller) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      rowIndex: reseller.rowIndex,
      ...form,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
              Edit Data
            </p>
            <h3 className="mt-2 text-2xl font-bold text-zinc-900">
              Edit Reseller
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100"
          >
            Tutup
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {FIELD_CONFIG.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="mb-2 block text-sm font-semibold text-zinc-700"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.id}
                  name={field.id}
                  value={form[field.id]}
                  onChange={handleChange}
                  required={Boolean(field.required)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                >
                  <option value="" disabled>
                    Pilih {field.label}
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={form[field.id]}
                  onChange={handleChange}
                  required={Boolean(field.required)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

