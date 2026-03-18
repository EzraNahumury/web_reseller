"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ResellerTable from "@/components/ResellerTable";
import ResellerStatusChart from "@/components/ResellerStatusChart";
import ResellerJenisChart from "@/components/ResellerJenisChart";
import EditModal from "@/components/EditModal";
import ResellerViewModal from "@/components/ResellerViewModal";
import AdminMenuForm from "@/components/AdminMenuForm";
import BenefitManager from "@/components/BenefitManager";
import AdminDataTable from "@/components/AdminDataTable";
import AdminEditModal from "@/components/AdminEditModal";
import {
  addAdminBenefitOption,
  createAdminBenefit,
  deleteAdminRow,
  deleteAdminBenefitOption,
  updateAdminRow,
  fetchAdminRows,
  deleteResellerByRow,
  fetchAdminBenefits,
  fetchResellers,
  updateResellerByRow,
} from "@/lib/api";

const SESSION_KEY = "reseller_admin_session";

export default function DashboardPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("data-reseller");
  const [errorMessage, setErrorMessage] = useState("");
  const [resellers, setResellers] = useState([]);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [selectedResellerView, setSelectedResellerView] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingRowIndex, setDeletingRowIndex] = useState(null);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [adminErrorMessage, setAdminErrorMessage] = useState("");
  const [adminSuccessMessage, setAdminSuccessMessage] = useState("");
  const [benefitOptions, setBenefitOptions] = useState([]);
  const [isManagingBenefit, setIsManagingBenefit] = useState(false);
  const [benefitErrorMessage, setBenefitErrorMessage] = useState("");
  const [benefitSuccessMessage, setBenefitSuccessMessage] = useState("");
  const [adminRows, setAdminRows] = useState([]);
  const [isLoadingAdminRows, setIsLoadingAdminRows] = useState(false);
  const [adminRowsErrorMessage, setAdminRowsErrorMessage] = useState("");
  const [selectedAdminRow, setSelectedAdminRow] = useState(null);
  const [isSavingAdminRow, setIsSavingAdminRow] = useState(false);
  const [deletingAdminRowIndex, setDeletingAdminRowIndex] = useState(null);

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

  const loadBenefitOptions = useCallback(async () => {
    setBenefitErrorMessage("");
    try {
      const data = await fetchAdminBenefits();
      setBenefitOptions(data);
    } catch (error) {
      setBenefitErrorMessage(error.message || "Gagal mengambil daftar benefit.");
    }
  }, []);

  const loadAdminRows = useCallback(async () => {
    setIsLoadingAdminRows(true);
    setAdminRowsErrorMessage("");
    try {
      const data = await fetchAdminRows();
      setAdminRows(data);
    } catch (error) {
      setAdminRowsErrorMessage(
        error.message || "Gagal mengambil data admin tersimpan.",
      );
    } finally {
      setIsLoadingAdminRows(false);
    }
  }, []);

  const handleRefresh = async () => {
    await Promise.all([loadResellers(), loadBenefitOptions(), loadAdminRows()]);
  };

  useEffect(() => {
    if (isCheckingSession) {
      return;
    }

    loadResellers();
    loadBenefitOptions();
    loadAdminRows();
  }, [isCheckingSession, loadResellers, loadBenefitOptions, loadAdminRows]);

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

  const handleSubmitAdminBenefit = async (payload) => {
    setIsSubmittingAdmin(true);
    setAdminErrorMessage("");
    setAdminSuccessMessage("");

    try {
      await createAdminBenefit(payload);
      await loadAdminRows();
      setAdminSuccessMessage("Data admin berhasil disimpan.");
      return true;
    } catch (error) {
      setAdminErrorMessage(error.message || "Gagal menyimpan data admin.");
      return false;
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const handleAddBenefit = async (benefitName) => {
    setIsManagingBenefit(true);
    setBenefitErrorMessage("");
    setBenefitSuccessMessage("");

    try {
      await addAdminBenefitOption(benefitName);
      await loadBenefitOptions();
      setBenefitSuccessMessage("Benefit berhasil ditambahkan.");
      return true;
    } catch (error) {
      setBenefitErrorMessage(error.message || "Gagal menambahkan benefit.");
      return false;
    } finally {
      setIsManagingBenefit(false);
    }
  };

  const handleDeleteBenefit = async (benefitName) => {
    setIsManagingBenefit(true);
    setBenefitErrorMessage("");
    setBenefitSuccessMessage("");

    try {
      await deleteAdminBenefitOption(benefitName);
      await loadBenefitOptions();
      setBenefitSuccessMessage("Benefit berhasil dihapus.");
      return true;
    } catch (error) {
      setBenefitErrorMessage(error.message || "Gagal menghapus benefit.");
      return false;
    } finally {
      setIsManagingBenefit(false);
    }
  };

  const handleUpdateAdminRow = async (payload) => {
    setIsSavingAdminRow(true);
    setAdminRowsErrorMessage("");
    try {
      await updateAdminRow(payload);
      setSelectedAdminRow(null);
      await loadAdminRows();
    } catch (error) {
      setAdminRowsErrorMessage(error.message || "Gagal update data admin.");
    } finally {
      setIsSavingAdminRow(false);
    }
  };

  const handleDeleteAdminRow = async (rowIndex) => {
    const isConfirmed = window.confirm(
      "Yakin ingin menghapus data admin tersimpan ini?",
    );
    if (!isConfirmed) {
      return;
    }

    setDeletingAdminRowIndex(rowIndex);
    setAdminRowsErrorMessage("");
    try {
      await deleteAdminRow(rowIndex);
      await loadAdminRows();
    } catch (error) {
      setAdminRowsErrorMessage(error.message || "Gagal menghapus data admin.");
    } finally {
      setDeletingAdminRowIndex(null);
    }
  };

  const resellerOptions = Array.from(
    new Set(
      resellers
        .map((item) => item.namaLengkap)
        .filter((item) => item && item.trim().length > 0),
    ),
  );

  const usedResellerMap = adminRows.reduce((accumulator, item) => {
    const key = String(item.listReseller || "").trim().toLowerCase();
    if (key) {
      accumulator[key] = true;
    }
    return accumulator;
  }, {});

  const availableResellerOptions = resellerOptions.filter(
    (name) => !usedResellerMap[String(name).trim().toLowerCase()],
  );

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-4 text-sm text-zinc-600 shadow-sm">
          Memeriksa sesi login...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section
          id="dashboard-header"
          className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="rounded-2xl bg-zinc-950 px-4 py-3">
              <Image
                src="/logo/ayres-logo.png"
                alt="Logo Ayres"
                width={220}
                height={56}
                className="h-9 w-auto object-contain sm:h-10"
                priority
              />
            </div>

            <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-2 py-2">
              <button
                type="button"
                onClick={() => setActiveMenu("data-reseller")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeMenu === "data-reseller"
                    ? "bg-red-700 text-white"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Data Reseller
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu("menu-admin")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeMenu === "menu-admin"
                    ? "bg-red-700 text-white"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Admin
              </button>
            </nav>

            <div className="flex gap-2 lg:justify-end">
              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-red-500 hover:text-red-700"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        {activeMenu === "data-reseller" && errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {activeMenu === "data-reseller" ? (
          <div id="data-reseller" className="space-y-6">
            <ResellerTable
              resellers={resellers}
              isLoading={isLoading}
              deletingRowIndex={deletingRowIndex}
              onView={setSelectedResellerView}
              onEdit={setSelectedReseller}
              onDelete={handleDelete}
            />
            <ResellerStatusChart resellers={resellers} />
            <ResellerJenisChart resellers={resellers} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <BenefitManager
                benefitOptions={benefitOptions}
                isSubmitting={isManagingBenefit}
                errorMessage={benefitErrorMessage}
                successMessage={benefitSuccessMessage}
                onAddBenefit={handleAddBenefit}
                onDeleteBenefit={handleDeleteBenefit}
              />
              <AdminMenuForm
                resellerOptions={availableResellerOptions}
                benefitOptions={benefitOptions}
                onSubmit={handleSubmitAdminBenefit}
                isSubmitting={isSubmittingAdmin}
                errorMessage={adminErrorMessage}
                successMessage={adminSuccessMessage}
              />
            </div>

            {adminRowsErrorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {adminRowsErrorMessage}
              </div>
            ) : null}

            <AdminDataTable
              rows={adminRows}
              isLoading={isLoadingAdminRows}
              onEdit={setSelectedAdminRow}
              onDelete={handleDeleteAdminRow}
              deletingRowIndex={deletingAdminRowIndex}
            />
          </div>
        )}
      </div>

      {selectedAdminRow ? (
        <AdminEditModal
          row={selectedAdminRow}
          benefitOptions={benefitOptions}
          isSaving={isSavingAdminRow}
          onClose={() => setSelectedAdminRow(null)}
          onSave={handleUpdateAdminRow}
        />
      ) : null}

      {selectedReseller ? (
        <EditModal
          key={selectedReseller.rowIndex}
          reseller={selectedReseller}
          isSaving={isSaving}
          onClose={() => setSelectedReseller(null)}
          onSave={handleEditSave}
        />
      ) : null}

      {selectedResellerView ? (
        <ResellerViewModal
          reseller={selectedResellerView}
          onClose={() => setSelectedResellerView(null)}
        />
      ) : null}
    </main>
  );
}



