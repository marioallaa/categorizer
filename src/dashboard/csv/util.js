import * as XLSX from 'xlsx';

export const mergeAndExportToExcel = (
  fileName = 'categorized.xlsx',
  catMoneyIn = [],
  catMoneyOut = []
) => {
  const workbook = XLSX.utils.book_new();

  const formatCellsAsNumbers = (dataArray) => {
    return dataArray.map(row => {
      const formattedRow = {};
      Object.keys(row).forEach(key => {
        const value = row[key];
        // Check if the value is a number
        if (!isNaN(value) && value !== null && value !== '') {
          formattedRow[key] = parseFloat(value); // Convert to a number
        } else {
          formattedRow[key] = value; // Keep as is (text)
        }
      });
      return formattedRow;
    });
  };

  if (catMoneyIn && catMoneyIn.length > 0) {
    const formattedCatMoneyIn = formatCellsAsNumbers(catMoneyIn);
    const worksheet = XLSX.utils.json_to_sheet(formattedCatMoneyIn);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'F3-1');
  }

  if (catMoneyOut && catMoneyOut.length > 0) {
    const formattedCatMoneyOut = formatCellsAsNumbers(catMoneyOut);
    const worksheet = XLSX.utils.json_to_sheet(formattedCatMoneyOut);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'F3-2');
  }

  XLSX.writeFile(workbook, fileName);
};