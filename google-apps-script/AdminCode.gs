const ADMIN_SPREADSHEET_ID = "1vgYfhR9XdC6_me_9eM0GIk1QoLJTw-hFu5dhMyS2m0w";
const ADMIN_SHEET_GID = 130319666;
const ADMIN_SHEET_NAME = "Admin";
const BENEFIT_MASTER_SHEET_NAME = "Master Benefit";
const BENEFIT_SEED_FLAG = "ADMIN_BENEFIT_DEFAULT_SEEDED";

const DEFAULT_BENEFITS = [
  "Logo 3D",
  "Kaos Kaki",
  "Bola",
  "Free Jersey",
  "Gratis Ongkir / Subsidi Ongkir",
  "Cashback",
];

const ADMIN_HEADERS = [
  "Timestamp",
  "List Reseller",
  "Periode Mulai",
  "Penjualan",
  "Benefit",
];

const BENEFIT_HEADERS = ["Benefit"];

function doGet(e) {
  try {
    const action = getAction_(e);

    if (action === "admin-list") {
      return toJson_({
        success: true,
        message: "Berhasil mengambil data admin.",
        data: getAdminRows_(),
      });
    }

    if (action === "admin-benefits") {
      return toJson_({
        success: true,
        message: "Berhasil mengambil daftar benefit.",
        data: getBenefitList_(),
      });
    }

    return toJson_({
      success: false,
      message: `Endpoint GET tidak ditemukan: ${action || "/"}`,
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
    const action = getAction_(e);
    const payload = getPayload_(e);

    if (action === "admin-create") {
      createAdminRow_(payload);
      return toJson_({
        success: true,
        message: "Data admin berhasil disimpan.",
      });
    }

    if (action === "admin-update") {
      updateAdminRow_(payload);
      return toJson_({
        success: true,
        message: "Data admin berhasil diupdate.",
      });
    }

    if (action === "admin-delete") {
      deleteAdminRow_(payload);
      return toJson_({
        success: true,
        message: "Data admin berhasil dihapus.",
      });
    }

    if (action === "admin-benefit-add") {
      addBenefit_(payload);
      return toJson_({
        success: true,
        message: "Benefit berhasil ditambahkan.",
        data: getBenefitList_(),
      });
    }

    if (action === "admin-benefit-delete") {
      deleteBenefit_(payload);
      return toJson_({
        success: true,
        message: "Benefit berhasil dihapus.",
        data: getBenefitList_(),
      });
    }

    return toJson_({
      success: false,
      message: `Endpoint POST tidak ditemukan: ${action || "/"}`,
    });
  } catch (error) {
    return toJson_({
      success: false,
      message: error.message,
    });
  }
}

function createAdminRow_(payload) {
  const listReseller = String(payload.listReseller || "").trim();
  const periodeMulai = String(payload.periodeMulai || "").trim();
  const penjualan = normalizeArray_(payload.penjualan);
  const benefits = normalizeArray_(payload.benefits);
  validateAdminPayload_(listReseller, periodeMulai, penjualan, benefits);

  const sheet = getAdminSheet_();
  ensureHeaderRow_(sheet, ADMIN_HEADERS);

  sheet.appendRow([
    new Date(),
    listReseller,
    periodeMulai,
    penjualan.join(", "),
    benefits.join(", "),
  ]);
}

function updateAdminRow_(payload) {
  const rowIndex = Number(payload.rowIndex);
  if (!Number.isInteger(rowIndex) || rowIndex < 2) {
    throw new Error("rowIndex tidak valid untuk update.");
  }

  const listReseller = String(payload.listReseller || "").trim();
  const periodeMulai = String(payload.periodeMulai || "").trim();
  const penjualan = normalizeArray_(payload.penjualan);
  const benefits = normalizeArray_(payload.benefits);
  validateAdminPayload_(listReseller, periodeMulai, penjualan, benefits);

  const sheet = getAdminSheet_();
  ensureHeaderRow_(sheet, ADMIN_HEADERS);

  const lastRow = sheet.getLastRow();
  if (rowIndex > lastRow) {
    throw new Error("Data admin tidak ditemukan.");
  }

  const current =
    sheet.getRange(rowIndex, 1, 1, ADMIN_HEADERS.length).getValues()[0];
  current[1] = listReseller;
  current[2] = periodeMulai;
  current[3] = penjualan.join(", ");
  current[4] = benefits.join(", ");

  sheet.getRange(rowIndex, 1, 1, ADMIN_HEADERS.length).setValues([current]);
}

function deleteAdminRow_(payload) {
  const rowIndex = Number(payload.rowIndex);
  if (!Number.isInteger(rowIndex) || rowIndex < 2) {
    throw new Error("rowIndex tidak valid untuk delete.");
  }

  const sheet = getAdminSheet_();
  ensureHeaderRow_(sheet, ADMIN_HEADERS);

  const lastRow = sheet.getLastRow();
  if (rowIndex > lastRow) {
    throw new Error("Data admin tidak ditemukan.");
  }

  sheet.deleteRow(rowIndex);
}

function validateAdminPayload_(listReseller, periodeMulai, penjualan, benefits) {
  const masterBenefits = getBenefitList_();

  if (!listReseller) {
    throw new Error("List reseller wajib diisi.");
  }

  if (!periodeMulai) {
    throw new Error("Periode mulai wajib diisi.");
  }

  if (penjualan.length === 0) {
    throw new Error("Pilih minimal satu jenis penjualan.");
  }

  if (benefits.length === 0) {
    throw new Error("Pilih minimal satu benefit.");
  }

  const invalidBenefits = benefits.filter(function (item) {
    return masterBenefits.indexOf(item) === -1;
  });

  if (invalidBenefits.length > 0) {
    throw new Error(`Benefit tidak valid: ${invalidBenefits.join(", ")}`);
  }
}

function getAdminRows_() {
  const sheet = getAdminSheet_();
  ensureHeaderRow_(sheet, ADMIN_HEADERS);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }

  const rows =
    sheet.getRange(2, 1, lastRow - 1, ADMIN_HEADERS.length).getValues();

  return rows.map(function (row, index) {
    return {
      rowIndex: index + 2,
      timestamp: row[0],
      listReseller: String(row[1] || "").trim(),
      periodeMulai: String(row[2] || "").trim(),
      penjualan: String(row[3] || "").trim(),
      benefit: String(row[4] || "").trim(),
    };
  });
}

function getBenefitList_() {
  const sheet = getBenefitMasterSheet_();
  ensureHeaderRow_(sheet, BENEFIT_HEADERS);

  seedDefaultBenefits_(sheet);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const normalized = values
    .map(function (row) {
      return String(row[0] || "").trim();
    })
    .filter(function (item) {
      return item.length > 0;
    });

  return unique_(normalized);
}

function addBenefit_(payload) {
  const benefitName = String(payload.benefitName || "").trim();
  if (!benefitName) {
    throw new Error("Nama benefit wajib diisi.");
  }

  const existing = getBenefitList_();
  const lowerSet = existing.map(function (item) {
    return item.toLowerCase();
  });

  if (lowerSet.indexOf(benefitName.toLowerCase()) !== -1) {
    throw new Error("Benefit sudah ada.");
  }

  const sheet = getBenefitMasterSheet_();
  ensureHeaderRow_(sheet, BENEFIT_HEADERS);
  sheet.appendRow([benefitName]);
}

function deleteBenefit_(payload) {
  const benefitName = String(payload.benefitName || "").trim();
  if (!benefitName) {
    throw new Error("Nama benefit wajib diisi.");
  }

  const sheet = getBenefitMasterSheet_();
  ensureHeaderRow_(sheet, BENEFIT_HEADERS);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    throw new Error("Belum ada benefit untuk dihapus.");
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const target = benefitName.toLowerCase();

  const rowsToDelete = [];
  values.forEach(function (row, index) {
    const value = String(row[0] || "").trim().toLowerCase();
    if (value === target) {
      rowsToDelete.push(index + 2);
    }
  });

  if (rowsToDelete.length === 0) {
    throw new Error("Benefit tidak ditemukan.");
  }

  rowsToDelete
    .sort(function (a, b) {
      return b - a;
    })
    .forEach(function (rowIndex) {
      sheet.deleteRow(rowIndex);
    });
}

function seedDefaultBenefits_(sheet) {
  const props = PropertiesService.getScriptProperties();
  const isSeeded = props.getProperty(BENEFIT_SEED_FLAG) === "1";
  if (isSeeded) {
    return;
  }

  const current = getColumnValues_(sheet, 2, 1)
    .map(function (item) {
      return String(item).trim();
    })
    .filter(function (item) {
      return item.length > 0;
    });

  if (current.length > 0) {
    props.setProperty(BENEFIT_SEED_FLAG, "1");
    return;
  }

  const rows = DEFAULT_BENEFITS.map(function (item) {
    return [item];
  });

  sheet.getRange(2, 1, rows.length, 1).setValues(rows);
  props.setProperty(BENEFIT_SEED_FLAG, "1");
}

function getColumnValues_(sheet, startRow, column) {
  const lastRow = sheet.getLastRow();
  if (lastRow < startRow) {
    return [];
  }

  return sheet
    .getRange(startRow, column, lastRow - startRow + 1, 1)
    .getValues()
    .map(function (row) {
      return row[0];
    });
}

function unique_(values) {
  const map = {};
  const result = [];

  values.forEach(function (item) {
    const key = item.toLowerCase();
    if (!map[key]) {
      map[key] = true;
      result.push(item);
    }
  });

  return result;
}

function normalizeArray_(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(function (item) {
      return String(item || "").trim();
    })
    .filter(function (item) {
      return item.length > 0;
    });
}

function getAdminSheet_() {
  const spreadsheet = SpreadsheetApp.openById(ADMIN_SPREADSHEET_ID);

  const byGid = spreadsheet
    .getSheets()
    .find(function (sheet) {
      return sheet.getSheetId() === ADMIN_SHEET_GID;
    });

  if (byGid) {
    return byGid;
  }

  const byName = spreadsheet.getSheetByName(ADMIN_SHEET_NAME);
  if (byName) {
    return byName;
  }

  return spreadsheet.insertSheet(ADMIN_SHEET_NAME);
}

function getBenefitMasterSheet_() {
  const spreadsheet = SpreadsheetApp.openById(ADMIN_SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(BENEFIT_MASTER_SHEET_NAME);

  if (sheet) {
    return sheet;
  }

  return spreadsheet.insertSheet(BENEFIT_MASTER_SHEET_NAME);
}

function ensureHeaderRow_(sheet, headers) {
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeader = firstRow.some(function (item) {
    return String(item || "").trim().length > 0;
  });

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function getAction_(e) {
  const pathInfo = e && e.pathInfo ? String(e.pathInfo) : "";
  const queryAction =
    e && e.parameter && e.parameter.action ? String(e.parameter.action) : "";
  const routeSource = pathInfo || queryAction;

  return routeSource.replace(/^\/+|\/+$/g, "");
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
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
