async function parseResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Response API tidak valid (bukan JSON).");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Permintaan API gagal.");
  }

  return data;
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    cache: "no-store",
    ...options,
  });

  return parseResponse(response);
}

export async function fetchResellers() {
  const result = await request("/api/resellers", { method: "GET" });
  return Array.isArray(result.data) ? result.data : [];
}

export async function updateResellerByRow(payload) {
  return request("/api/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteResellerByRow(rowIndex) {
  return request("/api/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rowIndex }),
  });
}
