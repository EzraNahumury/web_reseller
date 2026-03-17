"use client";

function normalizeJenisReseller(value) {
  const text = String(value || "").trim().toLowerCase();

  if (text === "online") {
    return "Online";
  }
  if (text === "offline") {
    return "Offline";
  }
  if (
    text === "online dan offline" ||
    text === "online & offline" ||
    text === "online and offline" ||
    text === "online/offline"
  ) {
    return "Online dan Offline";
  }
  return "Lainnya";
}

function toPercent(value, total) {
  if (!total) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

function buildConicGradient(items, total) {
  let cumulative = 0;

  const slices = items.map((item, index) => {
    const start = cumulative;
    const rawSlice = (item.count / total) * 100;
    const end = index === items.length - 1 ? 100 : cumulative + rawSlice;
    cumulative = end;
    return `${item.color} ${start}% ${end}%`;
  });

  return `conic-gradient(${slices.join(", ")})`;
}

export default function ResellerJenisChart({ resellers }) {
  const counts = resellers.reduce(
    (accumulator, item) => {
      const normalizedJenis = normalizeJenisReseller(item.jenisReseller);

      if (normalizedJenis === "Online") {
        accumulator.online += 1;
      } else if (normalizedJenis === "Offline") {
        accumulator.offline += 1;
      } else if (normalizedJenis === "Online dan Offline") {
        accumulator.onlineOffline += 1;
      } else {
        accumulator.lainnya += 1;
      }

      return accumulator;
    },
    {
      online: 0,
      offline: 0,
      onlineOffline: 0,
      lainnya: 0,
    },
  );

  const total = resellers.length;

  const chartItems = [
    {
      key: "online",
      label: "Online",
      count: counts.online,
      color: "#dc2626",
      barClass: "bg-red-600",
      badgeClass: "bg-red-50 text-red-700",
      dotClass: "bg-red-600",
    },
    {
      key: "offline",
      label: "Offline",
      count: counts.offline,
      color: "#18181b",
      barClass: "bg-zinc-700",
      badgeClass: "bg-zinc-100 text-zinc-700",
      dotClass: "bg-zinc-700",
    },
    {
      key: "online-offline",
      label: "Online dan Offline",
      count: counts.onlineOffline,
      color: "#ef4444",
      barClass: "bg-red-500",
      badgeClass: "bg-red-100 text-red-700",
      dotClass: "bg-red-500",
    },
  ];

  if (counts.lainnya > 0) {
    chartItems.push({
      key: "lainnya",
      label: "Lainnya / Kosong",
      count: counts.lainnya,
      color: "#a1a1aa",
      barClass: "bg-zinc-400",
      badgeClass: "bg-zinc-100 text-zinc-600",
      dotClass: "bg-zinc-400",
    });
  }

  const withPercent = chartItems.map((item) => ({
    ...item,
    percent: toPercent(item.count, total),
  }));

  const pieStyle = total
    ? { background: buildConicGradient(withPercent, total) }
    : { background: "#e4e4e7" };

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-zinc-900">Grafik Jenis Reseller</h2>
        <p className="text-xs text-zinc-500">Total {total} reseller</p>
      </div>

      {total === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
          Belum ada data reseller untuk ditampilkan di grafik.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="mx-auto flex w-full max-w-[280px] flex-col items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="relative h-44 w-44 rounded-full" style={pieStyle}>
              <div className="absolute inset-6 rounded-full bg-white shadow-inner" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Total
                </p>
                <p className="text-3xl font-bold text-zinc-900">{total}</p>
              </div>
            </div>

            <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {withPercent.map((item) => (
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

          <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4">
            {withPercent.map((item) => (
              <div key={item.key}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <p className="font-semibold text-zinc-700">{item.label}</p>
                  <p className="text-zinc-500">
                    {item.count} reseller ({item.percent}%)
                  </p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
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


