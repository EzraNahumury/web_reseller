const SPREADSHEET_ID = "1vgYfhR9XdC6_me_9eM0GIk1QoLJTw-hFu5dhMyS2m0w";
const SHEET_NAME = "Form Responses 1";
const SCRIPT_VERSION = "v2";

const FIELD_MAP = [
  { header: "Nama Lengkap", key: "namaLengkap" },
  { header: "Status Reseller Ayres", key: "statusResellerAyres" },
  { header: "Nomor Telepon / WhatsApp", key: "nomorWhatsapp" },
  { header: "Alamat Lengkap", key: "alamatLengkap" },
  { header: "Lokasi Toko (Jika Ada)", key: "lokasiToko" },
  { header: "Jaringan Pasar", key: "jaringanPasar" },
  { header: "Jenis Reseller", key: "jenisReseller" },
  { header: "Akun Instagram usaha", key: "akunInstagramUsaha" },
  {
    header: "Pengalaman berjualan jersey",
    key: "pengalamanBerjualanJersey",
  },
  {
    header: "Pengalaman sebagai reseller Ayres",
    key: "pengalamanResellerAyres",
  },
  { header: "Omset", key: "omset" },
];

function doGet(e) {
  try {
    const route = getRoute_(e);

    if (route === "/ping") {
      return toJson_({
        success: true,
        message: "pong",
        data: {
          route,
          version: SCRIPT_VERSION,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (route === "/resellers") {
      return toJson_({
        success: true,
        message: "Berhasil mengambil data reseller.",
        data: getResellers_(),
      });
    }

    if (route === "/admin-list") {
      return toJson_({
        success: true,
        message: "Berhasil mengambil data admin.",
        data: getAdminRows_(),
      });
    }

    if (route === "/admin-benefits") {
      return toJson_({
        success: true,
        message: "Berhasil mengambil daftar benefit.",
        data: getBenefitList_(),
      });
    }

    if (route === "/debug-headers") {
      const sheet = getSheet_();
      const lastColumn = sheet.getLastColumn();
      const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
      return toJson_({
        success: true,
        message: "Debug headers",
        data: {
          headerRow,
          normalized: headerRow.map((h) => normalizeHeaderKey_(h)),
          expected: FIELD_MAP.map((f) => ({ field: f.header, normalized: normalizeHeaderKey_(f.header) })),
        },
      });
    }

    return toJson_({
      success: false,
      message: `Endpoint GET tidak ditemukan: ${route}`,
    });
  } catch (error) {
    return toJson_({
      success: false,
      message: error.message,
    });
  }
}

function doPost(e) {
  try {
    const route = getRoute_(e);
    const payload = getPayload_(e);

    if (route === "/edit") {
      editReseller_(payload);
      return toJson_({
        success: true,
        message: "Data reseller berhasil diupdate.",
      });
    }

    if (route === "/delete") {
      deleteReseller_(payload);
      return toJson_({
        success: true,
        message: "Data reseller berhasil dihapus.",
      });
    }

    if (route === "/admin-create") {
      createAdminRow_(payload);
      return toJson_({
        success: true,
        message: "Data admin berhasil disimpan.",
      });
    }

    if (route === "/admin-update") {
      updateAdminRow_(payload);
      return toJson_({
        success: true,
        message: "Data admin berhasil diupdate.",
      });
    }

    if (route === "/admin-delete") {
      deleteAdminRow_(payload);
      return toJson_({
        success: true,
        message: "Data admin berhasil dihapus.",
      });
    }

    if (route === "/admin-benefit-add") {
      addBenefit_(payload);
      return toJson_({
        success: true,
        message: "Benefit berhasil ditambahkan.",
        data: getBenefitList_(),
      });
    }

    if (route === "/admin-benefit-delete") {
      deleteBenefit_(payload);
      return toJson_({
        success: true,
        message: "Benefit berhasil dihapus.",
        data: getBenefitList_(),
      });
    }

    return toJson_({
      success: false,
      message: `Endpoint POST tidak ditemukan: ${route}`,
    });
  } catch (error) {
    return toJson_({
      success: false,
      message: error.message,
    });
  }
}

function getResellers_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  let lastColumn = sheet.getLastColumn();

  if (lastRow < 2) {
    return [];
  }

  const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const headerMap = ensureFieldHeaders_(sheet, headerRow);

  // If ensureFieldHeaders_ added new columns, update lastColumn and headerRow
  lastColumn = headerRow.length;

  const rows = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();

  return rows.map((row, rowOffset) => {
    const item = {
      rowIndex: rowOffset + 2,
    };

    FIELD_MAP.forEach((field) => {
      const headerIndex = findHeaderIndex_(headerRow, field.header);
      item[field.key] =
        headerIndex === -1 ? "" : String(row[headerIndex] || "").trim();
    });

    return item;
  });
}

function editReseller_(payload) {
  const rowIndex = Number(payload.rowIndex);
  if (!Number.isInteger(rowIndex) || rowIndex < 2) {
    throw new Error("rowIndex tidak valid untuk edit.");
  }

  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  let lastColumn = sheet.getLastColumn();

  if (rowIndex > lastRow) {
    throw new Error("Data tidak ditemukan. rowIndex melebihi jumlah row.");
  }

  const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const headerMap = ensureFieldHeaders_(sheet, headerRow);

  // If ensureFieldHeaders_ added new columns, update lastColumn and ensure we read full row
  lastColumn = headerRow.length;

  const currentRow = sheet.getRange(rowIndex, 1, 1, lastColumn).getValues()[0];

  FIELD_MAP.forEach((field) => {
    const headerIndex = findHeaderIndex_(headerRow, field.header);
    if (headerIndex === -1) {
      return;
    }

    if (payload[field.key] === undefined) {
      return;
    }

    currentRow[headerIndex] = String(payload[field.key]).trim();
  });

  sheet.getRange(rowIndex, 1, 1, lastColumn).setValues([currentRow]);
}

function deleteReseller_(payload) {
  const rowIndex = Number(payload.rowIndex);
  if (!Number.isInteger(rowIndex) || rowIndex < 2) {
    throw new Error("rowIndex tidak valid untuk delete.");
  }

  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  if (rowIndex > lastRow) {
    throw new Error("Data tidak ditemukan. rowIndex melebihi jumlah row.");
  }

  sheet.deleteRow(rowIndex);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];

  if (!sheet) {
    throw new Error("Sheet tidak ditemukan.");
  }

  return sheet;
}

function normalizeHeaderKey_(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // remove parentheses content, e.g. "Omset (Rp)"
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");
}

function makeHeaderMap_(headerRow) {
  const map = {};
  headerRow.forEach((name, index) => {
    const key = normalizeHeaderKey_(name);
    if (key) {
      map[key] = index;
    }
  });
  return map;
}

function findHeaderIndex_(headerRow, fieldHeader) {
  const normField = normalizeHeaderKey_(fieldHeader);
  if (!normField) return -1;

  const normalizedRow = headerRow.map((cell) => normalizeHeaderKey_(cell));
  const exact = normalizedRow.indexOf(normField);
  if (exact !== -1) return exact;

  // Try substring match (e.g. "nomor whatsapp" vs "nomor telepon whatsapp")
  for (let i = 0; i < normalizedRow.length; i++) {
    const cell = normalizedRow[i];
    if (!cell) continue;
    if (cell.includes(normField) || normField.includes(cell)) {
      return i;
    }
  }

  // Fallback: match by sharing significant words (length >= 3)
  const fieldWords = normField.split(" ").filter((w) => w.length >= 3);
  if (fieldWords.length === 0) return -1;

  for (let i = 0; i < normalizedRow.length; i++) {
    const cell = normalizedRow[i];
    if (!cell) continue;
    const matchCount = fieldWords.filter((word) => cell.includes(word)).length;
    if (matchCount >= 1) {
      return i;
    }
  }

  return -1;
}

function ensureFieldHeaders_(sheet, headerRow) {
  let updated = false;

  FIELD_MAP.forEach((field) => {
    if (findHeaderIndex_(headerRow, field.header) === -1) {
      headerRow.push(field.header);
      updated = true;
    }
  });

  if (updated) {
    sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
  }

  return headerRow;
}

function getRoute_(e) {
  const pathInfo = e && e.pathInfo ? String(e.pathInfo) : "";
  const queryAction =
    e && e.parameter && e.parameter.action ? String(e.parameter.action) : "";

  const routeSource = pathInfo || queryAction;
  if (!routeSource) {
    return "/";
  }

  return `/${routeSource.replace(/^\/+|\/+$/g, "")}`;
}

function getPayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error("Body request harus berupa JSON valid.");
  }
}

function toJson_(data) {
  const payload =
    data && typeof data === "object" && !Array.isArray(data)
      ? { version: SCRIPT_VERSION, ...data }
      : data;

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}