const APPS_SCRIPT_BASE_URL =
  process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

function getAppsScriptUrl(action) {
  if (!APPS_SCRIPT_BASE_URL) {
    throw new Error(
      "URL Google Apps Script belum diset. Isi GOOGLE_SCRIPT_URL atau NEXT_PUBLIC_GOOGLE_SCRIPT_URL.",
    );
  }

  const url = new URL(APPS_SCRIPT_BASE_URL);
  url.searchParams.set("action", action);
  return url.toString();
}

function toShortText(raw) {
  return String(raw || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export async function requestGoogleScript(action, options = {}) {
  const hasBody = options.body !== undefined;
  const response = await fetch(getAppsScriptUrl(action), {
    method: options.method || "GET",
    cache: "no-store",
    redirect: "follow",
    headers: hasBody
      ? {
          "Content-Type": "text/plain;charset=utf-8",
        }
      : undefined,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  const raw = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    throw new Error(`Apps Script error (${response.status}): ${toShortText(raw)}`);
  }

  if (!contentType.toLowerCase().includes("json")) {
    const shortBody = toShortText(raw);
    if (shortBody.toLowerCase().includes("accounts.google.com")) {
      throw new Error(
        "Apps Script meminta login Google. Deploy ulang Web App dengan akses Anyone.",
      );
    }
    throw new Error(`Response Apps Script bukan JSON: ${shortBody}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Response Apps Script tidak valid (bukan JSON).");
  }

  if (data.success === false) {
    throw new Error(data.message || "Apps Script mengembalikan error.");
  }

  return data;
}
