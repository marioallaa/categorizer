import { Box, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

const TableComponent = ({ csvData }) => {
  if (!csvData || csvData.length === 0) return null;

  const allKeys = Object.keys(csvData[0]);
  const first6Keys = allKeys.slice(0, 6);
  const remainingColumns = allKeys.length - 6;
  const first5Rows = csvData.slice(0, 5);
  const last5Rows = csvData.slice(-5);
  const middleRowCount = csvData.length - 10;

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '16px' }}>
        <thead>
          <tr>
            {first6Keys.map((key) => (
              <th key={key} style={{ textAlign: 'left', border: '1px solid #ddd', padding: '8px' }}>
                {key}
              </th>
            ))}
            {remainingColumns > 0 && (
              <th colSpan={1} style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                <strong>+{remainingColumns}</strong>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {first5Rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {first6Keys.map((key) => (
                <td key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <Tooltip title={row[key]} placement="top">
                    <Typography noWrap>{row[key]}</Typography>
                  </Tooltip>
                </td>
              ))}
              {remainingColumns > 0 && (
                <td rowSpan={middleRowCount > 0 ? middleRowCount + 1 : 1} style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                  <strong>+{remainingColumns} columns</strong>
                </td>
              )}
            </tr>
          ))}
          {middleRowCount > 0 && (
            <tr>
              <td colSpan={first6Keys.length + (remainingColumns > 0 ? 1 : 0)} style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                <Typography sx={{fontWeight: '100', color: '#636363', fontStyle: 'italic'}}>{middleRowCount} more rows...</Typography>
              </td>
            </tr>
          )}
          {last5Rows.map((row, rowIndex) => (
            <tr key={rowIndex + 5}>
              {first6Keys.map((key) => (
                <td key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <Tooltip title={row[key]} placement="top">
                    <Typography noWrap>{row[key]}</Typography>
                  </Tooltip>
                </td>
              ))}
              {remainingColumns > 0 && rowIndex === 0 && (
                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                  <strong>+{remainingColumns} columns</strong>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default TableComponent;
