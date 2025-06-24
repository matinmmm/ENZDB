const path = require('path');
const XLSX = require('xlsx');

// Path to the Excel file. For now, expecting data.xlsx in project root.
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '../../data.xlsx');

let workbookCache = null; // XLSX workbook cached in memory
const sheetCache = new Map(); // Map<sheetName, parsedRows>

function getWorkbook() {
  if (!workbookCache) {
    workbookCache = XLSX.readFile(DATA_FILE);
  }
  return workbookCache;
}

function getSheetNames() {
  return getWorkbook().SheetNames;
}

/**
 * Load material data from Excel.
 * Caches result in memory for performance.
 */
function loadMaterialData(sheetName) {
  try {
    const workbook = getWorkbook();
    const name = sheetName || workbook.SheetNames[0];
    if (sheetCache.has(name)) {
      return Promise.resolve(sheetCache.get(name));
    }

    const sheet = workbook.Sheets[name];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const normalized = json.map((row) => {
      const keys = Object.keys(row);

      // Dynamically find material and wavelength keys if unexpected naming
      const materialKey = keys.find((k) => /material/i.test(k)) || keys.find((k) => /mat/i.test(k));
      const wavelengthKey = keys.find((k) => /wavelength|lambda|λ/i.test(k));

      const getNumber = (val) => {
        if (val == null) return null;
        if (typeof val === 'number') return val;
        // Remove non-numeric characters (nm, µm, spaces, etc.)
        const num = parseFloat(String(val).replace(/[^0-9.+-eE]/g, ''));
        return isNaN(num) ? null : num;
      };

      return {
        material: row['Material'] || row['material'] || row['MAT'] || (materialKey ? row[materialKey] : 'Unknown'),
        wavelength: getNumber(row['Wavelength'] ?? row['wavelength'] ?? row['λ'] ?? row['lambda'] ?? (wavelengthKey ? row[wavelengthKey] : null)),
        n: getNumber(row['n']),
        k: getNumber(row['k']),
        Re_e: getNumber(row['Re(ε)'] ?? row['Re_e'] ?? row['Re e'] ?? row['Reeps']),
        Im_e: getNumber(row['Im(ε)'] ?? row['Im_e'] ?? row['Im e'] ?? row['Imeps']),
        Q: getNumber(row['Q']),
        PL: getNumber(row['PL']),
        Con: getNumber(row['Con']),
        Q_PL: getNumber(row['Q_PL'] ?? row['Q PL'] ?? row['Q-PL']),
        Q_con: getNumber(row['Q_con'] ?? row['Q Con'] ?? row['Q-con']),
      };
    });

    sheetCache.set(name, normalized);
    return Promise.resolve(normalized);
  } catch (err) {
    return Promise.reject(err);
  }
}

function toNumber(value) {
  const num = Number(value);
  return isNaN(num) ? null : num;
}

module.exports = { loadMaterialData, getSheetNames }; 