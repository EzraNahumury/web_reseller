"use client";

import { useState } from "react";

const PENJUALAN_OPTIONS = ["Paket", "PCS"];

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normalizeDateInput(value) {
  if (!value) {
    return "";
  }

  const asText = String(value).trim();
  const isoMatch = asText.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) {
    return isoMatch[1];
  }

  const date = new Date(asText);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildInitialForm(row) {
  return {
    listReseller: row?.listReseller || "",
    periodeMulai: normalizeDateInput(row?.periodeMulai),
    penjualan: splitList(row?.penjualan),
    benefits: splitList(row?.benefit),
  };
}

export default function AdminEditModal({
  row,
  benefitOptions,
  isSaving,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => buildInitialForm(row));
  const [errorMessage, setErrorMessage] = useState("");

  if (!row) {
    return null;
  }

  const toggleArrayValue = (field, value) => {
    setForm((current) => {
      const list = current[field] || [];
      if (list.includes(value)) {
        return {
          ...current,
          [field]: list.filter((item) => item !== value),
        };
      }

      return {
        ...current,
        [field]: [...list, value],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.listReseller) {
      setErrorMessage("List reseller wajib tersedia.");
      return;
    }

    if (!form.periodeMulai) {
      setErrorMessage("Periode mulai wajib diisi.");
      return;
    }

    if (form.penjualan.length === 0) {
      setErrorMessage("Pilih minimal satu jenis penjualan.");
      return;
    }

    if (form.benefits.length === 0) {
      setErrorMessage("Pilih minimal satu benefit.");
      return;
    }

    onSave({
      rowIndex: row.rowIndex,
      listReseller: form.listReseller,
      periodeMulai: form.periodeMulai,
      penjualan: form.penjualan,
      benefits: form.benefits,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Edit Data Admin
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Update Data Tersimpan
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="adminListResellerReadonly"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              List Reseller
            </label>
            <input
              id="adminListResellerReadonly"
              type="text"
              value={form.listReseller}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="adminPeriode"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Periode (Mulai Kapan)
            </label>
            <input
              id="adminPeriode"
              type="date"
              value={form.periodeMulai}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  periodeMulai: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              required
            />
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-semibold text-slate-700">
              Penjualan (Paket / PCS)
            </legend>
            <div className="flex flex-wrap gap-3">
              {PENJUALAN_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={form.penjualan.includes(option)}
                    onChange={() => toggleArrayValue("penjualan", option)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 block text-sm font-semibold text-slate-700">
              Admin Berikan Benefit
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefitOptions.map((option) => (
                <label
                  key={option}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={form.benefits.includes(option)}
                    onChange={() => toggleArrayValue("benefits", option)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          {errorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
