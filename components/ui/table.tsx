import React from "react";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    className={`w-full caption-bottom text-sm border-collapse border border-slate-200 dark:border-slate-700 ${className}`}
    ref={ref}
    {...props}
  />
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    className={`bg-slate-100 dark:bg-slate-800 ${className}`}
    ref={ref}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <tbody className={className || undefined} ref={ref} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    className={`border-b border-slate-200 dark:border-slate-700 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800 ${className}`}
    ref={ref}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    className={`h-12 px-4 text-left align-middle font-semibold text-slate-900 dark:text-slate-100 [&:has([role=checkbox])]:pr-0 ${className}`}
    ref={ref}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    className={`p-4 align-middle text-slate-500 dark:text-slate-400 ${className}`}
    ref={ref}
    {...props}
  />
));
TableCell.displayName = "TableCell";
