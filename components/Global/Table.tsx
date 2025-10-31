"use client";

import React from "react";
import Pagination from "./Pagination";

interface Column {
  header: string;
  accessor: string; // Key to access data (e.g., "name", "email")
  render?: (value: any, row: any) => React.ReactNode; // Optional custom renderer
}

interface TableProps {
  columns: Column[];
  data: any[];
  className?: string; // Optional for additional styling
  
  // Pagination props
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  className = "",
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-semibold text-[var(--foreground)] bg-[#f6f5fa] border-b border-[#e1dfeb61]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#e1dfeb61] transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-[var(--foreground)] border-b border-[#e1dfeb61]"
                  >
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-[var(--foreground)]"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      {showPagination && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      )}
    </div>
  );
};

export default Table;