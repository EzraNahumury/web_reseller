"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ResellerTable from "@/components/ResellerTable";
import EditModal from "@/components/EditModal";
import {
  deleteResellerByRow,
  fetchResellers,
  updateResellerByRow,
} from "@/lib/api";

const SESSION_KEY = "reseller_admin_session";

export default function DashboardPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("admin@gmail.com");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [resellers, setResellers] = useState([]);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingRowIndex, setDeletingRowIndex] = useState(null);

  useEffect(() => {
    const sessionRaw = localStorage.getItem(SESSION_KEY);

    if (!sessionRaw) {
      router.replace("/login");
      return;
    }

    try {
      const session = JSON.parse(sessionRaw);
      if (!session?.email) {
        localStorage.removeItem(SESSION_KEY);
        router.replace("/login");
        return;
      }
      setAdminEmail(session.email);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      router.replace("/login");
      return;
    }

    setIsCheckingSession(false);
  }, [router]);

  const loadResellers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchResellers();
      setResellers(data);
    } catch (error) {
      setErrorMessage(error.message || "Gagal mengambil data reseller.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isCheckingSession) {
      return;
    }

    loadResellers();
  }, [isCheckingSession, loadResellers]);

  const dashboardStats = useMemo(() => {
    const withStore = resellers.filter(
      (item) => item.lokasiToko && item.lokasiToko.trim().length > 0,
    ).length;
    const statusAktif = resellers.filter(
      (item) =>
        item.statusResellerAyres &&
        item.statusResellerAyres.toLowerCase().includes("aktif"),
    ).length;
    const jenisCount = new Set(
      resellers
        .map((item) => item.jenisReseller)
        .filter((item) => item && item.trim().length > 0),
    ).size;

    return { withStore, statusAktif, jenisCount };
  }, [resellers]);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    router.replace("/login");
  };

  const handleEditSave = async (payload) => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      await updateResellerByRow(payload);
      setSelectedReseller(null);
      await loadResellers();
    } catch (error) {
      setErrorMessage(error.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (rowIndex) => {
    const isConfirmed = window.confirm(
      "Yakin ingin menghapus data reseller ini?",
    );
    if (!isConfirmed) {
      return;
    }

    setDeletingRowIndex(rowIndex);
    setErrorMessage("");
    try {
      await deleteResellerByRow(rowIndex);
      await loadResellers();
    } catch (error) {
      setErrorMessage(error.message || "Gagal menghapus data reseller.");
    } finally {
      setDeletingRowIndex(null);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-4 text-sm text-slate-600 shadow-sm">
          Memeriksa sesi login...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Dashboard Admin
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Web Admin Reseller
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Login sebagai <span className="font-semibold">{adminEmail}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadResellers}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Data
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {resellers.length}
            </p>
          </article>
          <article className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status Aktif
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {dashboardStats.statusAktif}
            </p>
          </article>
          <article className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jenis Reseller
            </p>
            <p className="mt-2 text-3xl font-bold text-teal-700">
              {dashboardStats.jenisCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {dashboardStats.withStore} reseller punya lokasi toko
            </p>
          </article>
        </section>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <ResellerTable
          resellers={resellers}
          isLoading={isLoading}
          deletingRowIndex={deletingRowIndex}
          onEdit={setSelectedReseller}
          onDelete={handleDelete}
        />
      </div>

      {selectedReseller ? (
        <EditModal
          key={selectedReseller.rowIndex}
          reseller={selectedReseller}
          isSaving={isSaving}
          onClose={() => setSelectedReseller(null)}
          onSave={handleEditSave}
        />
      ) : null}
    </main>
  );
}
