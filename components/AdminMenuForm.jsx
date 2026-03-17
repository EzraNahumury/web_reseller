"use client";

import { useMemo, useState } from "react";

const PENJUALAN_OPTIONS = ["Paket", "PCS"];

function buildCheckMap(options) {
  return options.reduce((accumulator, option) => {
    accumulator[option] = false;
    return accumulator;
  }, {});
}

export default function AdminMenuForm({
  resellerOptions,
  benefitOptions,
  onSubmit,
  isSubmitting,
  errorMessage,
  successMessage,
}) {
  const [listReseller, setListReseller] = useState("");
  const [periodeMulai, setPeriodeMulai] = useState("");
  const [penjualan, setPenjualan] = useState(() =>
    buildCheckMap(PENJUALAN_OPTIONS),
  );
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [localErrorMessage, setLocalErrorMessage] = useState("");

  const selectedPenjualan = useMemo(
    () => PENJUALAN_OPTIONS.filter((item) => penjualan[item]),
    [penjualan],
  );

  const activeSelectedBenefits = useMemo(
    () => selectedBenefits.filter((item) => benefitOptions.includes(item)),
    [selectedBenefits, benefitOptions],
  );

  const togglePenjualan = (option) => {
    setPenjualan((current) => ({
      ...current,
      [option]: !current[option],
    }));
  };

  const toggleBenefit = (option) => {
    setSelectedBenefits((current) => {
      if (current.includes(option)) {
        return current.filter((item) => item !== option);
      }
      return [...current, option];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalErrorMessage("");

    if (!listReseller) {
      setLocalErrorMessage("List reseller wajib dipilih.");
      return;
    }

    if (!periodeMulai) {
      setLocalErrorMessage("Periode mulai wajib diisi.");
      return;
    }

    if (selectedPenjualan.length === 0) {
      setLocalErrorMessage("Pilih minimal satu jenis penjualan.");
      return;
    }

    if (activeSelectedBenefits.length === 0) {
      setLocalErrorMessage("Pilih minimal satu benefit.");
      return;
    }

    const isSaved = await onSubmit({
      listReseller,
      periodeMulai,
      penjualan: selectedPenjualan,
      benefits: activeSelectedBenefits,
    });

    if (!isSaved) {
      return;
    }

    setListReseller("");
    setPeriodeMulai("");
    setPenjualan(buildCheckMap(PENJUALAN_OPTIONS));
    setSelectedBenefits([]);
  };

  return (
    <section
      id="menu-admin"
      className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
          Menu Admin
        </p>
        <h2 className="mt-2 text-2xl font-bold text-zinc-900">
          Benefit Reseller
        </h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="listReseller"
            className="mb-2 block text-sm font-semibold text-zinc-700"
          >
            List Reseller
          </label>
          {resellerOptions.length === 0 ? (
            <p className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Semua reseller sudah dibuat di data admin.
            </p>
          ) : null}
          <select
            id="listReseller"
            name="listReseller"
            value={listReseller}
            onChange={(event) => setListReseller(event.target.value)}
            disabled={resellerOptions.length === 0}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            required
          >
            <option value="" disabled>
              {resellerOptions.length === 0
                ? "Tidak ada reseller tersedia"
                : "Pilih reseller"}
            </option>
            {resellerOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="periodeMulai"
            className="mb-2 block text-sm font-semibold text-zinc-700"
          >
            Periode (Mulai Kapan)
          </label>
          <input
            id="periodeMulai"
            type="date"
            value={periodeMulai}
            onChange={(event) => setPeriodeMulai(event.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            required
          />
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-zinc-700">
            Penjualan (Paket / PCS)
          </legend>
          <div className="flex flex-wrap gap-3">
            {PENJUALAN_OPTIONS.map((option) => (
              <label
                key={option}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
              >
                <input
                  type="checkbox"
                  checked={penjualan[option]}
                  onChange={() => togglePenjualan(option)}
                  className="h-4 w-4 rounded border-zinc-300 text-red-700 focus:ring-red-600"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-zinc-700">
            Admin Berikan Benefit
          </legend>
          {benefitOptions.length === 0 ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Belum ada master benefit. Tambahkan dari form kelola benefit.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {benefitOptions.map((option) => (
                <label
                  key={option}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
                >
                  <input
                    type="checkbox"
                    checked={activeSelectedBenefits.includes(option)}
                    onChange={() => toggleBenefit(option)}
                    className="h-4 w-4 rounded border-zinc-300 text-red-700 focus:ring-red-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        {localErrorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {localErrorMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={
            isSubmitting || benefitOptions.length === 0 || resellerOptions.length === 0
          }
          className="rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Data Admin"}
        </button>
      </form>
    </section>
  );
}


