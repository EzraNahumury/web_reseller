"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
        <section
          id="admin"
          className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="rounded-2xl bg-slate-950 px-4 py-3">
              <Image
                src="/logo/ayres-logo.png"
                alt="Logo Ayres"
                width={220}
                height={56}
                className="h-9 w-auto object-contain sm:h-10"
                priority
              />
            </div>

            <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2">
              <a
                href="#data-reseller"
                className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Data Reseller
              </a>
              <a
                href="#admin"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Admin
              </a>
            </nav>

            <div className="flex gap-2 lg:justify-end">
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

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div id="data-reseller">
          <ResellerTable
            resellers={resellers}
            isLoading={isLoading}
            deletingRowIndex={deletingRowIndex}
            onEdit={setSelectedReseller}
            onDelete={handleDelete}
          />
        </div>
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
