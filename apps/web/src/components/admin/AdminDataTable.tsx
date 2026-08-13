import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function AdminDataTable<T>({ 
  columns, 
  data, 
  onRowClick,
  page,
  totalPages,
  onPageChange
}: AdminDataTableProps<T>) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-4 py-3 font-medium whitespace-nowrap ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-muted/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, j) => (
                    <td key={j} className={`px-4 py-3 whitespace-nowrap ${col.className || ''}`}>
                      {typeof col.accessor === 'function' 
                        ? col.accessor(row) 
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {page !== undefined && totalPages !== undefined && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button 
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              className="p-1.5 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              className="p-1.5 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
