"use client";

import { useState } from "react";

export default function BenefitManager({
  benefitOptions,
  isSubmitting,
  errorMessage,
  successMessage,
  onAddBenefit,
  onDeleteBenefit,
}) {
  const [newBenefit, setNewBenefit] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");

  const handleAdd = async (event) => {
    event.preventDefault();
    setLocalErrorMessage("");

    const value = newBenefit.trim();
    if (!value) {
      setLocalErrorMessage("Nama benefit wajib diisi.");
      return;
    }

    const isSaved = await onAddBenefit(value);
    if (!isSaved) {
      return;
    }

    setNewBenefit("");
  };

  const handleDelete = async (benefitName) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus benefit \"${benefitName}\"?`,
    );
    if (!confirmed) {
      return;
    }

    await onDeleteBenefit(benefitName);
  };

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          Pengaturan Benefit
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Kelola Master Benefit</h2>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleAdd}>
        <input
          type="text"
          value={newBenefit}
          onChange={(event) => setNewBenefit(event.target.value)}
          placeholder="Contoh: Kupon Belanja"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Menyimpan..." : "Add Benefit"}
        </button>
      </form>

      {localErrorMessage ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {localErrorMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-5 space-y-2">
        <p className="text-sm font-semibold text-slate-700">Daftar Benefit</p>
        {benefitOptions.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Belum ada benefit.
          </p>
        ) : (
          benefitOptions.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-800">{item}</span>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                disabled={isSubmitting}
                className="rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
