"use client";

function normalizeStatusResellerAyres(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "ayres") {
    return "Ayres";
  }
  return "Non Ayres";
}

function toPercent(value, total) {
  if (!total) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

export default function ResellerStatusChart({ resellers }) {
  const counts = resellers.reduce(
    (accumulator, item) => {
      const normalizedStatus = normalizeStatusResellerAyres(
        item.statusResellerAyres,
      );

      if (normalizedStatus === "Ayres") {
        accumulator.ayres += 1;
      } else {
        accumulator.nonAyres += 1;
      }

      return accumulator;
    },
    { ayres: 0, nonAyres: 0 },
  );

  const total = resellers.length;
  const ayresPercent = toPercent(counts.ayres, total);
  const nonAyresPercent = toPercent(counts.nonAyres, total);

  const pieStyle = total
    ? {
        background: `conic-gradient(#0f766e 0 ${ayresPercent}%, #334155 ${ayresPercent}% 100%)`,
      }
    : { background: "#e2e8f0" };

  const chartItems = [
    {
      key: "ayres",
      label: "Ayres",
      count: counts.ayres,
      percent: ayresPercent,
      barClass: "bg-teal-600",
      badgeClass: "bg-teal-50 text-teal-700",
      dotClass: "bg-teal-600",
    },
    {
      key: "non-ayres",
      label: "Non Ayres",
      count: counts.nonAyres,
      percent: nonAyresPercent,
      barClass: "bg-slate-700",
      badgeClass: "bg-slate-100 text-slate-700",
      dotClass: "bg-slate-700",
    },
  ];

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">Grafik Status Reseller Ayres</h2>
        <p className="text-xs text-slate-500">Total {total} reseller</p>
      </div>

      {total === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          Belum ada data reseller untuk ditampilkan di grafik.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="mx-auto flex w-full max-w-[280px] flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="relative h-44 w-44 rounded-full" style={pieStyle}>
              <div className="absolute inset-6 rounded-full bg-white shadow-inner" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Total
                </p>
                <p className="text-3xl font-bold text-slate-900">{total}</p>
              </div>
            </div>

            <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {chartItems.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${item.badgeClass}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`} />
                    {item.label}
                  </span>
                  <span>{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            {chartItems.map((item) => (
              <div key={item.key}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <p className="font-semibold text-slate-700">{item.label}</p>
                  <p className="text-slate-500">
                    {item.count} reseller ({item.percent}%)
                  </p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.barClass}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
