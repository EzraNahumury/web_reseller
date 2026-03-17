const SPREADSHEET_ID = "1vgYfhR9XdC6_me_9eM0GIk1QoLJTw-hFu5dhMyS2m0w";
const SHEET_NAME = "Form Responses 1";

const FIELD_MAP = [
  { header: "Nama Lengkap", key: "namaLengkap" },
  { header: "Status Reseller Ayres", key: "statusResellerAyres" },
  { header: "Nomor Telepon / WhatsApp", key: "nomorWhatsapp" },
  { header: "Alamat Lengkap", key: "alamatLengkap" },
  { header: "Lokasi Toko (Jika Ada)", key: "lokasiToko" },
  { header: "Jenis Reseller", key: "jenisReseller" },
];

function doGet(e) {
  try {
    const route = getRoute_(e);

    if (route === "/resellers") {
      return toJson_({
        success: true,
        message: "Berhasil mengambil data reseller.",
        data: getResellers_(),
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
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 2) {
    return [];
  }

  const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const headerMap = makeHeaderMap_(headerRow);
  const rows = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();

  return rows.map((row, rowOffset) => {
    const item = {
      rowIndex: rowOffset + 2,
    };

    FIELD_MAP.forEach((field) => {
      const headerIndex = headerMap[field.header];
      item[field.key] =
        headerIndex === undefined ? "" : String(row[headerIndex] || "").trim();
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
  const lastColumn = sheet.getLastColumn();

  if (rowIndex > lastRow) {
    throw new Error("Data tidak ditemukan. rowIndex melebihi jumlah row.");
  }

  const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const headerMap = makeHeaderMap_(headerRow);
  const currentRow = sheet.getRange(rowIndex, 1, 1, lastColumn).getValues()[0];

  FIELD_MAP.forEach((field) => {
    const headerIndex = headerMap[field.header];
    if (headerIndex === undefined) {
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

function makeHeaderMap_(headerRow) {
  const map = {};
  headerRow.forEach((name, index) => {
    const key = String(name || "").trim();
    if (key) {
      map[key] = index;
    }
  });
  return map;
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
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
